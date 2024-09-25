document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const rows = 6;
    const cols = 7;
    let currentPlayer = 'R';
    let cells = Array(rows * cols).fill(null);
    let isSinglePlayer = true;

    function createBoard() {
        board.innerHTML = '';
        board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
        board.style.gridTemplateRows = `repeat(${rows}, 100px)`;
        cells.forEach((_, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = index;
            cell.addEventListener('click', handleMove);
            board.appendChild(cell);
        });
    }

    function handleMove(e) {
        const index = parseInt(e.target.dataset.index);
        if (cells[index] === null) {
            cells[index] = currentPlayer;
            e.target.classList.add(currentPlayer);
            if (checkWinner()) {
                status.textContent = `${currentPlayer} a gagné !`;
                endGame();
            } else if (cells.every(cell => cell !== null)) {
                status.textContent = 'Match nul !';
                endGame();
            } else {
                currentPlayer = currentPlayer === 'R' ? 'Y' : 'R';
                status.textContent = `Tour de ${currentPlayer}`;
                if (isSinglePlayer && currentPlayer === 'Y') {
                    setTimeout(computerMove, 500);
                }
            }
        }
    }

    function computerMove() {
        let availableMoves = cells.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
        if (availableMoves.length > 0) {
            let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            cells[randomMove] = 'Y';
            board.children[randomMove].classList.add('Y');
            if (checkWinner()) {
                status.textContent = `Y a gagné !`;
                endGame();
            } else if (cells.every(cell => cell !== null)) {
                status.textContent = 'Match nul !';
                endGame();
            } else {
                currentPlayer = 'R';
                status.textContent = `Tour de ${currentPlayer}`;
            }
        }
    }

    function checkWinner() {
        const winningCombinations = [
            // Horizontal
            ...Array(rows).fill().map((_, r) => Array(cols - 3).fill().map((_, c) => [r * cols + c, r * cols + c + 1, r * cols + c + 2, r * cols + c + 3])),
            // Vertical
            ...Array(cols).fill().map((_, c) => Array(rows - 3).fill().map((_, r) => [r * cols + c, (r + 1) * cols + c, (r + 2) * cols + c, (r + 3) * cols + c])),
            // Diagonal
            ...Array(rows - 3).fill().map((_, r) => Array(cols - 3).fill().map((_, c) => [r * cols + c, (r + 1) * cols + c + 1, (r + 2) * cols + c + 2, (r + 3) * cols + c + 3])),
            // Autre Diagonal
            ...Array(rows - 3).fill().map((_, r) => Array(cols - 3).fill().map((_, c) => [(r + 3) * cols + c, (r + 2) * cols + c + 1, (r + 1) * cols + c + 2, r * cols + c + 3])),
        ].flat();

        return winningCombinations.some(combination => {
            const [a, b, c, d] = combination;
            return cells[a] && cells[a] === cells[b] && cells[a] === cells[c] && cells[a] === cells[d];
        });
    }

    function endGame() {
        board.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleMove));
    }

    function resetGame() {
        cells.fill(null);
        currentPlayer = 'R';
        status.textContent = `Tour de ${currentPlayer}`;
        createBoard();
    }

    resetButton.addEventListener('click', resetGame);

    resetGame();
});