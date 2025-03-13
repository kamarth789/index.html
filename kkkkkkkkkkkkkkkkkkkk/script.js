document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');

    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { X: 0, O: 0 };

    const winningConditions = [
        [0, 1, 2], // Rows
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], // Columns
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], // Diagonals
        [2, 4, 6]
    ];

    // Handle cell click
    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        checkForWinner();
    }

    // Check for a winner
    function checkForWinner() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            scores[currentPlayer]++;
            updateScoreboard();
            gameActive = false;
            return;
        }

        if (!gameState.includes('')) {
            status.textContent = 'Draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }

    // Update scoreboard
    function updateScoreboard() {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
    }

    // Reset game
    function resetGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        cells.forEach(cell => {
            cell.classList.remove('x', 'o');
        });
    }

    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetBtn.addEventListener('click', resetGame);
});
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const speedInput = document.getElementById('speed');
    const pitchInput = document.getElementById('pitch');
    const volumeInput = document.getElementById('volume');
    const speakBtn = document.getElementById('speak-btn');
    const sadBtn = document.getElementById('sad-btn');
    const happyBtn = document.getElementById('happy-btn');
    const angryBtn = document.getElementById('angry-btn');
    const callNumberInput = document.getElementById('call-number');
    const callBtn = document.getElementById('call-btn');
    const copyBtn = document.getElementById('copy-btn');
    const shareBtn = document.getElementById('share-btn');
    const historyBtn = document.getElementById('history-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const previewVoiceBtn = document.getElementById('preview-voice');

    let voices = [];
    let currentEmotion = 'neutral';
    let speechHistory = [];

    // Load voices
    function loadVoices() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = voices
            .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
            .join('');
    }

    speechSynthesis.onvoiceschanged = loadVoices;

    // Speak function
    function speak() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(textInput.value);
        utterance.voice = voices.find(voice => voice.name === voiceSelect.value);
        utterance.rate = speedInput.value;
        utterance.pitch = pitchInput.value;
        utterance.volume = volumeInput.value;

        // Adjust emotion
        switch (currentEmotion) {
            case 'sad':
                utterance.rate = 0.8;
                utterance.pitch = 0.8;
                break;
            case 'happy':
                utterance.rate = 1.2;
                utterance.pitch = 1.2;
                break;
            case 'angry':
                utterance.rate = 1.5;
                utterance.pitch = 1.5;
                break;
        }

        speechSynthesis.speak(utterance);
        speechHistory.push(textInput.value);
    }

    // Emotion buttons
    sadBtn.addEventListener('click', () => {
        currentEmotion = 'sad';
        speak();
    });

    happyBtn.addEventListener('click', () => {
        currentEmotion = 'happy';
        speak();
    });

    angryBtn.addEventListener('click', () => {
        currentEmotion = 'angry';
        speak();
    });

    // Call feature
    callBtn.addEventListener('click', () => {
        const number = callNumberInput.value;
        if (number) {
            window.location.href = `tel:${number}`;
        }
    });

    // Copy text
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(textInput.value);
        alert('Text copied to clipboard!');
    });

    // Share text
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'Text-to-Speech',
                text: textInput.value,
            });
        } else {
            alert('Sharing not supported in this browser.');
        }
    });

    // Preview voice
    previewVoiceBtn.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance("This is a preview of the selected voice.");
        utterance.voice = voices.find(voice => voice.name === voiceSelect.value);
        speechSynthesis.speak(utterance);
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
});