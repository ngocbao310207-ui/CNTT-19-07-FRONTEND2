document.addEventListener('DOMContentLoaded', () => {
    let secretNumber;
    let attempts;
    
    const guessInput = document.getElementById('guessInput');
    const guessBtn = document.getElementById('guessBtn');
    const restartBtn = document.getElementById('restartBtn');
    const feedbackArea = document.getElementById('feedbackArea');
    const feedbackText = document.getElementById('feedbackText');
    const attemptCount = document.getElementById('attemptCount');
    function initGame() {
        secretNumber = Math.floor(Math.random() * 100) + 1; 
        attempts = 0;
        

        attemptCount.textContent = attempts;
        guessInput.value = '';
        guessInput.disabled = false;
        guessBtn.disabled = false;
        restartBtn.classList.add('hidden');
        feedbackArea.classList.add('hidden');
        feedbackArea.className = 'feedback-box hidden'; 
        guessInput.focus();
        
        console.log("Cheat code: Số bí mật là", secretNumber); 
    }

    function checkGuess() {
        const userGuess = parseInt(guessInput.value);

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            alert('Vui lòng nhập một số hợp lệ từ 1 đến 100!');
            return;
        }

        attempts++;
        attemptCount.textContent = attempts;
        feedbackArea.classList.remove('hidden');

        if (userGuess === secretNumber) {
            feedbackArea.className = 'feedback-box msg-win';
            feedbackText.innerHTML = `🎉 Tuyệt vời! Số bí mật chính là <b>${secretNumber}</b>. Cậu đoán trúng sau ${attempts} lần!`;
            guessInput.disabled = true;
            guessBtn.disabled = true;
            restartBtn.classList.remove('hidden');
        } else if (userGuess > secretNumber) {
            feedbackArea.className = 'feedback-box msg-high';
            feedbackText.textContent = '📉 Số cậu đoán đang LỚN HƠN số bí mật!';
        } else {
            feedbackArea.className = 'feedback-box msg-low';
            feedbackText.textContent = '📈 Số cậu đoán đang NHỎ HƠN số bí mật!';
        }
        
        guessInput.value = '';
        guessInput.focus();
    }
    guessBtn.addEventListener('click', checkGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkGuess();
    });
    restartBtn.addEventListener('click', initGame);
    initGame();
});
