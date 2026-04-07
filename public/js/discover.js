// Discover Destinations – Curated Travel Data
const DESTINATIONS = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    emoji: '🇫🇷',
    tagline: 'The City of Light',
    heroGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    bestTime: 'April – June, September – November',
    avgBudget: '$150–250/day',
    currency: 'EUR (€)',
    language: 'French',
    places: [
      { name: 'Eiffel Tower', icon: 'fa-tower-observation', desc: 'Iconic iron lattice tower with panoramic city views. Visit at sunset for the best experience.' },
      { name: 'Louvre Museum', icon: 'fa-building-columns', desc: 'World\'s largest art museum, home to the Mona Lisa and 35,000+ works of art.' },
      { name: 'Notre-Dame Cathedral', icon: 'fa-church', desc: 'Medieval Catholic cathedral, a masterpiece of French Gothic architecture.' },
      { name: 'Montmartre & Sacré-Cœur', icon: 'fa-mountain-city', desc: 'Artistic hilltop neighborhood with the stunning white-domed basilica.' },
      { name: 'Champs-Élysées & Arc de Triomphe', icon: 'fa-road', desc: 'Famous avenue for shopping and strolling, leading to the historic arch.' },
      { name: 'Palace of Versailles', icon: 'fa-landmark', desc: 'Opulent royal château with stunning gardens, just a short train ride away.' }
    ],
    food: ['Croissants & Pain au Chocolat', 'French Onion Soup', 'Coq au Vin', 'Crêpes', 'Macarons from Ladurée'],
    tips: [
      'Get a Paris Museum Pass for skip-the-line access',
      'The metro is the fastest way to get around',
      'Try to learn basic French phrases — locals appreciate it',
      'Many museums are free on the first Sunday of each month',
      'Book Eiffel Tower tickets online in advance'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Classic Paris', plan: 'Morning: Eiffel Tower → Afternoon: Seine River Cruise → Evening: Champs-Élysées & Arc de Triomphe' },
      { day: 'Day 2', title: 'Art & Culture', plan: 'Morning: Louvre Museum (3-4 hrs) → Lunch: Tuileries Garden → Afternoon: Musée d\'Orsay → Evening: Latin Quarter stroll' },
      { day: 'Day 3', title: 'Montmartre & More', plan: 'Morning: Sacré-Cœur & Montmartre → Lunch: Le Marais district → Afternoon: Notre-Dame area → Evening: Moulin Rouge show' },
      { day: 'Day 4', title: 'Day Trip', plan: 'Full day: Palace of Versailles, gardens, and Marie Antoinette\'s hamlet' }
    ]
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    emoji: '🇯🇵',
    tagline: 'Where Tradition Meets Future',
    heroGradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #2c3e50 100%)',
    bestTime: 'March – May (Cherry Blossoms), October – November',
    avgBudget: '$100–200/day',
    currency: 'JPY (¥)',
    language: 'Japanese',
    places: [
      { name: 'Shibuya Crossing', icon: 'fa-person-walking', desc: 'World\'s busiest pedestrian crossing. Best viewed from Starbucks above or Shibuya Sky.' },
      { name: 'Senso-ji Temple', icon: 'fa-torii-gate', desc: 'Tokyo\'s oldest and most significant temple in the Asakusa district.' },
      { name: 'Meiji Shrine', icon: 'fa-tree', desc: 'Serene Shinto shrine surrounded by 170 acres of forest in central Tokyo.' },
      { name: 'Akihabara', icon: 'fa-gamepad', desc: 'Electric Town — paradise for anime, manga, gaming, and electronics.' },
      { name: 'Tsukiji Outer Market', icon: 'fa-fish', desc: 'Fresh sushi, street food, and the authentic Tokyo food experience.' },
      { name: 'Tokyo Skytree', icon: 'fa-tower-broadcast', desc: '634m tall broadcasting tower with observation decks and stunning views.' }
    ],
    food: ['Fresh Sushi & Sashimi', 'Ramen (try Ichiran!)', 'Tempura', 'Takoyaki (Octopus Balls)', 'Matcha desserts'],
    tips: [
      'Get a Suica/Pasmo IC card for trains and convenience stores',
      'Bow when greeting people — it\'s a sign of respect',
      'Carry cash — many small shops don\'t accept cards',
      'Convenience stores (7-Eleven, Lawson) have amazing food',
      'Visit during cherry blossom season (late March – early April)'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Modern Tokyo', plan: 'Morning: Shibuya Crossing & Hachiko → Afternoon: Harajuku & Takeshita Street → Evening: Shinjuku nightlife & Golden Gai' },
      { day: 'Day 2', title: 'Traditional Tokyo', plan: 'Morning: Senso-ji Temple & Asakusa → Afternoon: Ueno Park → Evening: Akihabara' },
      { day: 'Day 3', title: 'Culture & Nature', plan: 'Morning: Meiji Shrine → Afternoon: Yoyogi Park → Evening: Roppongi Hills & Tokyo Tower' },
      { day: 'Day 4', title: 'Day Trip', plan: 'Full day trip to Mt. Fuji or Kamakura\'s Great Buddha and beaches' }
    ]
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    emoji: '🇮🇩',
    tagline: 'Island of the Gods',
    heroGradient: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 50%, #f39c12 100%)',
    bestTime: 'April – October (Dry Season)',
    avgBudget: '$50–120/day',
    currency: 'IDR (Rp)',
    language: 'Indonesian / Balinese',
    places: [
      { name: 'Uluwatu Temple', icon: 'fa-place-of-worship', desc: 'Clifftop sea temple with spectacular sunset views and Kecak fire dance performances.' },
      { name: 'Tegallalang Rice Terraces', icon: 'fa-seedling', desc: 'Iconic stepped rice paddies with dramatic valleys and lush green landscapes.' },
      { name: 'Sacred Monkey Forest', icon: 'fa-tree', desc: 'Sanctuary with 700+ monkeys, ancient temples, and jungle pathways in Ubud.' },
      { name: 'Tanah Lot Temple', icon: 'fa-water', desc: 'Offshore pilgrimage temple perched on a rock formation, surrounded by crashing waves.' },
      { name: 'Mount Batur', icon: 'fa-mountain-sun', desc: 'Active volcano with sunrise trekking tours — one of Bali\'s most rewarding experiences.' },
      { name: 'Nusa Penida', icon: 'fa-umbrella-beach', desc: 'Dramatic island with Kelingking Beach, Angel\'s Billabong, and crystal-clear waters.' }
    ],
    food: ['Nasi Goreng (Fried Rice)', 'Satay Skewers', 'Babi Guling (Roast Pig)', 'Lawar (Balinese Salad)', 'Fresh Coconut Water'],
    tips: [
      'Rent a scooter for the cheapest and most flexible transport',
      'Always carry a sarong — required for temple visits',
      'Haggle at markets but be respectful',
      'Stay in Ubud for culture, Seminyak/Canggu for beaches & nightlife',
      'Book sunrise trek to Mt. Batur at least a day ahead'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Ubud & Culture', plan: 'Morning: Sacred Monkey Forest → Afternoon: Tegallalang Rice Terraces → Evening: Traditional Balinese dance' },
      { day: 'Day 2', title: 'Temples & Volcanoes', plan: 'Pre-dawn: Mt. Batur sunrise trek → Afternoon: Tirta Empul holy spring → Evening: Rest at hotel' },
      { day: 'Day 3', title: 'Beach & Temples', plan: 'Morning: Tanah Lot Temple → Afternoon: Seminyak beach → Evening: Uluwatu Temple & Kecak dance' },
      { day: 'Day 4', title: 'Island Hopping', plan: 'Full day: Nusa Penida tour — Kelingking Beach, Angel\'s Billabong, Crystal Bay snorkeling' }
    ]
  },
  {
    id: 'newyork',
    name: 'New York City',
    country: 'USA',
    emoji: '🇺🇸',
    tagline: 'The City That Never Sleeps',
    heroGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    bestTime: 'April – June, September – November',
    avgBudget: '$200–350/day',
    currency: 'USD ($)',
    language: 'English',
    places: [
      { name: 'Statue of Liberty', icon: 'fa-monument', desc: 'Iconic symbol of freedom on Liberty Island — take the ferry from Battery Park.' },
      { name: 'Central Park', icon: 'fa-tree', desc: '843-acre urban park with lakes, gardens, theaters, and endless walking paths.' },
      { name: 'Times Square', icon: 'fa-display', desc: 'Dazzling intersection of Broadway, neon lights, and the energy of NYC.' },
      { name: 'Empire State Building', icon: 'fa-building', desc: 'Art Deco masterpiece with 86th-floor observation deck for panoramic views.' },
      { name: 'Brooklyn Bridge', icon: 'fa-bridge', desc: 'Walk across this 1883 suspension bridge for stunning views of the Manhattan skyline.' },
      { name: 'Metropolitan Museum of Art', icon: 'fa-palette', desc: 'One of the world\'s largest art museums with 5,000 years of global art.' }
    ],
    food: ['New York Pizza Slice', 'Bagels with Lox & Cream Cheese', 'Pastrami Sandwich (Katz\'s Deli)', 'Cheesecake', 'Hot Dogs from a street cart'],
    tips: [
      'Get a MetroCard or use OMNY tap-to-pay for subway',
      'Walk across the Brooklyn Bridge from Brooklyn → Manhattan for the best views',
      'Broadway show? Try TKTS booth at Times Square for discount same-day tickets',
      'Many museums have "pay what you wish" hours',
      'Don\'t eat in Times Square — go to any other neighborhood for better food & prices'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Manhattan Icons', plan: 'Morning: Statue of Liberty & Ellis Island → Afternoon: Wall Street → Evening: Times Square & Broadway show' },
      { day: 'Day 2', title: 'Uptown', plan: 'Morning: Central Park walk → Afternoon: Metropolitan Museum of Art → Evening: Top of the Rock sunset' },
      { day: 'Day 3', title: 'Brooklyn & Bridges', plan: 'Morning: Brooklyn Bridge walk → Afternoon: DUMBO & Brooklyn Heights → Evening: Williamsburg food scene' },
      { day: 'Day 4', title: 'Culture & Arts', plan: 'Morning: 9/11 Memorial → Afternoon: Chelsea Market & High Line → Evening: Greenwich Village jazz club' }
    ]
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    emoji: '🇦🇪',
    tagline: 'Where Dreams Touch the Sky',
    heroGradient: 'linear-gradient(135deg, #c6a92b 0%, #d4a017 50%, #1a1a2e 100%)',
    bestTime: 'November – March',
    avgBudget: '$150–300/day',
    currency: 'AED (د.إ)',
    language: 'Arabic / English',
    places: [
      { name: 'Burj Khalifa', icon: 'fa-building', desc: 'World\'s tallest building (828m). Visit the 148th floor observation deck At The Top.' },
      { name: 'Dubai Mall', icon: 'fa-bag-shopping', desc: 'World\'s largest mall with 1,200+ shops, aquarium, ice rink, and the Dubai Fountain.' },
      { name: 'Palm Jumeirah', icon: 'fa-umbrella-beach', desc: 'Iconic palm-shaped island with luxury resorts, beaches, and Atlantis The Palm.' },
      { name: 'Dubai Marina', icon: 'fa-ship', desc: 'Stunning waterfront promenade with skyscrapers, restaurants, and yacht cruises.' },
      { name: 'Old Dubai – Gold & Spice Souks', icon: 'fa-store', desc: 'Traditional markets in Deira with gold, spices, textiles, and an abra boat ride.' },
      { name: 'Desert Safari', icon: 'fa-sun', desc: 'Thrilling dune bashing, camel rides, sandboarding, and BBQ dinner under the stars.' }
    ],
    food: ['Shawarma', 'Al Machboos (Spiced Rice)', 'Luqaimat (Sweet Dumplings)', 'Camel Burger', 'Arabic Coffee & Dates'],
    tips: [
      'Friday is the weekly holiday — many shops/restaurants have different hours',
      'Dress modestly when visiting mosques and traditional areas',
      'The metro is clean, fast, and covers major attractions',
      'Download RTA and Careem apps for transport',
      'Visit the Dubai Fountain show (free) every 30 min after 6 PM'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Modern Dubai', plan: 'Morning: Burj Khalifa → Afternoon: Dubai Mall & Aquarium → Evening: Dubai Fountain show' },
      { day: 'Day 2', title: 'Beach & Islands', plan: 'Morning: Palm Jumeirah & Atlantis → Afternoon: JBR Beach → Evening: Dubai Marina cruise' },
      { day: 'Day 3', title: 'Old Dubai', plan: 'Morning: Gold & Spice Souks → Afternoon: Dubai Museum → Evening: Abra ride across the Creek' },
      { day: 'Day 4', title: 'Desert Adventure', plan: 'Morning: Global Village → Afternoon: Miracle Garden → Evening: Desert Safari with BBQ dinner' }
    ]
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    emoji: '🇮🇹',
    tagline: 'The Eternal City',
    heroGradient: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #2c3e50 100%)',
    bestTime: 'April – June, September – October',
    avgBudget: '$120–220/day',
    currency: 'EUR (€)',
    language: 'Italian',
    places: [
      { name: 'Colosseum', icon: 'fa-landmark', desc: 'Ancient gladiatorial arena, one of the New Seven Wonders of the World.' },
      { name: 'Vatican City & St. Peter\'s', icon: 'fa-church', desc: 'The smallest country in the world — see the Sistine Chapel & St. Peter\'s Basilica.' },
      { name: 'Trevi Fountain', icon: 'fa-droplet', desc: 'Baroque masterpiece — toss a coin to ensure your return to Rome!' },
      { name: 'Pantheon', icon: 'fa-building-columns', desc: 'Best-preserved ancient Roman building with a stunning unreinforced concrete dome.' },
      { name: 'Roman Forum', icon: 'fa-monument', desc: 'Walk through the ruins of the center of ancient Roman public life.' },
      { name: 'Spanish Steps', icon: 'fa-stairs', desc: '135 steps connecting Piazza di Spagna to Trinità dei Monti church.' }
    ],
    food: ['Pasta Carbonara', 'Cacio e Pepe', 'Supplì (Fried Rice Balls)', 'Gelato', 'Espresso at a local bar'],
    tips: [
      'Book Vatican tickets online weeks in advance — lines are insane',
      'Dress code for churches: covered shoulders and knees',
      'Eat where locals eat — avoid restaurants right next to major landmarks',
      'The Roma Pass gives you free metro rides and museum discounts',
      'Drink free water from the nasoni (public drinking fountains)'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Ancient Rome', plan: 'Morning: Colosseum & Roman Forum → Afternoon: Palatine Hill → Evening: Trastevere dinner' },
      { day: 'Day 2', title: 'Vatican Day', plan: 'Morning: Vatican Museums & Sistine Chapel → Afternoon: St. Peter\'s Basilica → Evening: Castel Sant\'Angelo' },
      { day: 'Day 3', title: 'Baroque Rome', plan: 'Morning: Pantheon & Piazza Navona → Afternoon: Trevi Fountain & Spanish Steps → Evening: Via del Corso shopping' },
      { day: 'Day 4', title: 'Hidden Gems', plan: 'Morning: Borghese Gallery → Afternoon: Appian Way → Evening: Gelato tour in Testaccio' }
    ]
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    emoji: '🇹🇭',
    tagline: 'City of Angels',
    heroGradient: 'linear-gradient(135deg, #e67e22 0%, #f39c12 50%, #8e44ad 100%)',
    bestTime: 'November – February (Cool & Dry)',
    avgBudget: '$40–100/day',
    currency: 'THB (฿)',
    language: 'Thai',
    places: [
      { name: 'Grand Palace', icon: 'fa-landmark', desc: 'Dazzling royal complex with the Emerald Buddha temple — Bangkok\'s #1 attraction.' },
      { name: 'Wat Arun (Temple of Dawn)', icon: 'fa-place-of-worship', desc: 'Stunning riverside temple covered in colorful Chinese porcelain and seashells.' },
      { name: 'Chatuchak Weekend Market', icon: 'fa-store', desc: 'World\'s largest outdoor market with 15,000+ stalls — shop, eat, and explore.' },
      { name: 'Khao San Road', icon: 'fa-glass-cheers', desc: 'Legendary backpacker street with street food, bars, and vibrant nightlife.' },
      { name: 'Floating Markets', icon: 'fa-ship', desc: 'Damnoen Saduak or Amphawa — buy food and goods from boats on the canal.' },
      { name: 'Jim Thompson House', icon: 'fa-house', desc: 'Beautiful traditional Thai house and museum of silk, art, and antiques.' }
    ],
    food: ['Pad Thai', 'Tom Yum Goong (Spicy Shrimp Soup)', 'Mango Sticky Rice', 'Som Tum (Papaya Salad)', 'Street-side Grilled Meat Skewers'],
    tips: [
      'Use BTS Skytrain and MRT metro for air-conditioned travel',
      'Always bargain at markets — start at 50% of asking price',
      'Remove shoes before entering temples and homes',
      'Carry tissue paper — not all restrooms have toilet paper',
      'Avoid tuk-tuks that offer "free tours" — they\'ll take you to gem shops'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Royal Bangkok', plan: 'Morning: Grand Palace & Wat Phra Kaew → Afternoon: Wat Pho (Reclining Buddha) → Evening: Wat Arun at sunset' },
      { day: 'Day 2', title: 'Markets & Food', plan: 'Morning: Chatuchak Weekend Market → Afternoon: Jim Thompson House → Evening: Khao San Road' },
      { day: 'Day 3', title: 'Local Experience', plan: 'Morning: Floating Market day trip → Afternoon: Chinatown food walk → Evening: Rooftop bar at Lebua' },
      { day: 'Day 4', title: 'Modern Bangkok', plan: 'Morning: Terminal 21 mall → Afternoon: Lumpini Park → Evening: Asiatique night market' }
    ]
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    emoji: '🇬🇧',
    tagline: 'History Meets Modernity',
    heroGradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #c0392b 100%)',
    bestTime: 'May – September',
    avgBudget: '$180–300/day',
    currency: 'GBP (£)',
    language: 'English',
    places: [
      { name: 'Tower of London', icon: 'fa-chess-rook', desc: 'Historic castle housing the Crown Jewels, with 1,000 years of history.' },
      { name: 'Big Ben & Houses of Parliament', icon: 'fa-clock', desc: 'Iconic clock tower and neo-Gothic parliamentary buildings on the Thames.' },
      { name: 'British Museum', icon: 'fa-building-columns', desc: 'Free museum with the Rosetta Stone, Egyptian mummies, and global treasures.' },
      { name: 'Buckingham Palace', icon: 'fa-crown', desc: 'The King\'s official residence — watch the Changing of the Guard ceremony.' },
      { name: 'Tower Bridge', icon: 'fa-bridge', desc: 'Victorian bascule bridge with glass walkways and engine room exhibition.' },
      { name: 'Camden Market', icon: 'fa-store', desc: 'Eclectic market with street food, vintage fashion, and live music.' }
    ],
    food: ['Fish & Chips', 'Full English Breakfast', 'Sunday Roast', 'Afternoon Tea', 'Pie and Mash'],
    tips: [
      'Get an Oyster card or use contactless for the Tube',
      'Most major museums are FREE — British Museum, Natural History, Tate Modern',
      'London Pass can save money if you plan to visit many attractions',
      'Pubs close at 11 PM—some stay open later on weekends',
      'Walk along the South Bank for free views of Parliament, Big Ben, and St. Paul\'s'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Royal London', plan: 'Morning: Buckingham Palace & Changing of the Guard → Afternoon: Westminster Abbey & Big Ben → Evening: London Eye' },
      { day: 'Day 2', title: 'Historic London', plan: 'Morning: Tower of London → Afternoon: Tower Bridge & Borough Market → Evening: Shakespeare\'s Globe Theatre' },
      { day: 'Day 3', title: 'Culture & Museums', plan: 'Morning: British Museum → Afternoon: Covent Garden → Evening: West End show' },
      { day: 'Day 4', title: 'Modern & Markets', plan: 'Morning: Camden Market → Afternoon: Notting Hill & Portobello Road → Evening: Shoreditch nightlife' }
    ]
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    emoji: '🇲🇻',
    tagline: 'Paradise on Earth',
    heroGradient: 'linear-gradient(135deg, #0077be 0%, #00bcd4 50%, #00e5ff 100%)',
    bestTime: 'November – April (Dry Season)',
    avgBudget: '$200–500/day',
    currency: 'MVR / USD',
    language: 'Dhivehi / English',
    places: [
      { name: 'Overwater Bungalows', icon: 'fa-house-chimney', desc: 'Iconic stilted villas over turquoise lagoons — the ultimate luxury stay.' },
      { name: 'Banana Reef', icon: 'fa-fish', desc: 'World-class diving spot with vibrant coral walls and diverse marine life.' },
      { name: 'Vaadhoo Island – Sea of Stars', icon: 'fa-star', desc: 'Bioluminescent beach that glows blue at night — a magical natural phenomenon.' },
      { name: 'Malé City', icon: 'fa-city', desc: 'Vibrant capital with colorful mosques, fish markets, and local culture.' },
      { name: 'Dolphin Watching', icon: 'fa-ship', desc: 'Sunset cruises to see spinner dolphins leaping alongside your boat.' },
      { name: 'Underwater Restaurant', icon: 'fa-utensils', desc: 'Dine surrounded by ocean views at Ithaa or 5.8 Undersea Restaurant.' }
    ],
    food: ['Garudhiya (Fish Broth)', 'Mas Huni (Tuna & Coconut)', 'Fihunu Mas (Grilled Fish)', 'Fresh Lobster', 'Tropical Fruit Platters'],
    tips: [
      'Book a guesthouse on local islands for budget travel',
      'Alcohol is only served at resorts, not on local islands',
      'Bring reef-safe sunscreen — protect the coral!',
      'Speedboat transfers can be expensive — check seaplane options',
      'Snorkeling gear is often provided free at resorts'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Relax', plan: 'Morning: Seaplane to resort → Afternoon: Beach & snorkeling → Evening: Sunset cruise with dolphins' },
      { day: 'Day 2', title: 'Ocean Adventures', plan: 'Morning: Scuba diving at Banana Reef → Afternoon: Overwater spa → Evening: Underwater restaurant dinner' },
      { day: 'Day 3', title: 'Island Hopping', plan: 'Morning: Visit a local island → Afternoon: Sandbank picnic → Evening: Bioluminescent beach (seasonal)' },
      { day: 'Day 4', title: 'Culture & Farewell', plan: 'Morning: Malé City tour & fish market → Afternoon: Last swim in the lagoon → Evening: Departure' }
    ]
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    emoji: '🇹🇷',
    tagline: 'Where East Meets West',
    heroGradient: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 50%, #2c3e50 100%)',
    bestTime: 'April – May, September – November',
    avgBudget: '$60–150/day',
    currency: 'TRY (₺)',
    language: 'Turkish',
    places: [
      { name: 'Hagia Sophia', icon: 'fa-place-of-worship', desc: 'A 1,500-year-old marvel — once a cathedral, then a mosque, now a museum-mosque.' },
      { name: 'Blue Mosque', icon: 'fa-mosque', desc: 'Stunning mosque with six minarets and 20,000+ hand-painted blue tiles.' },
      { name: 'Grand Bazaar', icon: 'fa-store', desc: 'One of the world\'s oldest and largest covered markets with 4,000+ shops.' },
      { name: 'Topkapi Palace', icon: 'fa-landmark', desc: 'Ottoman sultan\'s palace with the treasury, harem, and Bosphorus views.' },
      { name: 'Bosphorus Cruise', icon: 'fa-ship', desc: 'Sail between Europe and Asia with views of palaces, mosques, and bridges.' },
      { name: 'Basilica Cistern', icon: 'fa-water', desc: 'Underground Byzantine water reservoir with 336 marble columns and atmospheric lighting.' }
    ],
    food: ['Kebab varieties', 'Baklava', 'Turkish Breakfast Spread', 'Simit (Sesame Bread Ring)', 'Turkish Tea & Coffee'],
    tips: [
      'Hagia Sophia is free but arrive early to avoid crowds',
      'Bargain at the Grand Bazaar — it\'s expected!',
      'Get an Istanbulkart for buses, trams, and ferries',
      'The Asian side (Kadıköy) has amazing food and fewer tourists',
      'Try a traditional Turkish bath (hamam) for the full experience'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Sultanahmet', plan: 'Morning: Hagia Sophia → Afternoon: Blue Mosque & Hippodrome → Evening: Basilica Cistern' },
      { day: 'Day 2', title: 'Ottoman Heritage', plan: 'Morning: Topkapi Palace → Afternoon: Grand Bazaar shopping → Evening: Rooftop dinner with mosque views' },
      { day: 'Day 3', title: 'Bosphorus & Beyond', plan: 'Morning: Bosphorus ferry cruise → Afternoon: Dolmabahçe Palace → Evening: Galata Tower sunset' },
      { day: 'Day 4', title: 'Asian Side', plan: 'Morning: Ferry to Kadıköy → Afternoon: Food tour & market → Evening: Turkish bath experience' }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    emoji: '🇮🇳',
    tagline: 'The Pink City',
    heroGradient: 'linear-gradient(135deg, #e84393 0%, #d63384 50%, #c2185b 100%)',
    bestTime: 'October – March',
    avgBudget: '₹3,000–6,000/day',
    currency: 'INR (₹)',
    language: 'Hindi / Rajasthani',
    places: [
      { name: 'Hawa Mahal', icon: 'fa-landmark', desc: 'The iconic "Palace of Winds" with 953 honeycomb windows — Jaipur\'s most photographed monument.' },
      { name: 'Amber Fort', icon: 'fa-chess-rook', desc: 'Magnificent hilltop fort with stunning architecture, mirror palace, and elephant rides.' },
      { name: 'City Palace', icon: 'fa-landmark', desc: 'Blend of Rajasthani and Mughal architecture, still partly a royal residence.' },
      { name: 'Jantar Mantar', icon: 'fa-compass', desc: 'UNESCO World Heritage astronomical observation site with the world\'s largest stone sundial.' },
      { name: 'Nahargarh Fort', icon: 'fa-mountain-city', desc: 'Hill fort overlooking Jaipur — the best sunset viewpoint in the city.' },
      { name: 'Jal Mahal', icon: 'fa-water', desc: 'Stunning "Water Palace" floating in Man Sagar Lake, beautiful at golden hour.' }
    ],
    food: ['Dal Baati Churma', 'Laal Maas (Spicy Mutton)', 'Pyaaz Kachori', 'Ghewar (Sweet)', 'Lassi at Lassiwala'],
    tips: [
      'Buy a composite ticket for Amber Fort, Jantar Mantar, Hawa Mahal, and Nahargarh',
      'Hire an auto-rickshaw for the day — much cheaper than cabs',
      'Visit Hawa Mahal early morning for the best photos without crowds',
      'Bargain hard at Johari Bazaar for jewelry and textiles',
      'Try the famous lassi at the original Lassiwala on MI Road'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Old City', plan: 'Morning: Hawa Mahal & City Palace → Afternoon: Jantar Mantar → Evening: Johari Bazaar shopping & street food' },
      { day: 'Day 2', title: 'Forts & Views', plan: 'Morning: Amber Fort (elephant ride optional) → Afternoon: Jaigarh Fort → Evening: Nahargarh Fort sunset' },
      { day: 'Day 3', title: 'Culture & Beyond', plan: 'Morning: Albert Hall Museum → Afternoon: Jal Mahal & Birla Temple → Evening: Chokhi Dhani cultural village dinner' }
    ]
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    emoji: '🇮🇳',
    tagline: 'Sun, Sand & Soul',
    heroGradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 50%, #0984e3 100%)',
    bestTime: 'November – February',
    avgBudget: '₹2,500–5,000/day',
    currency: 'INR (₹)',
    language: 'Konkani / English / Hindi',
    places: [
      { name: 'Baga & Calangute Beach', icon: 'fa-umbrella-beach', desc: 'North Goa\'s most popular beaches with water sports, shacks, and vibrant nightlife.' },
      { name: 'Basilica of Bom Jesus', icon: 'fa-church', desc: 'UNESCO World Heritage church housing the remains of St. Francis Xavier, built in 1605.' },
      { name: 'Fort Aguada', icon: 'fa-chess-rook', desc: '17th-century Portuguese fort with a lighthouse and stunning views of the Arabian Sea.' },
      { name: 'Dudhsagar Falls', icon: 'fa-water', desc: 'Spectacular 310m four-tiered waterfall — one of India\'s tallest, accessible by jeep safari.' },
      { name: 'Palolem Beach', icon: 'fa-umbrella-beach', desc: 'Crescent-shaped South Goa beach known for dolphin spotting and silent noise parties.' },
      { name: 'Anjuna Flea Market', icon: 'fa-store', desc: 'Famous Wednesday market with jewelry, clothes, spices, and hippie culture vibes.' }
    ],
    food: ['Fish Curry Rice', 'Prawn Balchão', 'Pork Vindaloo', 'Bebinca (Layered Dessert)', 'Feni (Cashew Liquor)'],
    tips: [
      'Rent a scooter — it\'s the best way to explore Goa',
      'North Goa = parties & nightlife, South Goa = peace & nature',
      'Visit Dudhsagar Falls during monsoon (June–Sept) for the best flow',
      'Try local Goan cuisine at small beach shacks, not fancy restaurants',
      'Carry cash for smaller shacks and markets'
    ],
    itinerary: [
      { day: 'Day 1', title: 'North Goa Beaches', plan: 'Morning: Baga Beach water sports → Afternoon: Calangute & Candolim → Evening: Tito\'s Lane nightlife' },
      { day: 'Day 2', title: 'Heritage & History', plan: 'Morning: Old Goa churches & Basilica → Afternoon: Fort Aguada → Evening: Vagator Beach sunset' },
      { day: 'Day 3', title: 'South Goa', plan: 'Morning: Palolem Beach → Afternoon: Butterfly Beach boat trip → Evening: Beach shack dinner' },
      { day: 'Day 4', title: 'Adventure', plan: 'Full day: Dudhsagar Falls jeep safari & spice plantation visit' }
    ]
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    country: 'India',
    emoji: '🇮🇳',
    tagline: 'The Spiritual Capital',
    heroGradient: 'linear-gradient(135deg, #ff9f43 0%, #ee5a24 50%, #6c5ce7 100%)',
    bestTime: 'October – March',
    avgBudget: '₹2,000–4,000/day',
    currency: 'INR (₹)',
    language: 'Hindi / Bhojpuri',
    places: [
      { name: 'Dashashwamedh Ghat', icon: 'fa-fire', desc: 'The main ghat famous for the spectacular Ganga Aarti ceremony every evening.' },
      { name: 'Kashi Vishwanath Temple', icon: 'fa-place-of-worship', desc: 'One of the 12 Jyotirlingas, the holiest Shiva temple, with a gold-plated spire.' },
      { name: 'Manikarnika Ghat', icon: 'fa-fire', desc: 'The primary cremation ghat — a profound spiritual experience and ancient tradition.' },
      { name: 'Sarnath', icon: 'fa-dharmachakra', desc: 'Where Buddha gave his first sermon — ancient ruins, Dhamek Stupa, and museum.' },
      { name: 'Assi Ghat', icon: 'fa-water', desc: 'Peaceful ghat popular for morning yoga, boat rides, and cultural gatherings.' },
      { name: 'Ramnagar Fort', icon: 'fa-chess-rook', desc: '18th-century fort on the Ganges with a museum of vintage cars, weapons, and royal artifacts.' }
    ],
    food: ['Kachori Sabzi (Breakfast)', 'Tamatar Chaat', 'Banarasi Paan', 'Thandai (Spiced Milk)', 'Malaiyo (Winter delicacy)'],
    tips: [
      'Watch the Ganga Aarti from a boat for the best view — book early',
      'Hire a local guide for the ghat walk — the stories are incredible',
      'Mornings are the best time for photography along the ghats',
      'Dress modestly when visiting temples',
      'Try a sunrise boat ride on the Ganges — a life-changing experience'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Ghats & Aarti', plan: 'Morning: Sunrise boat ride on the Ganges → Afternoon: Walk through the old city lanes → Evening: Ganga Aarti at Dashashwamedh Ghat' },
      { day: 'Day 2', title: 'Temples & Heritage', plan: 'Morning: Kashi Vishwanath Temple → Afternoon: BHU & Bharat Kala Bhavan Museum → Evening: Assi Ghat yoga' },
      { day: 'Day 3', title: 'Buddhism & Beyond', plan: 'Morning: Sarnath day trip → Afternoon: Ramnagar Fort → Evening: Silk weaving lanes & shopping' }
    ]
  },
  {
    id: 'kerala',
    name: 'Kerala',
    country: 'India',
    emoji: '🇮🇳',
    tagline: 'God\'s Own Country',
    heroGradient: 'linear-gradient(135deg, #00b894 0%, #1abc9c 50%, #2d3436 100%)',
    bestTime: 'September – March',
    avgBudget: '₹3,000–7,000/day',
    currency: 'INR (₹)',
    language: 'Malayalam / English',
    places: [
      { name: 'Alleppey Backwaters', icon: 'fa-ship', desc: 'Cruise the serene backwaters on a traditional houseboat — Kerala\'s most iconic experience.' },
      { name: 'Munnar Tea Plantations', icon: 'fa-seedling', desc: 'Rolling hills covered in emerald green tea gardens with misty mountain views.' },
      { name: 'Periyar Wildlife Sanctuary', icon: 'fa-paw', desc: 'Boat safari through the reserve to spot elephants, bison, and exotic birds.' },
      { name: 'Fort Kochi', icon: 'fa-chess-rook', desc: 'Historic port town with Chinese fishing nets, Dutch palaces, and street art.' },
      { name: 'Varkala Cliff Beach', icon: 'fa-umbrella-beach', desc: 'Dramatic red cliffs overlooking the Arabian Sea with seaside cafés and yoga centers.' },
      { name: 'Wayanad', icon: 'fa-mountain-sun', desc: 'Lush green hill station with waterfalls, caves, bamboo forests, and tribal heritage.' }
    ],
    food: ['Kerala Sadya (Banana Leaf Feast)', 'Appam with Stew', 'Karimeen Pollichathu (Fish)', 'Puttu & Kadala Curry', 'Payasam (Sweet)'],
    tips: [
      'Book houseboat stays in Alleppey in advance during peak season',
      'Carry mosquito repellent — it\'s tropical and lush',
      'Attend a Kathakali dance performance in Kochi',
      'Try Ayurvedic spa treatments — Kerala is the birthplace of Ayurveda',
      'Learn to eat a Sadya the traditional way — with your hand on a banana leaf!'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Kochi & Culture', plan: 'Morning: Fort Kochi walk & Chinese fishing nets → Afternoon: Mattancherry Palace & Jewish Town → Evening: Kathakali dance show' },
      { day: 'Day 2', title: 'Hill Station', plan: 'Morning: Drive to Munnar → Afternoon: Tea plantation visit & tea tasting → Evening: Eravikulam National Park' },
      { day: 'Day 3', title: 'Wildlife', plan: 'Morning: Periyar Wildlife Sanctuary boat safari → Afternoon: Spice garden tour → Evening: Drive to Alleppey' },
      { day: 'Day 4', title: 'Backwaters', plan: 'Full day: Houseboat cruise through Alleppey backwaters with fresh Kerala meals on board' }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    emoji: '🇮🇳',
    tagline: 'City of Dreams',
    heroGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #f39c12 100%)',
    bestTime: 'November – February',
    avgBudget: '₹3,500–8,000/day',
    currency: 'INR (₹)',
    language: 'Hindi / Marathi / English',
    places: [
      { name: 'Gateway of India', icon: 'fa-landmark', desc: 'Iconic Indo-Saracenic arch on the waterfront built in 1924 — Mumbai\'s most recognized landmark.' },
      { name: 'Marine Drive', icon: 'fa-road', desc: 'The "Queen\'s Necklace" — a 3.6km stunning seafront promenade, magical at night.' },
      { name: 'Elephanta Caves', icon: 'fa-mountain-city', desc: 'UNESCO World Heritage ancient rock-cut cave temples on an island, accessible by ferry.' },
      { name: 'Chhatrapati Shivaji Terminus', icon: 'fa-train', desc: 'UNESCO-listed Victorian Gothic railway station — one of India\'s grandest buildings.' },
      { name: 'Dharavi', icon: 'fa-city', desc: 'Asia\'s largest informal settlement — guided walking tours showcase its incredible entrepreneurial spirit.' },
      { name: 'Juhu Beach', icon: 'fa-umbrella-beach', desc: 'Celebrity-studded beach popular for sunset walks, street food, and Bollywood vibes.' }
    ],
    food: ['Vada Pav (Mumbai\'s Burger)', 'Pav Bhaji', 'Bombay Sandwich', 'Bhel Puri at Chowpatty', 'Kebabs at Mohammed Ali Road'],
    tips: [
      'Use local trains during non-peak hours — it\'s the fastest way to get around',
      'Try street food at Chowpatty Beach and Mohammed Ali Road',
      'Book the Elephanta Caves ferry early — last boat back is 5:30 PM',
      'Visit Crawford Market for spices and souvenirs',
      'Watch a Bollywood film at the historic Regal Cinema'
    ],
    itinerary: [
      { day: 'Day 1', title: 'South Mumbai Icons', plan: 'Morning: Gateway of India & Taj Hotel → Afternoon: Colaba Causeway shopping → Evening: Marine Drive sunset walk' },
      { day: 'Day 2', title: 'Heritage & Culture', plan: 'Morning: CST & Crawford Market → Afternoon: Dharavi walking tour → Evening: Street food at Chowpatty Beach' },
      { day: 'Day 3', title: 'Islands & Art', plan: 'Morning: Elephanta Caves ferry trip → Afternoon: Kala Ghoda art district → Evening: Juhu Beach & Bollywood hotspots' }
    ]
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    country: 'India',
    emoji: '🇮🇳',
    tagline: 'The Jewel of the East Coast',
    heroGradient: 'linear-gradient(135deg, #0984e3 0%, #00cec9 50%, #55a630 100%)',
    bestTime: 'October – March',
    avgBudget: '₹2,000–5,000/day',
    currency: 'INR (₹)',
    language: 'Telugu / English / Hindi',
    places: [
      { name: 'RK Beach (Ramakrishna Beach)', icon: 'fa-umbrella-beach', desc: 'Vizag\'s most popular beach with the iconic Kali Temple, submarine museum, and aquarium nearby.' },
      { name: 'Araku Valley', icon: 'fa-mountain-sun', desc: 'Stunning hill station 112km from Vizag with coffee plantations, tribal villages, and Borra Caves.' },
      { name: 'Borra Caves', icon: 'fa-mountain-city', desc: 'Million-year-old limestone caves with spectacular stalactite and stalagmite formations.' },
      { name: 'Kailasagiri Hill Park', icon: 'fa-mountain-sun', desc: 'Hilltop park with panoramic views, a giant Shiva-Parvati statue, and a ropeway ride.' },
      { name: 'INS Kurusura Submarine Museum', icon: 'fa-ship', desc: 'Decommissioned submarine converted into a unique museum — walk through a real sub!' },
      { name: 'Yarada Beach', icon: 'fa-umbrella-beach', desc: 'Secluded crescent beach surrounded by green hills — one of the most beautiful beaches in India.' }
    ],
    food: ['Bamboo Chicken (Bonsalu Kodi)', 'Vizag Fish Curry', 'Punugulu (Fried Snack)', 'Araku Valley Coffee', 'Madugula Halwa'],
    tips: [
      'Take the Visakhapatnam–Araku train — one of the most scenic train rides in India',
      'Visit RK Beach at sunrise for the best experience',
      'Book Araku Valley trip early — it\'s a full-day journey',
      'Try bamboo chicken at roadside stalls on the Araku route',
      'Rent a bike to explore the coastal roads — they\'re stunning'
    ],
    itinerary: [
      { day: 'Day 1', title: 'City & Beaches', plan: 'Morning: RK Beach & Submarine Museum → Afternoon: Kailasagiri ropeway → Evening: Rushikonda Beach sunset' },
      { day: 'Day 2', title: 'Araku Adventure', plan: 'Morning: Train to Araku Valley (scenic 4hr ride) → Afternoon: Coffee plantations & tribal museum → Evening: Return by road via Borra Caves' },
      { day: 'Day 3', title: 'Hidden Gems', plan: 'Morning: Yarada Beach → Afternoon: Ross Hill Church & Simhachalam Temple → Evening: MVP Colony street food' }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    emoji: '🇮🇳',
    tagline: 'The Heart of India',
    heroGradient: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 50%, #f39c12 100%)',
    bestTime: 'October – March',
    avgBudget: '₹3,000–7,000/day',
    currency: 'INR (₹)',
    language: 'Hindi / English / Urdu',
    places: [
      { name: 'Red Fort', icon: 'fa-chess-rook', desc: 'UNESCO World Heritage Mughal fort — symbol of India\'s independence and capital\'s grandeur.' },
      { name: 'Qutub Minar', icon: 'fa-tower-observation', desc: 'World\'s tallest brick minaret at 73m, built in 1193, with intricate carvings.' },
      { name: 'India Gate', icon: 'fa-monument', desc: 'Iconic 42m war memorial arch — the heart of New Delhi, stunning when lit at night.' },
      { name: 'Humayun\'s Tomb', icon: 'fa-landmark', desc: 'Mughal architectural masterpiece and UNESCO site — the inspiration for the Taj Mahal.' },
      { name: 'Chandni Chowk', icon: 'fa-store', desc: 'Old Delhi\'s legendary 17th-century market — chaotic, colorful, and alive with street food.' },
      { name: 'Lotus Temple', icon: 'fa-place-of-worship', desc: 'Stunning lotus-shaped Bahá\'í House of Worship — open to all faiths, serene and beautiful.' }
    ],
    food: ['Chole Bhature', 'Paranthas at Paranthe Wali Gali', 'Butter Chicken (origin!)', 'Chaat at Chandni Chowk', 'Kulfi Falooda'],
    tips: [
      'Use the Delhi Metro — it\'s clean, fast, and covers every major attraction',
      'Old Delhi and New Delhi are very different experiences — do both!',
      'Chandni Chowk food walk is a must — go hungry',
      'Book Rashtrapati Bhavan visit online in advance',
      'Avoid summer (April–June) — temperatures exceed 45°C'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Old Delhi', plan: 'Morning: Red Fort → Afternoon: Chandni Chowk food walk & Jama Masjid → Evening: Rickshaw ride through old lanes' },
      { day: 'Day 2', title: 'New Delhi', plan: 'Morning: India Gate & Rashtrapati Bhavan → Afternoon: Humayun\'s Tomb → Evening: Hauz Khas Village' },
      { day: 'Day 3', title: 'Heritage Trail', plan: 'Morning: Qutub Minar complex → Afternoon: Lotus Temple & Akshardham → Evening: Dilli Haat market & crafts' }
    ]
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    country: 'India',
    emoji: '🇮🇳',
    tagline: 'The City of Lakes',
    heroGradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 50%, #0984e3 100%)',
    bestTime: 'September – March',
    avgBudget: '₹2,500–6,000/day',
    currency: 'INR (₹)',
    language: 'Hindi / Mewari',
    places: [
      { name: 'Lake Pichola', icon: 'fa-water', desc: 'Iconic artificial lake with the floating Jag Mandir and Lake Palace — Udaipur\'s crown jewel.' },
      { name: 'City Palace', icon: 'fa-landmark', desc: 'Grand palace complex overlooking Lake Pichola — Rajasthan\'s largest palace with museums inside.' },
      { name: 'Jag Mandir', icon: 'fa-landmark', desc: 'Island palace on Lake Pichola, accessible by boat — where the young Shah Jahan once took refuge.' },
      { name: 'Saheliyon Ki Bari', icon: 'fa-seedling', desc: 'Garden of the maidens — beautiful fountains, marble elephants, and lotus pools.' },
      { name: 'Fateh Sagar Lake', icon: 'fa-water', desc: 'Scenic man-made lake perfect for boating with Nehru Garden island in the center.' },
      { name: 'Monsoon Palace', icon: 'fa-chess-rook', desc: 'Hilltop palace with sweeping panoramic views — the best sunset point in Udaipur.' }
    ],
    food: ['Dal Baati Churma', 'Gatte ki Sabzi', 'Kachori with Mirchi Vada', 'Malpua (Sweet)', 'Chai at lakeside cafés'],
    tips: [
      'Watch the sunset from Ambrai Ghat or a rooftop café overlooking Lake Pichola',
      'Take a boat ride on Lake Pichola at golden hour — absolutely magical',
      'City Palace is huge — allow at least 3 hours',
      'Udaipur is compact — walk or hire an auto for the day',
      'Visit Haldighati (40km away) for the historic Maharana Pratap battlefield'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Palaces & Lakes', plan: 'Morning: City Palace → Afternoon: Lake Pichola boat ride to Jag Mandir → Evening: Rooftop dinner with lake views' },
      { day: 'Day 2', title: 'Gardens & Ghats', plan: 'Morning: Saheliyon Ki Bari → Afternoon: Fateh Sagar Lake boating → Evening: Ambrai Ghat sunset & Bagore Ki Haveli dance show' },
      { day: 'Day 3', title: 'Hills & Heritage', plan: 'Morning: Sajjangarh Monsoon Palace → Afternoon: Shilpgram crafts village → Evening: Hathi Pol Bazaar shopping' }
    ]
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    country: 'India',
    emoji: '🇮🇳',
    tagline: 'Yoga Capital of the World',
    heroGradient: 'linear-gradient(135deg, #00b894 0%, #fdcb6e 50%, #6c5ce7 100%)',
    bestTime: 'September – November, February – May',
    avgBudget: '₹1,500–4,000/day',
    currency: 'INR (₹)',
    language: 'Hindi / English',
    places: [
      { name: 'Laxman Jhula & Ram Jhula', icon: 'fa-bridge', desc: 'Iconic suspension bridges over the Ganges — Rishikesh\'s most recognizable landmarks.' },
      { name: 'Beatles Ashram', icon: 'fa-music', desc: 'Abandoned ashram where The Beatles stayed in 1968 — now covered in stunning street art.' },
      { name: 'Triveni Ghat', icon: 'fa-water', desc: 'Sacred confluence point where Ganges, Yamuna, and Saraswati meet — famous for evening Ganga Aarti.' },
      { name: 'White Water Rafting', icon: 'fa-person-swimming', desc: 'World-class rapids on the Ganges — 16km and 26km routes with Grade III–IV rapids.' },
      { name: 'Neer Garh Waterfall', icon: 'fa-water', desc: 'Two-tiered waterfall nestled in the forest — a refreshing trek from the main town.' },
      { name: 'Parmarth Niketan Ashram', icon: 'fa-place-of-worship', desc: 'Largest ashram in Rishikesh with daily yoga, meditation, and the famous riverside Aarti.' }
    ],
    food: ['Chotiwala Restaurant (iconic)', 'Fresh Fruit Bowls', 'Aloo Puri at local dhabas', 'Herbal Tea & Chai', 'Israeli/Italian café food (backpacker scene)'],
    tips: [
      'Rishikesh is a vegetarian and alcohol-free city — respect local customs',
      'Do a dawn yoga session by the Ganges — life-changing',
      'Book rafting in advance during peak season (March–May)',
      'Bungee jumping at Jumpin Heights is India\'s highest (83m)',
      'Carry cash — many ashrams and small eateries don\'t accept cards'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Spiritual Rishikesh', plan: 'Morning: Yoga at Parmarth Niketan → Afternoon: Laxman Jhula & Ram Jhula walk → Evening: Ganga Aarti at Triveni Ghat' },
      { day: 'Day 2', title: 'Adventure Day', plan: 'Morning: White water rafting (16km) → Afternoon: Beatles Ashram exploration → Evening: Café hopping in Tapovan' },
      { day: 'Day 3', title: 'Nature & Thrills', plan: 'Morning: Neer Garh Waterfall trek → Afternoon: Bungee jumping at Jumpin Heights → Evening: Bonfire by the riverside' }
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    emoji: '🇮🇳',
    tagline: 'The City of Pearls',
    heroGradient: 'linear-gradient(135deg, #636e72 0%, #b8860b 50%, #2c3e50 100%)',
    bestTime: 'October – March',
    avgBudget: '₹2,500–5,500/day',
    currency: 'INR (₹)',
    language: 'Telugu / Hindi / Urdu / English',
    places: [
      { name: 'Charminar', icon: 'fa-landmark', desc: 'Iconic 16th-century mosque with four grand arches — Hyderabad\'s most famous symbol.' },
      { name: 'Golconda Fort', icon: 'fa-chess-rook', desc: 'Magnificent medieval fort famous for its acoustics, diamond mines history, and sound & light show.' },
      { name: 'Ramoji Film City', icon: 'fa-film', desc: 'World\'s largest film studio complex — theme park, sets, and behind-the-scenes tours.' },
      { name: 'Hussain Sagar Lake', icon: 'fa-water', desc: 'Heart-shaped lake with a giant Buddha statue on an island, boat rides, and Tank Bund promenade.' },
      { name: 'Salar Jung Museum', icon: 'fa-building-columns', desc: 'One of the largest one-man collections in the world — art, sculptures, and the famous Veiled Rebecca.' },
      { name: 'Chowmahalla Palace', icon: 'fa-landmark', desc: 'Exquisite Nizam\'s palace with grand durbar hall, vintage car collection, and lush courtyards.' }
    ],
    food: ['Hyderabadi Biryani (the original!)', 'Haleem', 'Irani Chai & Osmania Biscuit', 'Double Ka Meetha', 'Pathar ka Gosht (Stone Cooked Meat)'],
    tips: [
      'Eat biryani at Paradise, Bawarchi, or Shah Ghouse — the holy trinity',
      'Visit Golconda Fort for the evening sound & light show',
      'Laad Bazaar near Charminar is perfect for bangles and pearls',
      'Ramoji Film City needs a full day — book guided tours',
      'Try Irani chai with Osmania biscuits at any local Irani café'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Old City', plan: 'Morning: Charminar & Laad Bazaar → Afternoon: Chowmahalla Palace & Salar Jung Museum → Evening: Biryani dinner at Paradise' },
      { day: 'Day 2', title: 'Forts & Films', plan: 'Morning: Golconda Fort → Afternoon: Ramoji Film City tour → Evening: Sound & Light show at Golconda' },
      { day: 'Day 3', title: 'Modern Hyderabad', plan: 'Morning: Hussain Sagar boat ride → Afternoon: Hi-Tech City & Shilparamam → Evening: Eat Street food crawl' }
    ]
  }
];

// State
let selectedDestination = null;

function renderDestinationGrid(filter = '') {
  const grid = document.getElementById('destGrid');
  const filtered = DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(filter.toLowerCase()) ||
    d.country.toLowerCase().includes(filter.toLowerCase())
  );

  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon"><i class="fa-solid fa-map"></i></div><h3>No destinations found</h3><p>Try a different search term</p></div>';
    return;
  }

  grid.innerHTML = filtered.map(d => `
    <div class="dest-card animate-in" onclick="openDestination('${d.id}')">
      <div class="dest-card-hero" style="background:${d.heroGradient}">
        <span class="dest-card-emoji">${d.emoji}</span>
        <div class="dest-card-overlay">
          <h3>${d.name}</h3>
          <p>${d.country}</p>
        </div>
      </div>
      <div class="dest-card-body">
        <p class="dest-tagline">${d.tagline}</p>
        <div class="dest-meta">
          <span><i class="fa-solid fa-calendar"></i> ${d.bestTime.split(',')[0]}</span>
          <span><i class="fa-solid fa-wallet"></i> ${d.avgBudget}</span>
        </div>
        <div class="dest-places-preview">
          ${d.places.slice(0, 3).map(p => `<span class="dest-place-tag"><i class="fa-solid ${p.icon}"></i> ${p.name}</span>`).join('')}
          ${d.places.length > 3 ? `<span class="dest-place-tag more">+${d.places.length - 3} more</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function openDestination(id) {
  selectedDestination = DESTINATIONS.find(d => d.id === id);
  if (!selectedDestination) return;
  const d = selectedDestination;
  const detail = document.getElementById('destDetail');
  const grid = document.getElementById('destGridSection');

  detail.innerHTML = `
    <button class="btn btn-secondary btn-sm" onclick="closeDetail()" style="margin-bottom:1.5rem"><i class="fa-solid fa-arrow-left"></i> Back to All Destinations</button>
    
    <div class="dest-detail-hero" style="background:${d.heroGradient}">
      <div class="dest-detail-hero-content">
        <span style="font-size:3rem">${d.emoji}</span>
        <h1>${d.name}</h1>
        <p>${d.tagline} · ${d.country}</p>
      </div>
    </div>

    <div class="dest-detail-info">
      <div class="dest-info-chip"><i class="fa-solid fa-calendar"></i> <strong>Best Time:</strong> ${d.bestTime}</div>
      <div class="dest-info-chip"><i class="fa-solid fa-wallet"></i> <strong>Budget:</strong> ${d.avgBudget}</div>
      <div class="dest-info-chip"><i class="fa-solid fa-coins"></i> <strong>Currency:</strong> ${d.currency}</div>
      <div class="dest-info-chip"><i class="fa-solid fa-language"></i> <strong>Language:</strong> ${d.language}</div>
    </div>

    <!-- Famous Places -->
    <div class="dashboard-card animate-in">
      <h3><i class="fa-solid fa-map-location-dot" style="color:var(--primary)"></i> Famous Places to Visit</h3>
      <div class="places-grid">
        ${d.places.map(p => `
          <div class="place-item">
            <div class="place-icon"><i class="fa-solid ${p.icon}"></i></div>
            <div>
              <h4>${p.name}</h4>
              <p>${p.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Suggested Itinerary -->
    <div class="dashboard-card animate-in animate-in-1">
      <h3><i class="fa-solid fa-route" style="color:var(--primary)"></i> Suggested ${d.itinerary.length}-Day Itinerary</h3>
      <div class="itinerary-timeline">
        ${d.itinerary.map((item, i) => `
          <div class="itinerary-day">
            <div class="itinerary-day-badge">${item.day}</div>
            <div class="itinerary-day-content">
              <h4>${item.title}</h4>
              <p>${item.plan}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="dest-detail-grid">
      <!-- Local Food -->
      <div class="dashboard-card animate-in animate-in-2">
        <h3><i class="fa-solid fa-utensils" style="color:var(--primary)"></i> Must-Try Food</h3>
        <ul class="dest-food-list">
          ${d.food.map(f => `<li><i class="fa-solid fa-bowl-food" style="color:var(--primary);margin-right:8px"></i> ${f}</li>`).join('')}
        </ul>
      </div>

      <!-- Travel Tips -->
      <div class="dashboard-card animate-in animate-in-3">
        <h3><i class="fa-solid fa-lightbulb" style="color:var(--primary)"></i> Travel Tips</h3>
        <ul class="dest-tips-list">
          ${d.tips.map(t => `<li><i class="fa-solid fa-check-circle" style="color:#22c55e;margin-right:8px"></i> ${t}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="dest-cta animate-in">
      <p>Ready to visit <strong>${d.name}</strong>?</p>
      <a href="/my-trips.html" class="btn btn-primary btn-lg"><i class="fa-solid fa-plus"></i> Create a Trip to ${d.name}</a>
    </div>
  `;

  grid.style.display = 'none';
  detail.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeDetail() {
  document.getElementById('destGridSection').style.display = 'block';
  document.getElementById('destDetail').style.display = 'none';
}

function handleSearch() {
  const q = document.getElementById('destSearch').value;
  renderDestinationGrid(q);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderDestinationGrid();
});
