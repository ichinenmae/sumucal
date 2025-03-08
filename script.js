let step = 0; // 0: 商品金額入力中, 1: 支払い金額入力中
let price = 0;
let received = 0;
const display = document.getElementById('display');
const status = document.getElementById('status');
const actionButton = document.getElementById('actionButton');

// ボタン要素を取得してダブルタップによるズームを防止
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('dblclick', (event) => {
        event.preventDefault(); // ダブルタップ時のデフォルト動作（ズーム）をキャンセル
    });
});

function inputDigit(digit) {
    if (display.innerText === '0') {
        display.innerText = digit;
    } else {
        display.innerText += digit;
    }
    adjustFontSize();
}

function adjustFontSize() {
    const textLength = display.innerText.length;
    let fontSize = 2.5;
    if (textLength > 6) {
        fontSize = Math.max(1.5, 2.5 - (textLength - 6) * 0.2);
    }
    display.style.fontSize = `${fontSize}rem`;
}

function clearDisplay() {
    display.innerText = '0';
    display.style.fontSize = '2.5rem';
    status.innerText = '商品金額を入力してください';
    actionButton.innerText = '次へ';
    step = 0;
    price = 0;
    received = 0;
}

function calculateChange() {
    if (step === 0) {
        price = parseInt(display.innerText);
        display.innerText = '0';
        display.style.fontSize = '2.5rem';
        status.innerText = '支払い金額を入力してください';
        actionButton.innerText = '計算';
        step = 1;
    } else {
        received = parseInt(display.innerText);
        const change = received - price;

        if (change < 0) {
            display.innerText = '支払い金額が不足しています';
            status.innerText = 'もう一度お試しください';
        } else if (change === 0) {
            display.innerText = 'お釣りはありません';
            status.innerText = '計算完了';
        } else {
            const denominations = [10000, 5000, 1000, 500, 100, 50, 10, 5, 1];
            let result = 'お釣り:\n';
            let remainingChange = change;

            for (let denom of denominations) {
                const count = Math.floor(remainingChange / denom);
                if (count > 0) {
                    result += `${denom}円 x ${count}\n`;
                    remainingChange -= denom * count;
                }
            }
            display.innerText = result;
            status.innerText = `合計お釣り: ${change}円`;
        }
        step = 0;
        actionButton.innerText = '次へ';
        display.style.fontSize = '2rem';
    }
}
