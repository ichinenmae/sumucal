let step = 0; // 0: 商品金額入力中, 1: 受け取り金額入力中, 2: 計算結果
let price = 0;
let received = 0;
const display = document.getElementById('display');
const status = document.getElementById('status');
const prevPrice = document.getElementById('prevPrice');
const actionButton = document.getElementById('actionButton');
const calculator = document.getElementById('calculator');
const result = document.getElementById('result');
const resultDetails = document.getElementById('result-details');

// ボタン要素を取得してダブルタップによるズームを防止
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
    let fontSize = 4;
    if (textLength > 6) {
        fontSize = Math.max(2, 4 - (textLength - 6) * 0.3);
    }
    display.style.fontSize = `${fontSize}rem`;
}

function resetAll() {
    display.innerText = '0';
    display.style.fontSize = '4rem';
    prevPrice.style.display = 'none';
    status.innerText = '商品金額を入力してください';
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
    display.style.fontSize = '4rem';
}

function calculateChange() {
    if (step === 0) {
        price = parseInt(display.innerText.replace(/[^0-9]/g, ''));
        display.innerText = '0';
        display.style.fontSize = '4rem';
        prevPrice.style.display = 'block';
        prevPrice.innerText = `商品金額: ￥${price.toLocaleString('ja-JP')}`;
        status.innerText = '受け取り金額を入力してください';
        actionButton.innerText = '計算';
        step = 1;
    } else if (step === 1) {
        received = parseInt(display.innerText.replace(/[^0-9]/g, ''));
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
                <div style="font-size: 1rem; color: #888;">受け取り金額 ￥${received.toLocaleString('ja-JP')}</div>
                <div style="font-size: 1rem; color: #888;">- 商品金額 ￥${price.toLocaleString('ja-JP')}</div>
                <div style="font-size: 6rem; margin: 20px 0;">￥${change.toLocaleString('ja-JP')}</div>
            `;
            if (change > 0) {
                const denominations = [10000, 5000, 1000, 500, 100, 50, 10, 5, 1];
                let remainingChange = change;
                details += '<div style="font-size: 1rem; color: #888;">お札・硬貨の枚数:</div>';
                for (let denom of denominations) {
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