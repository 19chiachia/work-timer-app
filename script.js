let timerInterval;
let seconds = 0;
let currentTask = "";

// localStorageキー
const STORAGE_KEY = "taskTimeSummary";

// 作業内容ごとの合計秒数を保持するオブジェクトを取得・初期化
function loadTaskSummary() {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : {};
}

function saveTaskSummary(summary) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
}

// 秒数を「mm:ss」形式に変換
function formatSecondsToMMSS(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// 画面に合計時間リストを表示
function updateTaskSummaryUI() {
    const summary = loadTaskSummary();
    const list = document.getElementById("taskSummaryList");
    list.innerHTML = "";

    for (const task in summary) {
        const li = document.createElement("li");
        li.textContent = `${task}: ${formatSecondsToMMSS(summary[task])}`;

        // クリックで入力欄にセットするイベント
        li.style.cursor = "pointer"; // クリックできることを示す
        li.addEventListener("click", () => {
            document.getElementById("taskName").value = task;
            currentTask = task;
            localStorage.setItem("taskName", task);
        });

        list.appendChild(li);
    }
}

// タイマー表示更新
function updateTimer() {
    let min = String(Math.floor(seconds / 60)).padStart(2, '0');
    let sec = String(seconds % 60).padStart(2, '0');
    document.getElementById("timer").textContent = `${min}:${sec}`;
}

// ページ読み込み時
document.addEventListener('DOMContentLoaded', () => {
    // 作業内容復元
    const savedTask = localStorage.getItem("taskName");
    if (savedTask !== null) {
        document.getElementById("taskName").value = savedTask;
        currentTask = savedTask;
    }

    // タイマー秒数復元はリセット（または任意で復元可能）
    seconds = 0;
    updateTimer();

    updateTaskSummaryUI();
});

// 作業内容入力欄の変更を検知してcurrentTask更新
document.getElementById("taskName").addEventListener("input", (e) => {
    currentTask = e.target.value;
    localStorage.setItem("taskName", currentTask);
});


// 開始ボタン
document.getElementById("startBtn").addEventListener("click", () => {
    const taskInput = document.getElementById("taskName").value.trim();
    // 作業内容が空欄の場合は開始させない
    if (taskInput === "") {
        alert("作業内容を入力してください");
        return; // 処理中断
    }
    if (!timerInterval) {
        if (isNaN(seconds) || seconds < 0) seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            updateTimer();
        }, 1000);
    }
});

//一時停止ボタン
document.getElementById("pauseBtn").addEventListener("click", () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        // ここで合計時間には加算しない（何もしない）
    }
});

// 停止ボタン
document.getElementById("stopBtn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;

    if (currentTask && seconds > 0) {
        const summary = loadTaskSummary();
        summary[currentTask] = (summary[currentTask] || 0) + seconds;
        saveTaskSummary(summary);
        updateTaskSummaryUI();
    }
    seconds = 0;
    updateTimer();
});
