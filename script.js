document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const gameBoard = document.querySelector('.game-board');
    const gameStatus = document.querySelector('.game-status');
    const restartButton = document.querySelector('.restart-button');
    const vsPlayerBtn = document.getElementById('vsPlayerBtn');
    const vsComputerBtn = document.getElementById('vsComputerBtn');
    const modeSelection = document.querySelector('.mode-selection');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = false;
    let isVsComputer = false; // Flag to determine game mode

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Messages
    const currentPlayerTurn = () => `It's ${currentPlayer} 's turn.`;
    const winningMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => `The game ended in a draw!`;

    function initializeGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        gameStatus.textContent = currentPlayerTurn();
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
        });
        restartButton.classList.add('hidden');
    }

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

        if (board[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        handlePlayerMove(clickedCell, clickedCellIndex);
        if (gameActive && isVsComputer && currentPlayer === 'O') {
            setTimeout(handleComputerMove, 700); // Delay computer move for better UX
        }
    }

    function handlePlayerMove(cell, index) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);
        checkResult();
        if (gameActive) {
            changePlayer();
        }
    }

    function handleComputerMove() {
        if (!gameActive) return;

        let availableCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                availableCells.push(i);
            }
        }

        if (availableCells.length === 0) {
            return; // No moves left
        }

        // Simple AI: Prioritize winning, then blocking, then random
        let bestMove = -1;

        // 1. Check for winning move
        for (let i = 0; i < availableCells.length; i++) {
            const tempBoard = [...board];
            tempBoard[availableCells[i]] = 'O';
            if (checkWin(tempBoard, 'O')) {
                bestMove = availableCells[i];
                break;
            }
        }

        // 2. Check for blocking opponent's winning move
        if (bestMove === -1) {
            for (let i = 0; i < availableCells.length; i++) {
                const tempBoard = [...board];
                tempBoard[availableCells[i]] = 'X';
                if (checkWin(tempBoard, 'X')) {
                    bestMove = availableCells[i];
                    break;
                }
            }
        }

        // 3. Take center if available
        if (bestMove === -1 && board[4] === '') {
            bestMove = 4;
        }

        // 4. Take a corner if available
        if (bestMove === -1) {
            const corners = [0, 2, 6, 8];
            for (let i = 0; i < corners.length; i++) {
                if (board[corners[i]] === '') {
                    bestMove = corners[i];
                    break;
                }
            }
        }

        // 5. Take any available random spot
        if (bestMove === -1) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            bestMove = availableCells[randomIndex];
        }

        const cellToPlay = document.querySelector(`[data-cell-index="${bestMove}"]`);
        handlePlayerMove(cellToPlay, bestMove);
    }

    function checkWin(currentBoard, player) {
        return winningConditions.some(combination => {
            return combination.every(index => {
                return currentBoard[index] === player;
            });
        });
    }

    function checkResult() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            gameStatus.textContent = winningMessage();
            gameActive = false;
            restartButton.classList.remove('hidden');
            return;
        }

        let roundDraw = !board.includes('');
        if (roundDraw) {
            gameStatus.textContent = drawMessage();
            gameActive = false;
            restartButton.classList.remove('hidden');
            return;
        }
    }

    function changePlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (gameActive) {
            gameStatus.textContent = currentPlayerTurn();
        }
    }

    function handleRestartGame() {
        initializeGame();
    }

    function startGame(vsComputerMode) {
        isVsComputer = vsComputerMode;
        modeSelection.classList.add('hidden');
        gameBoard.classList.remove('hidden');
        restartButton.classList.remove('hidden');
        initializeGame();
    }

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', handleRestartGame);
    vsPlayerBtn.addEventListener('click', () => startGame(false));
    vsComputerBtn.addEventListener('click', () => startGame(true));
});