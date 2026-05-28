$(document).ready(function () {
  let count = 0;

  const $countValue = $('#countValue');
  const $countStatus = $('#countStatus');
  const $historyList = $('#historyList');

  function updateDisplay() {
    $countValue.text(count);

    if (count > 0) {
      $countStatus.text('Dương');
      $countValue.css('color', '#4ade80');
    } else if (count < 0) {
      $countStatus.text('Âm');
      $countValue.css('color', '#f87171');
    } else {
      $countStatus.text('Trung tính');
      $countValue.css('color', '');
    }
    
    $countValue.hide().fadeIn(150);
  }

  function logHistory(action) {
    $historyList.find('.history-empty').remove();

    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN');

    const historyItem = `
      <li>
        <span style="color: #888; font-size: 0.9em;">[${timeString}]</span> 
        ${action}. 
        Giá trị hiện tại: <strong>${count}</strong>
      </li>
    `;

    $historyList.prepend(historyItem);
  }

  $('#btnPlus').on('click', function () {
    count++;
    updateDisplay();
    logHistory('Tăng 1');
  });

  $('#btnMinus').on('click', function () {
    count--;
    updateDisplay();
    logHistory('Giảm 1');
  });

  $('#btnReset').on('click', function () {
    if (count !== 0) {
      count = 0;
      updateDisplay();
      logHistory('Đặt lại về 0');
    }
  });

  $('.quick-btn').on('click', function () {
    const amount = parseInt($(this).data('amount'));
    
    count += amount;
    updateDisplay();

    const actionText = amount > 0 ? `Cộng nhanh ${amount}` : `Trừ nhanh ${Math.abs(amount)}`;
    logHistory(actionText);
  });

  $('#clearHistory').on('click', function () {
    $historyList.html('<li class="history-empty">Chưa có thao tác nào.</li>');
  });

  updateDisplay();
});