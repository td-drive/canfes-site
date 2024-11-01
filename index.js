3// スタンプの状態をcookieから取得
function getStampStatus() {
    const cookies = document.cookie.split("; ");
    const status = {};

    cookies.forEach(cookie => {
        const [key, value] = cookie.split("=");
        // スタンプ用cookieはqr1からqr8
        if (key.startsWith("qr")) {
            status[key] = value === "true";
        }
    });

    return status;
}

// ビンゴ判定を行う
function checkBingo(stampStatus) {
    const bingoPatterns = [
        ["qr1", "qr2", "qr3"],
        ["qr4", "qr5", "qr6"],
        ["qr7", "qr8", "qr9"],
        ["qr1", "qr4", "qr7"],
        ["qr2", "qr5", "qr8"],
        ["qr3", "qr6", "qr9"],
        ["qr1", "qr5", "qr9"],
        ["qr3", "qr5", "qr7"]
    ];

    let bingoAchieved = false;
    bingoPatterns.forEach((pattern, index) => {
        if (pattern.every(cell => stampStatus[cell])) {
            // 該当するビンゴラインの豆知識cookieを保存
            document.cookie = `trivia${index + 1}=true; path=/`;
            bingoAchieved = true;
        }
    });
    return bingoAchieved;
}

// ビンゴカードを表示
function displayBingoCard() {
    const stampStatus = getStampStatus();
    const cells = document.querySelectorAll(".bingo-cell");

    cells.forEach(cell => {
        const stampId = `qr${cell.innerText}`;

        if(stampStatus[stampId]) {
            console.log(cell.innerText)
            const img = document.createElement("img");
            img.src = './img/stamp' + cell.innerText +  '.png';
            img.alt = `Stamp ${cell.innerText}`;
            cell.innerHTML = "";
            cell.agippendChild(img);
        }
    });
}

// 豆知識を表示・非表示
function displayTrivia() {
    const triviaItems = document.querySelectorAll("ul li");
    
    triviaItems.forEach((item, index) => {
        // 各豆知識のcookieが存在する場合のみ表示
        const triviaVisible = document.cookie.includes(`trivia${index + 1}=true`);
        item.style.display = triviaVisible ? "list-item" : "none";
    });
}

// 初期化
function initializeBingo() {
    displayBingoCard();

    const stampStatus = getStampStatus();
    if (checkBingo(stampStatus)) {
        displayTrivia();
    }
}

// ページ読み込み後の初期化実行
window.onload = initializeBingo;
