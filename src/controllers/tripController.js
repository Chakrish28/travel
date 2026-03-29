const { getPool } = require('../config/mysql');
const notificationService = require('../services/notificationService');
const Finalization = require('../models/Finalization');

const tripController = {
  async createTrip(req, res) {
    try {
      const pool = getPool();
      const { destination, description, start_date, end_date, trip_type, budget, travel_style, max_participants, currency, from_location } = req.body;
      const cover_image = req.file ? `/uploads/${req.file.filename}` : '';

      // Check if start_date is in the past
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const tripStart = new Date(start_date);
      tripStart.setHours(0, 0, 0, 0);
      if (tripStart < todayDate) {
        return res.status(400).json({ error: 'Start date cannot be in the past.' });
      }

      const tripEnd = new Date(end_date);
      tripEnd.setHours(0, 0, 0, 0);
      if (tripEnd < tripStart) {
        return res.status(400).json({ error: 'End date cannot be before start date.' });
      }

      // Date conflict check
      const [conflicts] = await pool.query(`
        SELECT t.* FROM trips t
        JOIN trip_members tm ON t.id = tm.trip_id
        WHERE tm.user_id = ? AND t.status NOT IN ('completed', 'cancelled')
          AND NOT (t.end_date < ? OR t.start_date > ?)
      `, [req.user.id, start_date, end_date]);

      if (conflicts.length) {
        return res.status(400).json({ error: 'You have a trip that overlaps with these dates.' });
      }

      const maxP = trip_type === 'duo' ? 2 : (max_participants || 10);

      const [result] = await pool.query(
        'INSERT INTO trips (host_id, destination, description, start_date, end_date, trip_type, budget, travel_style, max_participants, status, currency, from_location, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, destination, description || '', start_date, end_date, trip_type || 'duo', budget || 0, travel_style || '', maxP, 'draft', currency || 'USD', from_location || '', cover_image]
      );

      // Host becomes a member
      await pool.query(
        'INSERT INTO trip_members (trip_id, user_id, role) VALUES (?, ?, ?)',
        [result.insertId, req.user.id, 'host']
      );

      res.status(201).json({ message: 'Trip created!', tripId: result.insertId });
    } catch (err) {
      console.error('Create trip error:', err);
      res.status(500).json({ error: 'Trip creation failed.' });
    }
  },

  async getTrip(req, res) {
    try {
      const pool = getPool();
      const { id } = req.params;

      const [trips] = await pool.query(`
        SELECT t.*, u.name as host_name, u.profile_picture as host_picture
        FROM trips t JOIN users u ON t.host_id = u.id WHERE t.id = ?
      `, [id]);
      if (!trips.length) return res.status(404).json({ error: 'Trip not found.' });

      const [members] = await pool.query(`
        SELECT tm.*, u.name, u.profile_picture, u.companion_score
        FROM trip_members tm JOIN users u ON tm.user_id = u.id WHERE tm.trip_id = ?
      `, [id]);

      const [requests] = await pool.query(`
        SELECT tr.*, u.name, u.profile_picture, u.companion_score
        FROM trip_requests tr JOIN users u ON tr.user_id = u.id
        WHERE tr.trip_id = ? AND tr.status = 'pending' AND tr.type = 'join_request'
      `, [id]);

      const trip = trips[0];
      trip.itinerary = trip.itinerary || [];

      res.json({ trip, members, requests });
    } catch (err) {
      console.error('Get trip error:', err);
      res.status(500).json({ error: 'Failed to load trip.' });
    }
  },

  async getMyTrips(req, res) {
    try {
      const pool = getPool();

      const [trips] = await pool.query(`
        SELECT t.*, u.name as host_name,
          (SELECT COUNT(*) FROM trip_members WHERE trip_id = t.id) as member_count
        FROM trips t
        JOIN trip_members tm ON t.id = tm.trip_id
        JOIN users u ON t.host_id = u.id
        WHERE tm.user_id = ?
        ORDER BY t.start_date DESC
      `, [req.user.id]);

      res.json({ trips });
    } catch (err) {
      console.error('My trips error:', err);
      res.status(500).json({ error: 'Failed to load trips.' });
    }
  },

  async exploreTrips(req, res) {
    try {
      const pool = getPool();
      const { from, to } = req.query;

      let whereClause = `t.status IN ('draft', 'invited', 'upcoming')
          AND t.host_id != ?
          AND t.id NOT IN (SELECT trip_id FROM trip_members WHERE user_id = ?)`;
      const params = [req.user.id, req.user.id];

      if (from) {
        whereClause += ' AND t.from_location LIKE ?';
        params.push(`%${from}%`);
      }
      if (to) {
        whereClause += ' AND t.destination LIKE ?';
        params.push(`%${to}%`);
      }

      const [trips] = await pool.query(`
        SELECT t.*, u.name as host_name, u.profile_picture as host_picture,
          (SELECT COUNT(*) FROM trip_members WHERE trip_id = t.id) as member_count
        FROM trips t
        JOIN users u ON t.host_id = u.id
        WHERE ${whereClause}
        ORDER BY t.start_date ASC
        LIMIT 50
      `, params);

      res.json({ trips });
    } catch (err) {
      console.error('Explore error:', err);
      res.status(500).json({ error: 'Failed to explore trips.' });
    }
  },

  async requestToJoin(req, res) {
    try {
      const pool = getPool();
      const { tripId } = req.params;

      // Check trip exists and has room
      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ?', [tripId]);
      if (!trips.length) return res.status(404).json({ error: 'Trip not found.' });

      const trip = trips[0];

      // Check if requests are closed
      if (trip.requests_closed) {
        return res.status(400).json({ error: 'This trip is no longer accepting join requests.' });
      }

      const [memberCount] = await pool.query('SELECT COUNT(*) as cnt FROM trip_members WHERE trip_id = ?', [tripId]);
      if (memberCount[0].cnt >= trip.max_participants) {
        return res.status(400).json({ error: 'Trip is full.' });
      }

      // Date conflict
      const [conflicts] = await pool.query(`
        SELECT t.* FROM trips t
        JOIN trip_members tm ON t.id = tm.trip_id
        WHERE tm.user_id = ? AND t.status NOT IN ('completed', 'cancelled')
          AND NOT (t.end_date < ? OR t.start_date > ?)
      `, [req.user.id, trip.start_date, trip.end_date]);

      if (conflicts.length) {
        return res.status(400).json({ error: 'You have a trip that overlaps with these dates.' });
      }

      // Check existing request
      const [existing] = await pool.query(
        'SELECT id FROM trip_requests WHERE trip_id = ? AND user_id = ? AND status = ?',
        [tripId, req.user.id, 'pending']
      );
      if (existing.length) {
        return res.status(400).json({ error: 'You already have a pending request.' });
      }

      await pool.query(
        'INSERT INTO trip_requests (trip_id, user_id, status, type) VALUES (?, ?, ?, ?)',
        [tripId, req.user.id, 'pending', 'join_request']
      );

      await notificationService.joinRequest(trip.host_id, tripId, req.user.name, trip.destination);

      res.json({ message: 'Join request sent!' });
    } catch (err) {
      console.error('Join request error:', err);
      res.status(500).json({ error: 'Request failed.' });
    }
  },

  async inviteUser(req, res) {
    try {
      const pool = getPool();
      const { tripId } = req.params;
      const { userId } = req.body;

      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ? AND host_id = ?', [tripId, req.user.id]);
      if (!trips.length) return res.status(403).json({ error: 'Not authorized.' });

      const trip = trips[0];

      // Check member count
      const [memberCount] = await pool.query('SELECT COUNT(*) as cnt FROM trip_members WHERE trip_id = ?', [tripId]);
      if (memberCount[0].cnt >= trip.max_participants) {
        return res.status(400).json({ error: 'Trip is full.' });
      }

      // Date conflict for invited user
      const [conflicts] = await pool.query(`
        SELECT t.* FROM trips t
        JOIN trip_members tm ON t.id = tm.trip_id
        WHERE tm.user_id = ? AND t.status NOT IN ('completed', 'cancelled')
          AND NOT (t.end_date < ? OR t.start_date > ?)
      `, [userId, trip.start_date, trip.end_date]);

      if (conflicts.length) {
        return res.status(400).json({ error: 'User has a conflicting trip.' });
      }

      await pool.query(
        'INSERT INTO trip_requests (trip_id, user_id, status, type) VALUES (?, ?, ?, ?)',
        [tripId, userId, 'pending', 'invitation']
      );

      if (trip.status === 'draft') {
        await pool.query('UPDATE trips SET status = ? WHERE id = ?', ['invited', tripId]);
      }

      await notificationService.tripInvitation(userId, tripId, req.user.name, trip.destination);

      res.json({ message: 'Invitation sent!' });
    } catch (err) {
      console.error('Invite error:', err);
      res.status(500).json({ error: 'Invitation failed.' });
    }
  },

  async handleRequest(req, res) {
    try {
      const pool = getPool();
      const { requestId } = req.params;
      const { action } = req.body; // accept or reject

      const [requests] = await pool.query(`
        SELECT tr.*, t.host_id, t.destination, t.start_date, t.end_date, t.max_participants
        FROM trip_requests tr
        JOIN trips t ON tr.trip_id = t.id
        WHERE tr.id = ?
      `, [requestId]);

      if (!requests.length) return res.status(404).json({ error: 'Request not found.' });

      const request = requests[0];

      // Authorization check
      const isHost = request.host_id === req.user.id;
      const isInvitee = request.user_id === req.user.id && request.type === 'invitation';
      if (!isHost && !isInvitee) {
        return res.status(403).json({ error: 'Not authorized.' });
      }

      if (action === 'accept') {
        // Check member count
        const [memberCount] = await pool.query('SELECT COUNT(*) as cnt FROM trip_members WHERE trip_id = ?', [request.trip_id]);
        if (memberCount[0].cnt >= request.max_participants) {
          return res.status(400).json({ error: 'Trip is full.' });
        }

        // Date conflict re-check
        const [conflicts] = await pool.query(`
          SELECT t.* FROM trips t
          JOIN trip_members tm ON t.id = tm.trip_id
          WHERE tm.user_id = ? AND t.status NOT IN ('completed', 'cancelled')
            AND NOT (t.end_date < ? OR t.start_date > ?)
        `, [request.user_id, request.start_date, request.end_date]);

        if (conflicts.length) {
          await pool.query('UPDATE trip_requests SET status = ? WHERE id = ?', ['rejected', requestId]);
          return res.status(400).json({ error: 'User has a conflicting trip. Request auto-rejected.' });
        }

        await pool.query('UPDATE trip_requests SET status = ? WHERE id = ?', ['accepted', requestId]);
        await pool.query(
          'INSERT IGNORE INTO trip_members (trip_id, user_id, role) VALUES (?, ?, ?)',
          [request.trip_id, request.user_id, 'member']
        );

        // Move trip to upcoming if still invited
        const [trip] = await pool.query('SELECT status FROM trips WHERE id = ?', [request.trip_id]);
        if (trip[0] && ['draft', 'invited'].includes(trip[0].status)) {
          await pool.query('UPDATE trips SET status = ? WHERE id = ?', ['upcoming', request.trip_id]);
        }

        await notificationService.requestAccepted(request.user_id, request.trip_id, request.destination);
      } else {
        await pool.query('UPDATE trip_requests SET status = ? WHERE id = ?', ['rejected', requestId]);
        await notificationService.requestRejected(request.user_id, request.trip_id, request.destination);
      }

      res.json({ message: `Request ${action}ed.` });
    } catch (err) {
      console.error('Handle request error:', err);
      res.status(500).json({ error: 'Action failed.' });
    }
  },

  async getMyRequests(req, res) {
    try {
      const pool = getPool();

      const [requests] = await pool.query(`
        SELECT tr.*, t.destination, t.start_date, t.end_date, t.trip_type, u.name as host_name
        FROM trip_requests tr
        JOIN trips t ON tr.trip_id = t.id
        JOIN users u ON t.host_id = u.id
        WHERE tr.user_id = ?
        ORDER BY tr.created_at DESC
      `, [req.user.id]);

      res.json({ requests });
    } catch (err) {
      console.error('Get requests error:', err);
      res.status(500).json({ error: 'Failed.' });
    }
  },

  async updateTrip(req, res) {
    try {
      const pool = getPool();
      const { id } = req.params;
      const { destination, description, start_date, end_date, budget, travel_style, max_participants, status, currency, from_location, itinerary } = req.body;

      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ? AND host_id = ?', [id, req.user.id]);
      if (!trips.length) return res.status(403).json({ error: 'Not authorized.' });

      const fields = [];
      const values = [];

      if (destination) { fields.push('destination = ?'); values.push(destination); }
      if (description !== undefined) { fields.push('description = ?'); values.push(description); }
      if (start_date) { fields.push('start_date = ?'); values.push(start_date); }
      if (end_date) { fields.push('end_date = ?'); values.push(end_date); }
      if (budget !== undefined) { fields.push('budget = ?'); values.push(budget); }
      if (travel_style) { fields.push('travel_style = ?'); values.push(travel_style); }
      if (max_participants) { fields.push('max_participants = ?'); values.push(max_participants); }
      if (status) { fields.push('status = ?'); values.push(status); }
      if (currency) { fields.push('currency = ?'); values.push(currency); }
      if (from_location !== undefined) { fields.push('from_location = ?'); values.push(from_location); }
      if (itinerary) { fields.push('itinerary = ?'); values.push(JSON.stringify(itinerary)); }

      if (fields.length) {
        values.push(id);
        await pool.query(`UPDATE trips SET ${fields.join(', ')} WHERE id = ?`, values);
      }

      res.json({ message: 'Trip updated.' });
    } catch (err) {
      console.error('Update trip error:', err);
      res.status(500).json({ error: 'Update failed.' });
    }
  },

  async cancelTrip(req, res) {
    try {
      const pool = getPool();
      const { id } = req.params;

      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ? AND host_id = ?', [id, req.user.id]);
      if (!trips.length) return res.status(403).json({ error: 'Not authorized.' });

      await pool.query('UPDATE trips SET status = ? WHERE id = ?', ['cancelled', id]);

      // Increment host cancellation count
      await pool.query('UPDATE users SET cancelled_trips = cancelled_trips + 1 WHERE id = ?', [req.user.id]);

      // Notify members
      const [members] = await pool.query('SELECT user_id FROM trip_members WHERE trip_id = ? AND user_id != ?', [id, req.user.id]);
      for (const m of members) {
        await notificationService.tripUpdate(m.user_id, id, `Trip to ${trips[0].destination} has been cancelled.`);
      }

      res.json({ message: 'Trip cancelled.' });
    } catch (err) {
      console.error('Cancel trip error:', err);
      res.status(500).json({ error: 'Cancellation failed.' });
    }
  },

  async proposeFinalDates(req, res) {
    try {
      const pool = getPool();
      const { tripId } = req.params;
      const { start_date, end_date, budget, description } = req.body;

      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ? AND host_id = ?', [tripId, req.user.id]);
      if (!trips.length) return res.status(403).json({ error: 'Not authorized.' });
      const trip = trips[0];

      // Cancel any existing pending proposal
      await Finalization.updateMany({ tripId: parseInt(tripId), status: 'pending' }, { status: 'rejected' });

      // Get non-host members
      const [members] = await pool.query(
        'SELECT user_id FROM trip_members WHERE trip_id = ? AND user_id != ?',
        [tripId, req.user.id]
      );

      if (!members.length) {
        return res.status(400).json({ error: 'No companions to vote. You can update the trip directly.' });
      }

      const finalization = await Finalization.create({
        tripId: parseInt(tripId),
        proposedBy: req.user.id,
        start_date,
        end_date,
        budget: budget || trip.budget,
        description: description || trip.description,
        totalVoters: members.length
      });

      // Notify all companions
      for (const m of members) {
        await notificationService.finalizationProposal(m.user_id, tripId, req.user.name, trip.destination);
      }

      res.json({ message: 'Finalization proposal sent to all companions!', finalization });
    } catch (err) {
      console.error('Propose final dates error:', err);
      res.status(500).json({ error: 'Proposal failed.' });
    }
  },

  async voteFinalDates(req, res) {
    try {
      const pool = getPool();
      const { tripId } = req.params;
      const { vote, comment } = req.body; // vote: 'accept' or 'reject'

      const finalization = await Finalization.findOne({ tripId: parseInt(tripId), status: 'pending' });
      if (!finalization) return res.status(404).json({ error: 'No pending proposal found.' });

      // Check user is a member but not the host
      const [membership] = await pool.query(
        'SELECT role FROM trip_members WHERE trip_id = ? AND user_id = ?',
        [tripId, req.user.id]
      );
      if (!membership.length) return res.status(403).json({ error: 'Not a trip member.' });
      if (membership[0].role === 'host') return res.status(400).json({ error: 'Host cannot vote on their own proposal.' });

      // Check if already voted
      const alreadyVoted = finalization.votes.find(v => v.userId === req.user.id);
      if (alreadyVoted) return res.status(400).json({ error: 'You have already voted.' });

      finalization.votes.push({
        userId: req.user.id,
        userName: req.user.name,
        vote,
        comment: comment || ''
      });

      // Get trip info for notifications
      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ?', [tripId]);
      const trip = trips[0];

      // Notify host about the vote
      await notificationService.finalizationVote(trip.host_id, tripId, req.user.name, vote, trip.destination);

      if (vote === 'reject') {
        finalization.status = 'rejected';
        await finalization.save();
        return res.json({ message: 'You rejected the proposal. The host has been notified.', status: 'rejected' });
      }

      // Check if all have voted and accepted
      const acceptCount = finalization.votes.filter(v => v.vote === 'accept').length;
      if (acceptCount >= finalization.totalVoters) {
        // All accepted — update the trip!
        finalization.status = 'accepted';
        await finalization.save();

        await pool.query(
          'UPDATE trips SET start_date = ?, end_date = ?, budget = ?, description = ?, status = ? WHERE id = ?',
          [finalization.start_date, finalization.end_date, finalization.budget, finalization.description, 'upcoming', tripId]
        );

        // Notify everyone
        const [allMembers] = await pool.query('SELECT user_id FROM trip_members WHERE trip_id = ?', [tripId]);
        for (const m of allMembers) {
          await notificationService.finalizationComplete(m.user_id, tripId, trip.destination);
        }

        return res.json({ message: 'All companions agreed! Trip has been finalized! ✅', status: 'accepted' });
      }

      await finalization.save();
      res.json({ message: 'Vote recorded! Waiting for other companions.', status: 'pending' });
    } catch (err) {
      console.error('Vote final dates error:', err);
      res.status(500).json({ error: 'Vote failed.' });
    }
  },

  async getFinalization(req, res) {
    try {
      const { tripId } = req.params;
      const finalization = await Finalization.findOne({ tripId: parseInt(tripId), status: 'pending' });
      const history = await Finalization.find({ tripId: parseInt(tripId) }).sort({ createdAt: -1 }).limit(5);
      res.json({ current: finalization || null, history });
    } catch (err) {
      console.error('Get finalization error:', err);
      res.status(500).json({ error: 'Failed.' });
    }
  },

  async removeMember(req, res) {
    try {
      const pool = getPool();
      const { tripId, userId } = req.params;

      // Only host can remove
      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ? AND host_id = ?', [tripId, req.user.id]);
      if (!trips.length) return res.status(403).json({ error: 'Not authorized.' });

      if (parseInt(userId) === req.user.id) {
        return res.status(400).json({ error: 'Cannot remove yourself. Use cancel trip instead.' });
      }

      await pool.query('DELETE FROM trip_members WHERE trip_id = ? AND user_id = ?', [tripId, userId]);

      // Also reject any pending requests from this user for this trip
      await pool.query(
        "UPDATE trip_requests SET status = 'rejected' WHERE trip_id = ? AND user_id = ? AND status = 'pending'",
        [tripId, userId]
      );

      await notificationService.memberRemoved(parseInt(userId), tripId, trips[0].destination);

      res.json({ message: 'Member removed from trip.' });
    } catch (err) {
      console.error('Remove member error:', err);
      res.status(500).json({ error: 'Removal failed.' });
    }
  },

  async toggleRequests(req, res) {
    try {
      const pool = getPool();
      const { tripId } = req.params;

      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ? AND host_id = ?', [tripId, req.user.id]);
      if (!trips.length) return res.status(403).json({ error: 'Not authorized.' });

      const newState = !trips[0].requests_closed;
      await pool.query('UPDATE trips SET requests_closed = ? WHERE id = ?', [newState, tripId]);

      // If closing, reject all pending requests
      if (newState) {
        await pool.query(
          "UPDATE trip_requests SET status = 'rejected' WHERE trip_id = ? AND status = 'pending' AND type = 'join_request'",
          [tripId]
        );
      }

      res.json({
        message: newState ? 'Requests closed. No new join requests will be accepted.' : 'Requests opened. Users can now request to join.',
        requests_closed: newState
      });
    } catch (err) {
      console.error('Toggle requests error:', err);
      res.status(500).json({ error: 'Failed.' });
    }
  },

  async startTrip(req, res) {
    try {
      const pool = getPool();
      const { tripId } = req.params;

      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ? AND host_id = ?', [tripId, req.user.id]);
      if (!trips.length) return res.status(403).json({ error: 'Not authorized or trip not found.' });
      
      const trip = trips[0];
      if (['completed', 'cancelled', 'active'].includes(trip.status)) {
        return res.status(400).json({ error: `Cannot start trip with status: ${trip.status}` });
      }

      // Prevent starting trip before the start date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tripStartDate = new Date(trip.start_date);
      tripStartDate.setHours(0, 0, 0, 0);
      if (today < tripStartDate) {
        return res.status(400).json({ error: `Cannot start trip before the start date (${tripStartDate.toLocaleDateString()}).` });
      }

      await pool.query('UPDATE trips SET status = ? WHERE id = ?', ['active', tripId]);

      // Notify members
      const [members] = await pool.query('SELECT user_id FROM trip_members WHERE trip_id = ? AND user_id != ?', [tripId, req.user.id]);
      for (const m of members) {
        await notificationService.tripUpdate(m.user_id, tripId, `The trip to ${trip.destination} has officially started! Safety tools are active.`);
      }

      res.json({ message: 'Trip started successfully!' });
    } catch (err) {
      console.error('Start trip error:', err);
      res.status(500).json({ error: 'Failed to start trip.' });
    }
  },

  async completeTrip(req, res) {
    try {
      const pool = getPool();
      const { tripId } = req.params;

      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ? AND host_id = ?', [tripId, req.user.id]);
      if (!trips.length) return res.status(403).json({ error: 'Not authorized or trip not found.' });
      
      const trip = trips[0];
      if (trip.status !== 'active') {
        return res.status(400).json({ error: 'Only an active trip can be marked as completed.' });
      }

      await pool.query('UPDATE trips SET status = ? WHERE id = ?', ['completed', tripId]);

      // Increment completed_trips for all members
      const [members] = await pool.query('SELECT user_id FROM trip_members WHERE trip_id = ?', [tripId]);
      for (const m of members) {
        await pool.query('UPDATE users SET completed_trips = completed_trips + 1 WHERE id = ?', [m.user_id]);
        if (m.user_id !== req.user.id) {
          await notificationService.tripUpdate(m.user_id, tripId, `The trip to ${trip.destination} has been marked as completed! You can now leave reviews.`);
        }
      }

      res.json({ message: 'Trip completed successfully!' });
    } catch (err) {
      console.error('Complete trip error:', err);
      res.status(500).json({ error: 'Failed to complete trip.' });
    }
  },

  async autoUpdateTripStatus() {
    try {
      const pool = getPool();
      const today = new Date().toISOString().split('T')[0];

      // Upcoming → Active
      const [toActivate] = await pool.query(
        "UPDATE trips SET status = 'active' WHERE status = 'upcoming' AND start_date <= ?",
        [today]
      );

      // Active → Completed
      const [toComplete] = await pool.query(
        "SELECT id, host_id, destination FROM trips WHERE status = 'active' AND end_date < ?",
        [today]
      );

      for (const trip of toComplete) {
        await pool.query("UPDATE trips SET status = 'completed' WHERE id = ?", [trip.id]);

        // Increment completed trips for all members
        const [members] = await pool.query('SELECT user_id FROM trip_members WHERE trip_id = ?', [trip.id]);
        for (const m of members) {
          await pool.query('UPDATE users SET completed_trips = completed_trips + 1 WHERE id = ?', [m.user_id]);
        }
      }

      // Expire old pending requests
      await pool.query(
        "UPDATE trip_requests SET status = 'expired' WHERE status = 'pending' AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)"
      );
    } catch (err) {
      console.error('Auto-update error:', err);
    }
  },

  async deleteTrip(req, res) {
    try {
      const pool = getPool();
      const { tripId } = req.params;

      const [trips] = await pool.query('SELECT * FROM trips WHERE id = ? AND host_id = ?', [tripId, req.user.id]);
      if (!trips.length) return res.status(403).json({ error: 'Not authorized.' });

      if (trips[0].status !== 'draft') {
        return res.status(400).json({ error: 'Only draft trips can be deleted. Cancel the trip instead.' });
      }

      // Delete related data
      await pool.query('DELETE FROM trip_requests WHERE trip_id = ?', [tripId]);
      await pool.query('DELETE FROM expenses WHERE trip_id = ?', [tripId]);
      await pool.query('DELETE FROM trip_members WHERE trip_id = ?', [tripId]);
      await pool.query('DELETE FROM trips WHERE id = ?', [tripId]);

      res.json({ message: 'Trip deleted permanently.' });
    } catch (err) {
      console.error('Delete trip error:', err);
      res.status(500).json({ error: 'Deletion failed.' });
    }
  }
};

module.exports = tripController;
