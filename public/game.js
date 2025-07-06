const board = document.getElementById('game-board');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let cells = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let moves = [];

function renderBoard() {
  board.innerHTML = '';
  cells.forEach((cell, idx) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.textContent = cell || '';
    cellDiv.addEventListener('click', () => handleCellClick(idx));
    board.appendChild(cellDiv);
  });
}

function handleCellClick(idx) {
  if (!gameActive || cells[idx]) return;
  
  cells[idx] = currentPlayer;
  moves.push({ player: currentPlayer, position: idx });
  
  if (checkWinner()) {
    statusDiv.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    saveGame(currentPlayer);
  } else if (cells.every(cell => cell)) {
    statusDiv.textContent = "It's a draw!";
    gameActive = false;
    saveGame('draw');
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
  }
  renderBoard();
}

function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

async function saveGame(winner) {
  try {
    await fetch('/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        winner: winner,
        moves: moves
      })
    });
    updateStats();
  } catch (error) {
    console.error('Error saving game:', error);
  }
}

async function updateStats() {
  try {
    const response = await fetch('/api/stats');
    const stats = await response.json();
    
    // Create or update stats display
    let statsDiv = document.getElementById('stats');
    if (!statsDiv) {
      statsDiv = document.createElement('div');
      statsDiv.id = 'stats';
      document.body.appendChild(statsDiv);
    }
    
    statsDiv.innerHTML = `
      <h3>Game Statistics</h3>
      <p>Total Games: ${stats.total_games || 0}</p>
      <p>X Wins: ${stats.x_wins || 0}</p>
      <p>O Wins: ${stats.o_wins || 0}</p>
      <p>Draws: ${stats.draws || 0}</p>
    `;
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}

function restartGame() {
  cells = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  moves = [];
  statusDiv.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
}

restartBtn.addEventListener('click', restartGame);

// Initial render and stats
restartGame();
updateStats(); 