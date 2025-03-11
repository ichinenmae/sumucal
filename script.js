// 定数
const FONT_SIZE_DEFAULT = 4;
const FONT_SIZE_MIN = 2;
const DENOMINATIONS = [10000, 5000, 1000, 500, 100, 50, 10, 5, 1];

// 状態管理
let step = 0; // 0: 商品金額入力中, 1: 受け取り金額入力中, 2: 計算結果表示中
let price = 0;
let received = 0;
let errorInterval = null; // エラー表示用のインターバルID

// DOM要素
const display = document.getElementById('display');
const status = document.getElementById('status');
const prevPrice = document.getElementById('prevPrice');
const actionButton = document.getElementById('actionButton');
const calculator = document.getElementById('calculator');
const result = document.getElementById('result');
const resultDetails = document.getElementById('result-details');

// 3桁区切り関数
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 硬貨・紙幣の日本語表記関数
function getDenominationName(denom) {
    const names = {
        10000: '一万円札',
        5000: '五千円札',
        1000: '千円札',
        500: '五百円玉',
        100: '百円玉',
        50: '五十円玉',
        10: '十円玉',
        5: '五円玉',
        1: '一円玉'
    };
    return names[denom] || `${denom}円`;
}

// ダブルタップを防止
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('dblclick', (event) => {
        event.preventDefault();
    });
});

// 数字入力処理
function inputDigit(digit) {
    if (display.innerText === '0' || display.innerText === 'エラー' || step === 2) {
        display.innerText = digit.toString();
    } else {
        display.innerText += digit.toString();
    }
    adjustFontSize();
    if (errorInterval) {
        clearInterval(errorInterval);
        errorInterval = null;
        status.innerText = step === 0 ? '商品金額を入力してください' : '受け取り金額を入力してください';
    }
}

// 00入力処理
function inputDoubleZero() {
    if (display.innerText === '0' || display.innerText === 'エラー' || step === 2) {
        display.innerText = '0';
    } else {
        display.innerText += '00';
    }
    adjustFontSize();
    if (errorInterval) {
        clearInterval(errorInterval);
        errorInterval = null;
        status.innerText = step === 0 ? '商品金額を入力してください' : '受け取り金額を入力してください';
    }
}

// フォントサイズ調整
function adjustFontSize() {
    const textLength = display.innerText.length;
    let fontSize = FONT_SIZE_DEFAULT;
    if (textLength > 6 && display.innerText !== 'エラー') {
        fontSize = Math.max(FONT_SIZE_MIN, FONT_SIZE_DEFAULT - (textLength - 6) * 0.3);
    }
    display.style.fontSize = `${fontSize}rem`;
}

// 初期状態にリセット
function resetAll() {
    if (errorInterval) {
        clearInterval(errorInterval);
        errorInterval = null;
    }
    display.innerText = '0';
    display.style.fontSize = `${FONT_SIZE_DEFAULT}rem`;
    display.style.textAlign = 'center';
    prevPrice.style.display = 'none';
    status.innerText = '商品金額を入力してください';
    status.style.display = 'block';
    actionButton.innerText = '次へ';
    step = 0;
    price = 0;
    received = 0;
    calculator.style.display = 'grid';
    result.style.display = 'none';
    display.style.display = 'block';
}

// 入力欄クリア
function clearDisplay() {
    if (errorInterval) {
        clearInterval(errorInterval);
        errorInterval = null;
    }
    display.innerText = '0';
    display.style.fontSize = `${FONT_SIZE_DEFAULT}rem`;
    display.style.textAlign = 'center';
    status.innerText = step === 0 ? '商品金額を入力してください' : '受け取り金額を入力してください';
}

// エラー表示のアニメーション
function startErrorAnimation(errorMessage) {
    if (errorInterval) {
        clearInterval(errorInterval);
        errorInterval = null;
    }
    display.innerText = 'エラー';
    display.style.fontSize = `${FONT_SIZE_DEFAULT}rem`;
    display.style.textAlign = 'center';
    let messages = [errorMessage, 'Cを押してもう一度お試しください'];
    let index = 0;
    errorInterval = setInterval(() => {
        status.innerText = messages[index];
        index = (index + 1) % messages.length;
    }, 2000);
}

// 計算処理
function calculateChange() {
    if (step === 0) {
        const priceValue = parseInt(display.innerText.replace(/[^0-9]/g, '')) || 0;
        if (priceValue <= 0) {
            startErrorAnimation('有効な金額を入力してください');
            return;
        }
        if (errorInterval) {
            clearInterval(errorInterval);
            errorInterval = null;
        }
        price = priceValue;
        display.innerText = '0';
        display.style.fontSize = `${FONT_SIZE_DEFAULT}rem`;
        display.style.textAlign = 'center';
        prevPrice.style.display = 'block';
        prevPrice.innerText = `商品金額: ￥${formatNumber(price)}`;
        status.innerText = '受け取り金額を入力してください';
        actionButton.innerText = '計算';
        step = 1;
    } else if (step === 1) {
        const receivedValue = parseInt(display.innerText.replace(/[^0-9]/g, '')) || 0;
        if (receivedValue <= 0) {
            startErrorAnimation('有効な金額を入力してください');
            return;
        }
        if (errorInterval) {
            clearInterval(errorInterval);
            errorInterval = null;
        }
        received = receivedValue;
        const change = received - price;

        if (change < 0) {
            display.innerText = 'エラー';
            display.style.fontSize = `${FONT_SIZE_DEFAULT}rem`;
            display.style.textAlign = 'center';
            startErrorAnimation('受け取り金額が不足しています');
            return;
        }
        calculator.style.display = 'none';
        result.style.display = 'flex';
        status.style.display = 'none';
        prevPrice.style.display = 'none';
        display.style.display = 'none';
        let details = `
            <div class="result-details-amounts">
                <div>受け取り金額</div>
                <div>￥${formatNumber(received)}</div>
                <div>- 商品金額</div>
                <div>￥${formatNumber(price)}</div>
            </div>
            <div class="result-details-change">￥${formatNumber(change)}</div>
        `;
        if (change > 0) {
            let remainingChange = change;
            details += '<div class="result-details-breakdown">';
            details += '<div>お札・硬貨の枚数:</div>';
            for (let denom of DENOMINATIONS) {
                const count = Math.floor(remainingChange / denom);
                if (count > 0) {
                    details += `<div>${getDenominationName(denom)} x ${count}</div>`;
                    remainingChange -= denom * count;
                }
            }
            details += '</div>';
        }
        resultDetails.innerHTML = details;
        step = 2;
    }
}