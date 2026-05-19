// Game Balance Configuration
let balance = 1000;
let currentBet = 10;
const MIN_BET = 10;
const MAX_BET = 100;
const BET_STEP = 10;

// Game Symbols and Multipliers
const SYMBOLS = ['🍒', '🍋', '🍊', '🔔', '💎', '7️⃣'];
const PAYOUTS = {
    '🍒': 2,   // Matches pay 2x bet
    '🍋': 5,   // Matches pay 5x bet
    '🍊': 10,  // Matches pay 10x bet
    '🔔': 20,  // Matches pay 20x bet
    '💎': 50,  // Matches pay 50x bet
    '7️⃣': 100  // Jackpot line pays 100x bet
};

// Defined 5 Matrix Crossings: Row 1, Row 2, Row 3, Diagonal Down, Diagonal Up
const PAYLINES = [
    { name: 'Top Row', coords: [[0,0], [0,1], [0,2]] },
    { name: 'Middle Row', coords: [[1,0], [1,1], [1,2]] },
    { name: 'Bottom Row', coords: [[2,0], [2,1], [2,2]] },
    { name: 'Diag Down', coords: [[0,0], [1,1], [2,2]] },
    { name: 'Diag Up', coords: [[2,0], [1,1], [0,2]] }
];

// DOM Element Registry
const balanceDisplay = document.getElementById('balance');
const betDisplay = document.getElementById('bet');
const winDisplay = document.getElementById('win');
const spinButton = document.getElementById('btn-spin');
const lessBetButton = document.getElementById('btn-less');
const moreBetButton = document.getElementById('btn-more');

// Update DOM Visual Dashboard
function updateDisplay(currentWin = 0) {
    balanceDisplay.innerText = `$${balance}`;
    betDisplay.innerText = `$${currentBet}`;
    winDisplay.innerText = `$${currentWin}`;
}

// Bet Selection Modifiers
moreBetButton.addEventListener('click', () => {
    if (currentBet < MAX_BET) {
        currentBet += BET_STEP;
        updateDisplay();
    }
});

lessBetButton.addEventListener('click', () => {
    if (currentBet > MIN_BET) {
        currentBet -= BET_STEP;
        updateDisplay();
    }
});

// Primary Game Action Process
spinButton.addEventListener('click', () => {
    if (balance < currentBet) {
        alert("Insufficient balance! Drop your bet or refresh to play.");
        return;
    }

    // Deduct active bet entry
    balance -= currentBet;
    updateDisplay(0);

    // Lock controls during live run
    spinButton.disabled = true;
    lessBetButton.disabled = true;
    moreBetButton.disabled = true;

    const cells = document.querySelectorAll('.cell');
    
    // Trigger animated CSS rolling blur state
    cells.forEach(cell => {
        cell.classList.add('spinning');
        cell.classList.remove('winner-glow');
    });

    // Run active slot calculation over mechanical execution frame delay
    setTimeout(() => {
        cells.forEach(cell => cell.classList.remove('spinning'));

        // 1. Build Virtual Result Matrix Grid
        let matrix = [];
        for (let r = 0; r < 3; r++) {
            matrix[r] = [];
            for (let c = 0; c < 3; c++) {
                let randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                matrix[r][c] = randomSymbol;
                
                // Inject character values directly inside node block matching ID coordinates
                document.getElementById(`c${r}_${c}`).innerText = randomSymbol;
            }
        }

        // 2. Scan Winning Paths & Register Target Node Coordinate Maps
        let spinPayout = 0;
        let winningCells = new Set();

        PAYLINES.forEach(line => {
            let s1 = matrix[line.coords[0][0]][line.coords[0][1]];
            let s2 = matrix[line.coords[1][0]][line.coords[1][1]];
            let s3 = matrix[line.coords[2][0]][line.coords[2][1]];

            if (s1 === s2 && s2 === s3) {
                let multiplier = PAYOUTS[s1];
                spinPayout += currentBet * multiplier;
                
                // Flag cells to apply layout flash highlights
                winningCells.add(`c${line.coords[0][0]}_${line.coords[0][1]}`);
                winningCells.add(`c${line.coords[1][0]}_${line.coords[1][1]}`);
                winningCells.add(`c${line.coords[2][0]}_${line.coords[2][1]}`);
            }
        });

        // 3. Award Profits & Render Highlight States
        balance += spinPayout;
        winningCells.forEach(id => {
            document.getElementById(id).classList.add('winner-glow');
        });

        updateDisplay(spinPayout);

        // Unlock dashboard engine controls
        spinButton.disabled = false;
        lessBetButton.disabled = false;
        moreBetButton.disabled = false;

    }, 1000); // 1-second spin reel roll runtime
});

// Initialize Display
updateDisplay();
