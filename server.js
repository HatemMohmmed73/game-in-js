const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 1234;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || '123',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Initialize database tables
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        winner VARCHAR(10),
        moves JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// API Routes
app.post('/api/games', async (req, res) => {
  try {
    const { winner, moves } = req.body;
    const result = await pool.query(
      'INSERT INTO games (winner, moves) VALUES ($1, $2) RETURNING *',
      [winner, JSON.stringify(moves)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving game:', err);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_games,
        COUNT(CASE WHEN winner = 'X' THEN 1 END) as x_wins,
        COUNT(CASE WHEN winner = 'O' THEN 1 END) as o_wins,
        COUNT(CASE WHEN winner = 'draw' THEN 1 END) as draws
      FROM games
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}); 