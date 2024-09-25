document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    let currentPlayer = 'X';
    let cells = Array(9).fill(null);
    let isSinglePlayer = true;  // Joueur vs Ordinateur

    function createBoard() {
        board.innerHTML = '';
        board.style.gridTemplateColumns = 'repeat(3, 100px)';
        board.style.gridTemplateRows = 'repeat(3, 100px)';
        cells.forEach((_, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = index;
            cell.addEventListener('click', handleMove);
            board.appendChild(cell);
        });
    }

    function handleMove(e) {
        const index = e.target.dataset.index;
        if (cells[index] === null) {
            cells[index] = currentPlayer;
            e.target.textContent = currentPlayer;
            if (checkWinner()) {
                status.textContent = `${currentPlayer} a gagné !`;
                endGame();
            } else if (cells.every(cell => cell !== null)) {
                status.textContent = 'Match nul !';
                endGame();
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                status.textContent = `Tour de ${currentPlayer}`;
                if (isSinglePlayer && currentPlayer === 'O') {
                    setTimeout(computerMove, 500);  // L'ordi joue après 0.5 s
                }
            }
        }
    }

    function computerMove() {
        let availableMoves = cells.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
        if (availableMoves.length > 0) {
            let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            cells[randomMove] = 'O';
            board.children[randomMove].textContent = 'O';
            if (checkWinner()) {
                status.textContent = `O a gagné !`;
                endGame();
            } else if (cells.every(cell => cell !== null)) {
                status.textContent = 'Match nul !';
                endGame();
            } else {
                currentPlayer = 'X';
                status.textContent = `Tour de ${currentPlayer}`;
            }
        }
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
        });
    }

    function endGame() {
        board.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleMove));
    }

    function resetGame() {
        cells.fill(null);
        currentPlayer = 'X';
        status.textContent = `Tour de ${currentPlayer}`;
        createBoard();
    }

    resetButton.addEventListener('click', resetGame);

    resetGame();
});
