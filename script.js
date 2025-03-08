// 定数
const FONT_SIZE_DEFAULT = 4;
const FONT_SIZE_MIN = 2;
const DENOMINATIONS = [10000, 5000, 1000, 500, 100, 50, 10, 5, 1];

// 状態管理
let step = 0;
let price = 0;
let received = 0;

// DOM要素
const display = document.getElementById('display');
const status = document.getElementById('status');
const prevPrice = document.getElementById('prevPrice');
const actionButton = document.getElementById('actionButton');
const calculator = document.getElementById('calculator');
const result = document.getElementById('result');
const resultDetails = document.getElementById('result-details');

// 3桁区切り関数（toLocaleStringの代替）
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ボタン要素を取得してダブルタップを防止
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('dblclick', (event) => {
        event.preventDefault();
    });
});

function inputDigit(digit) {
    if (display.innerText === '0' || step === 2) {
        display.innerText = digit;
    } else {
        display.innerText += digit;
    }
    adjustFontSize();
}

function inputDoubleZero() {
    if (display.innerText === '0' || step === 2) {
        display.innerText = '0';
    } else {
        display.innerText += '00';
    }
    adjustFontSize();
}

function adjustFontSize() {
    const textLength = display.innerText.length;
    let fontSize = FONT_SIZE_DEFAULT;
    if (textLength > 6) {
        fontSize = Math.max(FONT_SIZE_MIN, FONT_SIZE_DEFAULT - (textLength - 6) * 0.3);
    }
    display.style.fontSize = `${fontSize}rem`;
}

function resetAll() {
    display.innerText = '0';
    display.style.fontSize = `${FONT_SIZE_DEFAULT}rem`;
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

function clearDisplay() {
    display.innerText = '0';
    display.style.fontSize = `${FONT_SIZE_DEFAULT}rem`;
}

function calculateChange() {
    if (step === 0) {
        const priceValue = parseInt(display.innerText.replace(/[^0-9]/g, '')) || 0;
        if (priceValue <= 0) {
            display.innerText = '有効な金額を入力してください';
            return;
        }
        price = priceValue;
        display.innerText = '0';
        display.style.fontSize = `${FONT_SIZE_DEFAULT}rem`;
        prevPrice.style.display = 'block';
        prevPrice.innerText = `商品金額: ￥${formatNumber(price)}`;
        status.innerText = '受け取り金額を入力してください';
        actionButton.innerText = '計算';
        step = 1;
    } else if (step === 1) {
        const receivedValue = parseInt(display.innerText.replace(/[^0-9]/g, '')) || 0;
        if (receivedValue <= 0) {
            display.innerText = '有効な金額を入力してください';
            return;
        }
        received = receivedValue;
        const change = received - price;

        if (change < 0) {
            display.innerText = '受け取り金額が不足しています';
            status.innerText = 'もう一度お試しください';
        } else {
            calculator.style.display = 'none';
            result.style.display = 'flex';
            status.style.display = 'none';
            prevPrice.style.display = 'none';
            display.style.display = 'none';
            let details = `
                <div style="font-size: 1rem; color: #888;">受け取り金額 ￥${formatNumber(received)}</div>
                <div style="font-size: 1rem; color: #888;">- 商品金額 ￥${formatNumber(price)}</div>
                <div style="font-size: 6rem; margin: 20px 0;">￥${formatNumber(change)}</div>
            `;
            if (change > 0) {
                let remainingChange = change;
                details += '<div style="font-size: 1rem; color: #888;">お札・硬貨の枚数:</div>';
                for (let denom of DENOMINATIONS) {
                    const count = Math.floor(remainingChange / denom);
                    if (count > 0) {
                        details += `<div style="font-size: 1rem; color: #888;">${denom}円 x ${count}</div>`;
                        remainingChange -= denom * count;
                    }
                }
            }
            resultDetails.innerHTML = details;
            step = 2;
        }
    }
}