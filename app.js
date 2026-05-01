let timeLeft = 0.1 * 60;
let timerInterval = null;
let isRunning = false;
let Break = false;
let numofBreaks = true;

function updateDisplay() {
    const minutes = String(Math.floor(timeLeft/60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    document.getElementById('time').textContent = minutes + ':' + seconds;
}

document.getElementById('start').addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    clearInterval(timerInterval)

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

timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft === 0) {
        clearInterval(timerInterval);
        isRunning = false;

        if (!Break) {
            numofBreaks++;
            if (numofBreaks === 4) {
                timeLeft = 15 * 60;
                numofBreaks = 0;
            } else {
                timeLeft = 5 * 60;
            }
            Break = true;
            document.getElementById('sessionLabel').textContent = 'Break Time!'
        } else {
            timeLeft = 25 * 60;
            Break = false;
            document.getElementById('sessionLabel').textContent = 'Work Session'
        }
        updateDisplay()
    }
}, 1000)

updateDisplay();