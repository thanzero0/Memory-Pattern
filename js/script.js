document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.tile');
    const startBtn = document.getElementById('start-btn');
    const statusText = document.getElementById('status');
    const currentScoreEl = document.getElementById('current-score');
    const highScoreEl = document.getElementById('high-score');
    const gameBoard = document.getElementById('game-board');

    let sequence = [];
    let playerSequence = [];
    let level = 0;
    let highScore = localStorage.getItem('memoryGameHighScore') || 0;
    let isPlaying = false;
    let canClick = false;

    highScoreEl.textContent = highScore;

    startBtn.addEventListener('click', startGame);

    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            if (!canClick) return;
            
            const index = parseInt(tile.getAttribute('data-index'));
            handlePlayerInput(index);
        });
    });

    function startGame() {
        sequence = [];
        playerSequence = [];
        level = 0;
        isPlaying = true;
        currentScoreEl.textContent = '0';
        statusText.textContent = 'Perhatikan...';
        startBtn.style.display = 'none';
        nextRound();
    }

    function nextRound() {
        playerSequence = [];
        level++;
        currentScoreEl.textContent = level - 1;
        
        // Add random tile index (0-3) to sequence
        sequence.push(Math.floor(Math.random() * 4));
        
        playSequence();
    }

    async function playSequence() {
        canClick = false;
        statusText.textContent = 'Perhatikan...';
        
        for (let i = 0; i < sequence.length; i++) {
            await wait(600);
            activateTile(sequence[i]);
            await wait(400);
            deactivateTile(sequence[i]);
        }
        
        await wait(200);
        statusText.textContent = 'Giliranmu!';
        canClick = true;
    }

    function handlePlayerInput(index) {
        playerSequence.push(index);
        activateTile(index);
        
        // Check if correct
        const currentIndex = playerSequence.length - 1;
        
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            gameOver();
            return;
        }

        setTimeout(() => deactivateTile(index), 200);

        // Check if finished round
        if (playerSequence.length === sequence.length) {
            canClick = false;
            setTimeout(() => {
                statusText.textContent = 'Benar!';
                setTimeout(nextRound, 1000);
            }, 500);
        }
    }

    function activateTile(index) {
        const tile = document.getElementById(`tile-${index}`);
        tile.classList.add(`active-${index + 1}`);
        // Play subtle sound if desired, or just visual
    }

    function deactivateTile(index) {
        const tile = document.getElementById(`tile-${index}`);
        tile.classList.remove(`active-${index + 1}`);
    }

    function gameOver() {
        canClick = false;
        isPlaying = false;
        statusText.textContent = 'Game Over!';
        gameBoard.classList.add('shake');
        
        if (level - 1 > highScore) {
            highScore = level - 1;
            localStorage.setItem('memoryGameHighScore', highScore);
            highScoreEl.textContent = highScore;
            statusText.textContent = 'Skor Baru!';
        }

        setTimeout(() => {
            gameBoard.classList.remove('shake');
            startBtn.style.display = 'block';
            startBtn.textContent = 'Main Lagi';
        }, 1000);

        // Flash all red on game over briefly
        tiles.forEach(t => t.classList.add('active-1'));
        setTimeout(() => {
            tiles.forEach(t => t.classList.remove('active-1'));
        }, 500);
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
