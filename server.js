const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Database setup
const dbPath = path.join(__dirname, 'data', 'tictactoe.db');
const dbDir = path.join(__dirname, 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database
function initDatabase() {
  try {
    // Enable WAL mode for better concurrency
    db.pragma('journal_mode = WAL');
    
    // Create games table if it doesn't exist
    db.prepare(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        winner TEXT,
        moves TEXT, -- Will store JSON string of moves
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
}

// Call initDatabase immediately when the server starts
initDatabase();

// Middleware
app.use(express.json());

// API Routes
app.post('/api/games', (req, res) => {
  try {
    const { winner, moves } = req.body;
    const stmt = db.prepare('INSERT INTO games (winner, moves) VALUES (?, ?)');
    const result = stmt.run(winner, JSON.stringify(moves));
    
    // Get the inserted game
    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(result.lastInsertRowid);
    
    // Parse the moves JSON string back to an object
    if (game) {
      game.moves = JSON.parse(game.moves);
    }
    
    res.status(201).json(game);
  } catch (err) {
    console.error('Error saving game:', err);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

app.get('/api/games', (req, res) => {
  try {
    const games = db.prepare('SELECT * FROM games ORDER BY created_at DESC LIMIT 10').all();
    
    // Parse the moves JSON string back to an object for each game
    const formattedGames = games.map(game => ({
      ...game,
      moves: JSON.parse(game.moves)
    }));
    
    res.json(formattedGames);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_games,
        SUM(CASE WHEN winner = 'X' THEN 1 ELSE 0 END) as x_wins,
        SUM(CASE WHEN winner = 'O' THEN 1 ELSE 0 END) as o_wins,
        SUM(CASE WHEN winner = 'draw' THEN 1 ELSE 0 END) as draws
      FROM games
    `).get();
    
    // Convert null values to 0
    stats.x_wins = stats.x_wins || 0;
    stats.o_wins = stats.o_wins || 0;
    stats.draws = stats.draws || 0;
    
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});