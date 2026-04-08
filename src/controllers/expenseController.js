const { getPool } = require('../config/mysql');

const expenseController = {
  async addExpense(req, res) {
    try {
      const pool = getPool();
      const { tripId } = req.params;
      const { amount, description, split_between, owes } = req.body;

      // Check membership
      const [member] = await pool.query(
        'SELECT id FROM trip_members WHERE trip_id = ? AND user_id = ?',
        [tripId, req.user.id]
      );
      if (!member.length) {
        return res.status(403).json({ error: 'Not a trip member.' });
      }

      // Check trip is not completed/cancelled
      const [trips] = await pool.query('SELECT status FROM trips WHERE id = ?', [tripId]);
      if (trips.length && ['completed', 'cancelled'].includes(trips[0].status)) {
        return res.status(400).json({ error: 'Cannot add expenses to a completed or cancelled trip.' });
      }

      await pool.query(
        'INSERT INTO expenses (trip_id, paid_by, amount, description, split_between, owes_details) VALUES (?, ?, ?, ?, ?, ?)',
        [tripId, req.user.id, amount, description || '', JSON.stringify(split_between), JSON.stringify(owes || [])]
      );

      res.status(201).json({ message: 'Expense added!' });
    } catch (err) {
      console.error('Add expense error:', err);
      res.status(500).json({ error: 'Failed to add expense.' });
    }
  },

  async getTripExpenses(req, res) {
    try {
      const pool = getPool();
      const { tripId } = req.params;

      const [expenses] = await pool.query(`
        SELECT e.*, u.name as paid_by_name
        FROM expenses e
        JOIN users u ON e.paid_by = u.id
        WHERE e.trip_id = ?
        ORDER BY e.created_at DESC
      `, [tripId]);

      expenses.forEach(e => {
        if (typeof e.split_between === 'string') e.split_between = JSON.parse(e.split_between || '[]');
        if (!Array.isArray(e.split_between)) e.split_between = [];
        if (typeof e.owes_details === 'string') e.owes_details = JSON.parse(e.owes_details || '[]');
        if (!Array.isArray(e.owes_details)) e.owes_details = [];
      });

      // Calculate balances using owes_details (new model) or equal split (legacy)
      const [members] = await pool.query(`
        SELECT tm.user_id, u.name FROM trip_members tm
        JOIN users u ON tm.user_id = u.id WHERE tm.trip_id = ?
      `, [tripId]);

      const balances = {};
      members.forEach(m => { balances[m.user_id] = { name: m.name, paid: 0, owes: 0, net: 0 }; });

      expenses.forEach(e => {
        if (balances[e.paid_by]) {
          balances[e.paid_by].paid += parseFloat(e.amount);
        }

        if (e.owes_details && e.owes_details.length) {
          // New model: specific amounts per person
          e.owes_details.forEach(o => {
            if (balances[o.userId]) {
              balances[o.userId].owes += parseFloat(o.amount);
            }
          });
        } else {
          // Legacy: equal split
          const splits = e.split_between;
          const share = parseFloat(e.amount) / splits.length;
          splits.forEach(uid => {
            if (balances[uid]) {
              balances[uid].owes += share;
            }
          });
        }
      });

      Object.keys(balances).forEach(uid => {
        balances[uid].net = Math.round((balances[uid].paid - balances[uid].owes) * 100) / 100;
      });

      // Calculate who owes whom
      const settlements = [];
      const debtors = [];
      const creditors = [];

      Object.entries(balances).forEach(([uid, b]) => {
        if (b.net < 0) debtors.push({ id: parseInt(uid), name: b.name, amount: Math.abs(b.net) });
        else if (b.net > 0) creditors.push({ id: parseInt(uid), name: b.name, amount: b.net });
      });

      debtors.sort((a, b) => b.amount - a.amount);
      creditors.sort((a, b) => b.amount - a.amount);

      let i = 0, j = 0;
      while (i < debtors.length && j < creditors.length) {
        const amount = Math.min(debtors[i].amount, creditors[j].amount);
        if (amount > 0.01) {
          settlements.push({
            from: debtors[i].name,
            fromId: debtors[i].id,
            to: creditors[j].name,
            toId: creditors[j].id,
            amount: Math.round(amount * 100) / 100
          });
        }
        debtors[i].amount -= amount;
        creditors[j].amount -= amount;
        if (debtors[i].amount < 0.01) i++;
        if (creditors[j].amount < 0.01) j++;
      }

      res.json({ expenses, balances, settlements, totalSpent: expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0) });
    } catch (err) {
      console.error('Get expenses error:', err);
      res.status(500).json({ error: 'Failed to load expenses.' });
    }
  }
};

module.exports = expenseController;
