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

// ページ読み込み時の復元処理
window.onload = function() {
    const savedSeconds = localStorage.getItem("timerSeconds");
    if (savedSeconds !== null) {
        seconds = parseInt(savedSeconds, 10);
        updateTimer();
    }
    const savedTask = localStorage.getItem("taskName");
    if (savedTask !== null) {
        document.getElementById("taskName").value = savedTask;
    }
};

// タイマー開始処理（既存のstartBtnクリックイベント内に追加）
document.getElementById("startBtn").addEventListener("click", () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            seconds++;
            updateTimer();
            localStorage.setItem("timerSeconds", seconds);  // 保存
        }, 1000);
    }
});

// 作業内容入力欄の変更を検知して保存
document.getElementById("taskName").addEventListener("input", (e) => {
    localStorage.setItem("taskName", e.target.value);
});

// 停止ボタンやリセットボタンでのローカルストレージ操作も考慮
document.getElementById("stopBtn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    // 停止時も秒数は残すので特に削除しない
});

document.getElementById("resetBtn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    seconds = 0;
    updateTimer();
    localStorage.removeItem("timerSeconds");  // 削除
    localStorage.removeItem("taskName");      // 削除
});
