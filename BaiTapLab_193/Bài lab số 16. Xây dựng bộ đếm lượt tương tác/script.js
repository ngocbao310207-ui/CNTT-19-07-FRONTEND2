$(document).ready(function() {
    // ===== KHAI BÁO BIẾN TRẠNG THÁI =====
    let counterValue = 0;              // Giá trị bộ đếm
    let interactionCount = 0;          // Số lần tương tác
    let maxValue = 0;                  // Giá trị lớn nhất đạt được
    let minValue = 0;                  // Giá trị nhỏ nhất đạt được
    const MIN_ALLOWED = -100;          // Giới hạn tối thiểu
    const MAX_ALLOWED = 100;           // Giới hạn tối đa

    // ===== HÀM CẬP NHẬT GIAO DIỆN =====

    /**
     * Cập nhật số đếm và hiệu ứng hiển thị
     */
    function updateDisplay() {
        // Cập nhật giá trị đếm
        $('#counterValue').text(counterValue);

        // Áp dụng màu sắc
        applyColorTheme();

        // Cập nhật trạng thái văn bản
        updateStatusText();

        // Cập nhật max value
        if (counterValue > maxValue) {
            maxValue = counterValue;
            $('#maxValue').text(maxValue);
        }

        // Thêm hiệu ứng animation
        addAnimation();

        console.log(`Giá trị: ${counterValue} | Max: ${maxValue} | Lần tương tác: ${interactionCount}`);
    }

    /**
     * Áp dụng chủ đề màu dựa trên giá trị đếm
     */
    function applyColorTheme() {
        const $display = $('#counterDisplay');
        
        if (counterValue > 0) {
            // Màu xanh cho giá trị dương
            $display.css('background', 'linear-gradient(135deg, #00c853 0%, #00a040 100%)');
        } else if (counterValue < 0) {
            // Màu đỏ cho giá trị âm
            $display.css('background', 'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)');
        } else {
            // Màu tím cho 0
            $display.css('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
        }
    }

    /**
     * Cập nhật trạng thái văn bản
     */
    function updateStatusText() {
        const $statusBadge = $('#statusText');
        let status, className;

        if (counterValue > 0) {
            status = `✅ POSITIVE (+${counterValue})`;
            className = 'status-positive';
        } else if (counterValue < 0) {
            status = `❌ NEGATIVE (${counterValue})`;
            className = 'status-negative';
        } else {
            status = '⚪ ZERO';
            className = 'status-zero';
        }

        $statusBadge.text(status).attr('class', `status-badge ${className}`);
    }

    /**
     * Thêm hiệu ứng animation
     */
    function addAnimation() {
        const $display = $('#counterDisplay');
        
        if (counterValue > 0) {
            $display.removeClass('animate-shake animate-bounce').addClass('animate-pulse');
        } else if (counterValue < 0) {
            $display.removeClass('animate-pulse animate-bounce').addClass('animate-shake');
        } else {
            $display.removeClass('animate-pulse animate-shake').addClass('animate-bounce');
        }

        // Xóa class sau animation kết thúc
        setTimeout(() => {
            $display.removeClass('animate-pulse animate-shake animate-bounce');
        }, 400);
    }

    /**
     * Cập nhật số lần tương tác
     */
    function updateInteractionCount() {
        interactionCount++;
        $('#interactionCount').text(interactionCount);
    }

    /**
     * Kiểm tra giới hạn giá trị
     */
    function checkLimits() {
        if (counterValue < MIN_ALLOWED) {
            counterValue = MIN_ALLOWED;
            showAlert('⚠️ Đã đạt giới hạn tối thiểu!');
        }
        if (counterValue > MAX_ALLOWED) {
            counterValue = MAX_ALLOWED;
            showAlert('⚠️ Đã đạt giới hạn tối đa!');
        }
    }

    /**
     * Hiển thị cảnh báo
     */
    function showAlert(message) {
        const $alert = $('<div class="alert">' + message + '</div>');
        $('body').append($alert);
        setTimeout(() => $alert.fadeOut(300, function() { $(this).remove(); }), 2000);
    }

    // ===== GẮN SỰ KIỆN CHO CÁC NÚT =====

    // Nút tăng 1 đơn vị
    $('#increaseBtn').click(function() {
        counterValue++;
        checkLimits();
        updateDisplay();
        updateInteractionCount();
    });

    // Nút giảm 1 đơn vị
    $('#decreaseBtn').click(function() {
        counterValue--;
        checkLimits();
        updateDisplay();
        updateInteractionCount();
    });

    // Nút tăng 10 đơn vị ⭐ MỞ RỘNG 1
    $('#increase10Btn').click(function() {
        counterValue += 10;
        checkLimits();
        updateDisplay();
        updateInteractionCount();
        showAlert('➕ Tăng 10 đơn vị!');
    });

    // Nút giảm 10 đơn vị ⭐ MỞ RỘNG 1
    $('#decrease10Btn').click(function() {
        counterValue -= 10;
        checkLimits();
        updateDisplay();
        updateInteractionCount();
        showAlert('➖ Giảm 10 đơn vị!');
    });

    // Nút đặt lại về 0
    $('#resetBtn').click(function() {
        counterValue = 0;
        updateDisplay();
        updateInteractionCount();
        showAlert('🔄 Đã đặt lại!');
    });

    // ===== HỖ TRỢ PHÍM TẮT =====
    $(document).keydown(function(e) {
        switch(e.key) {
            case '+':
            case '=':
                e.preventDefault();
                $('#increaseBtn').click();
                break;
            case '-':
                e.preventDefault();
                $('#decreaseBtn').click();
                break;
            case '0':
            case 'r':
            case 'R':
                e.preventDefault();
                $('#resetBtn').click();
                break;
            case 'ArrowUp':
                e.preventDefault();
                $('#increase10Btn').click();
                break;
            case 'ArrowDown':
                e.preventDefault();
                $('#decrease10Btn').click();
                break;
        }
    });

    // ===== HỖ TRỢ KÉO CHUỘT ⭐ MỞ RỘNG 2 =====
    let isDragging = false;
    let startY = 0;
    let dragThreshold = 15;

    $('#counterDisplay').mousedown(function(e) {
        isDragging = true;
        startY = e.pageY;
    });

    $(document).mousemove(function(e) {
        if (isDragging) {
            let diff = startY - e.pageY;
            
            // Kéo lên: tăng giá trị
            if (diff > dragThreshold) {
                counterValue++;
                checkLimits();
                updateDisplay();
                updateInteractionCount();
                startY = e.pageY;
                showAlert('⬆️ Kéo lên = Tăng');
            }
            // Kéo xuống: giảm giá trị
            else if (diff < -dragThreshold) {
                counterValue--;
                checkLimits();
                updateDisplay();
                updateInteractionCount();
                startY = e.pageY;
                showAlert('⬇️ Kéo xuống = Giảm');
            }
        }
    });

    $(document).mouseup(function() {
        isDragging = false;
    });

    // Tính năng chạm (touch) cho mobile ⭐ MỞ RỘNG 2
    let touchStartY = 0;

    $('#counterDisplay').on('touchstart', function(e) {
        touchStartY = e.touches[0].pageY;
    });

    $('#counterDisplay').on('touchmove', function(e) {
        let touchEndY = e.touches[0].pageY;
        let diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 30) {
            if (diff > 0) {
                // Vuốt lên
                counterValue++;
            } else {
                // Vuốt xuống
                counterValue--;
            }
            checkLimits();
            updateDisplay();
            updateInteractionCount();
            touchStartY = touchEndY;
        }
    });

    // ===== KHỞI TẠO =====
    updateDisplay();
    console.log('🚀 Bộ đếm đã sẵn sàng!');
});