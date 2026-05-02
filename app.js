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
    clockCtx.fillStyle = getComputedStyle(document.body).getPropertyValue('--surface');
    clockCtx.fill();
    clockCtx.strokeStyle = 'black';
    clockCtx.lineWidth = 3;
    clockCtx.stroke();

    const totalTime = Break ? (numofBreaks === 4 ? 15 * 60 : 5 * 60) : 25 * 60;
    const progress = timeLeft / (60 * 60);
    const progressAngle = progress * 2 * Math.PI;

    clockCtx.beginPath();
    clockCtx.moveTo(100, 100);
    clockCtx.arc(100, 100, 88, -Math.PI/2, -Math.PI/2 + progressAngle);
    clockCtx.closePath();
    clockCtx.fillStyle = 'rgba(245, 200, 66, 0.35)';
    clockCtx.fill();

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
    console.log('timeLeft:', timeLeft, 'totalTime:', totalTime, 'Progress:', progress)
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
    playBeep(440, 0.2)
    clearInterval(timerInterval)
 
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            isRunning = false;

            if (!Break) {
                playBeep(880, 0.5)
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

function getColor(count) {
    if (count === 0) return '#eee';
    if (count <= 2) return '#9be9a8';
    if (count <= 4) return '#40c463';
    return '#216e39'
}

function renderHeatmap() {
    const heatmap = document.getElementById('heatmap');
    heatmap.innerHTML = '';

    for (let i=29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toLocaleDateString()

        const count = SessionLog.filter(s => s.date === dateString && s.type === 'work').length

        const box = document.createElement('div');
        box.classList.add('heatmap-box');
        box.style.background = getColor(count)
        heatmap.appendChild(box);

        box.addEventListener('mouseenter', (e) => {
            const tooltip = document.getElementById('tooltip');
            tooltip.textContent = dateString + '-' + count + 'sessions';
            tooltip.style.display = 'block';
            tooltip.style.left = e.clientX + 10 + 'px';
            tooltip.style.top = e.clientY + 10 + 'px';
        });

        box.addEventListener('mouseleave', () => {
            document.getElementById('tooltip').style.display = 'none';
        });
    }
}

function playBeep(frequency, duration) {
    const audioCtx = new AudioContext;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
}

document.getElementById('theme').addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('theme').textContent = isDark ? 'Dark Mode' : 'Light Mode';
})

renderHeatmap()

setInterval(drawClock, 1000);
drawClock()

updateDisplay();