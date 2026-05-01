const clockCanvas = document.getElementById('clock');
const clockCtx = clockCanvas.getContext('2d');
let SessionLog = JSON.parse(localStorage.getItem('sessionLog') || '[]');
let timeLeft = 25 * 60;
let timerInterval = null;
let isRunning = false;
let Break = false;
let numofBreaks = 0;

function drawClock() {
    const now = new Date()
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    clockCtx.clearRect(0, 0, 200, 200);
    clockCtx.beginPath();
    clockCtx.arc(100, 100, 90, 0, 2 * Math.PI);
    clockCtx.fillStyle = '#80a7cf';
    clockCtx.fill();
    clockCtx.strokeStyle = 'black';
    clockCtx.lineWidth = 3;
    clockCtx.stroke();

    const minuteAngle = (minutes/60) * 2 * Math.PI - Math.PI/2;
    clockCtx.beginPath();
    clockCtx.moveTo(100, 100);
    clockCtx.lineTo(100 + 80 * Math.cos(minuteAngle), 100 + 80 * Math.sin(minuteAngle));
    clockCtx.strokeStyle = 'black';
    clockCtx.lineWidth = 3;
    clockCtx.stroke();

    const hourAngle = ((hours + minutes/60) /12 ) * 2 * Math.PI - Math.PI/2;
    clockCtx.beginPath();
    clockCtx.moveTo(100, 100);
    clockCtx.lineTo(100 + 55 * Math.cos(hourAngle), 100 + 55 * Math.sin(hourAngle));
    clockCtx.strokeStyle = 'black';
    clockCtx.lineWidth = 5;
    clockCtx.stroke();

    const secondAngle = (seconds / 60) * 2 * Math.PI - Math.PI / 2;
    clockCtx.beginPath();
    clockCtx.moveTo(100, 100);
    clockCtx.lineTo(100 + 85 * Math.cos(secondAngle), 100 + 85 * Math.sin(secondAngle));
    clockCtx.strokeStyle = 'red';
    clockCtx.lineWidth = 1;
    clockCtx.stroke();

    clockCtx.font = '14px sans-serif'
    clockCtx.textAlign = 'center';
    clockCtx.textBaseline = 'middle';
    clockCtx.fillStyle = 'black';

    for (let i = 1; i <= 12; i++) {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = 100 + 72 * Math.cos(angle);
        const y = 100 + 72 * Math.sin(angle);
        clockCtx.fillText(i, x, y);
    }

    for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
        const isMajor = i % 5 === 0;
        const innerRadius = isMajor ? 75 : 82;

        clockCtx.beginPath();
        clockCtx.moveTo(100 + innerRadius * Math.cos(angle), 100 + innerRadius * Math.sin(angle));
        clockCtx.lineTo(100 + 90 * Math.cos(angle), 100 + 90 * Math.sin(angle));
        clockCtx.strokeStyle = 'black';
        clockCtx.lineWidth = isMajor ? 2 : 1;
        clockCtx.stroke();
    }

    console.log(hours, minutes);
}

drawClock();

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

            if (!Break) {
                logSession('work')
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

            updateDisplay();
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

function logSession(type) {
    console.log('logging session', type)
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString()
    SessionLog.push({date, time, type});
    console.log('SessionLog:', SessionLog)
    localStorage.setItem('sessionLog', JSON.stringify(SessionLog));
}

setInterval(drawClock, 1000);
drawClock()

updateDisplay();