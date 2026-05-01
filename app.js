let timeLeft = 25 * 60;
let timerInterval = null;
let isRunning = false;

function updateDisplay() {
    const minutes = String(Math.floor(timeLeft/60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    document.getElementById('time').textContent = minutes + ':' + seconds;
}

document.getElementById('start').addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;

    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            isRunning = false;
        }
    }, 1000);
});

document.getElementById('pause').addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        updateDisplay();
    }
});

document.getElementById('reset').addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    updateDisplay()
})

updateDisplay();