let timerInterval;
let seconds = 0;

function updateTimer() {
    let min = String(Math.floor(seconds / 60)).padStart(2, '0');
    let sec = String(seconds % 60).padStart(2, '0');
    document.getElementById("timer").textContent = `${min}:${sec}`;
}

document.getElementById("startBtn").addEventListener("click", () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            seconds++;
            updateTimer();
        }, 1000);
    }
});

document.getElementById("stopBtn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById("resetBtn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    seconds = 0;
    updateTimer();
});

updateTimer(); // 初期表示
