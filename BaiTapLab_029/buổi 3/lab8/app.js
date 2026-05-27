const display = document.getElementById('counterValue');
let count = 0;

function updateUI() {
    display.textContent = count;
    
    if (count > 0) {
        display.className = 'positive';
    } else if (count < 0) {
        display.className = 'negative';
    } else {
        display.className = 'zero';
    }
}

document.getElementById('btnMinus5').addEventListener('click', () => {
    count -= 5;
    updateUI();
});

document.getElementById('btnMinus1').addEventListener('click', () => {
    count -= 1;
    updateUI();
});

document.getElementById('btnReset').addEventListener('click', () => {
    count = 0;
    updateUI();
});

document.getElementById('btnPlus1').addEventListener('click', () => {
    count += 1;
    updateUI();
});

document.getElementById('btnPlus5').addEventListener('click', () => {
    count += 5;
    updateUI();
});

updateUI();