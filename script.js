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

    let totalSeconds = 0;

    for (const task in summary) {
        totalSeconds += summary[task];

        const li = document.createElement("li");

        // タスク名と時間表示
        const label = document.createElement("span");
        label.textContent = `${task}: ${formatSecondsToMMSS(summary[task])} `;
        label.style.cursor = "pointer";
        label.addEventListener("click", () => {
            document.getElementById("taskName").value = task;
            currentTask = task;
            localStorage.setItem("taskName", task);
        });

        // 秒数入力フォーム
        const input = document.createElement("input");
        input.type = "number";
        input.min = "1";
        input.placeholder = "秒";
        input.style.width = "60px";
        input.style.marginLeft = "8px";

        // 減算ボタン
        const minusBtn = document.createElement("button");
        minusBtn.textContent = "減算";
        minusBtn.style.marginLeft = "4px";
        minusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const secToSubtract = parseInt(input.value, 10);
            if (!isNaN(secToSubtract) && secToSubtract > 0) {
                summary[task] = Math.max(0, summary[task] - secToSubtract);
                saveTaskSummary(summary);
                updateTaskSummaryUI();
            }
        });

        // 削除ボタン
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "削除";
        deleteBtn.style.marginLeft = "4px";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm(`「${task}」を削除しますか？`)) {
                delete summary[task]; // オブジェクトから削除
                saveTaskSummary(summary);
                updateTaskSummaryUI();
            }
        });

        li.appendChild(label);
        li.appendChild(input);
        li.appendChild(minusBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    }

    // 全体合計時間表示
    document.getElementById("totalTime").textContent =
        `全体合計: ${formatSecondsToMMSS(totalSeconds)}`;
}


// タイマー表示更新
function updateTimer() {
    let min = String(Math.floor(seconds / 60)).padStart(2, '0');
    let sec = String(seconds % 60).padStart(2, '0');
    document.getElementById("timer").textContent = `${min}:${sec}`;
}

// 前回の作業表示
function updateLastTaskUI() {
    const name = localStorage.getItem("lastTaskName");
    const time = localStorage.getItem("lastTaskTime");
    if (name && time !== null) {
        document.getElementById("lastTask").textContent =
            `前回の作業: ${name} (${formatSecondsToMMSS(parseInt(time, 10))})`;
    } else {
        document.getElementById("lastTask").textContent = "前回の作業: なし";
    }
}

// ページ読み込み時
document.addEventListener('DOMContentLoaded', () => {
    const savedTask = localStorage.getItem("taskName");
    if (savedTask !== null) {
        document.getElementById("taskName").value = savedTask;
        currentTask = savedTask;
    }

    seconds = 0;
    updateTimer();
    updateTaskSummaryUI();
    updateLastTaskUI();
});

// 作業内容入力欄の変更を検知
document.getElementById("taskName").addEventListener("input", (e) => {
    currentTask = e.target.value;
    localStorage.setItem("taskName", currentTask);
});

// 開始ボタン
document.getElementById("startBtn").addEventListener("click", () => {
    const taskInput = document.getElementById("taskName").value.trim();
    if (taskInput === "") {
        alert("作業内容を入力してください");
        return;
    }
    if (!timerInterval) {
        if (isNaN(seconds) || seconds < 0) seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            updateTimer();
        }, 1000);
    }
});

// 一時停止ボタン
document.getElementById("pauseBtn").addEventListener("click", () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
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

        // 前回の作業を保存
        localStorage.setItem("lastTaskName", currentTask);
        localStorage.setItem("lastTaskTime", seconds);

        updateTaskSummaryUI();
        updateLastTaskUI();
    }

    seconds = 0;
    updateTimer();
});
