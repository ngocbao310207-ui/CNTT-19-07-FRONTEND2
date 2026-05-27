
$(function () {


  function showError(fieldId, msg) {
    const $fg = $('#' + fieldId);
    $fg.removeClass('has-success').addClass('has-error');
    $fg.find('.err').text(msg);
  }

  function showSuccess(fieldId) {
    const $fg = $('#' + fieldId);
    $fg.removeClass('has-error').addClass('has-success');
    $fg.find('.err').text('');
  }

  function clearState(fieldId) {
    const $fg = $('#' + fieldId);
    $fg.removeClass('has-error has-success');
    $fg.find('.err').text('');
  }

  $('.eye-btn').on('click', function () {
    const targetId = $(this).data('target');
    const $inp = $('#' + targetId);
    const isHidden = $inp.attr('type') === 'password';
    $inp.attr('type', isHidden ? 'text' : 'password');
    $(this).find('.eye-open').text(isHidden ? '🙈' : '👁');
  });

  function getPasswordStrength(pw) {
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; 
  }

  $('#password').on('input', function () {
    const pw = $(this).val();
    const score = getPasswordStrength(pw);

    const pct    = (score / 5) * 100;
    const colors = ['#f87171','#f87171','#fbbf24','#4ade80','#22d3a4'];
    const labels = ['','Rất yếu','Yếu','Trung bình','Mạnh','Rất mạnh'];

    if (pw.length === 0) {
      $('#strengthFill').css({ width: '0%' });
      $('#strengthLabel').text('');
    } else {
      $('#strengthFill').css({ width: pct + '%', background: colors[score - 1] || '#f87171' });
      $('#strengthLabel').text(labels[score] || 'Rất yếu');
    }
  });

  $('#fullname').on('blur', function () {
    const val = $(this).val().trim();
    if (!val) return showError('fg-name', 'Vui lòng nhập họ và tên.');
    if (val.length < 3) return showError('fg-name', 'Họ tên phải ít nhất 3 ký tự.');
    showSuccess('fg-name');
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  $('#email').on('blur', function () {
    const val = $(this).val().trim();
    if (!val) return showError('fg-email', 'Vui lòng nhập địa chỉ email.');
    if (!emailRegex.test(val)) return showError('fg-email', 'Email không đúng định dạng.');
    showSuccess('fg-email');
  });

  $('#password').on('blur', function () {
    const val = $(this).val();
    if (!val) return showError('fg-password', 'Vui lòng nhập mật khẩu.');
    if (val.length < 8) return showError('fg-password', 'Mật khẩu phải ít nhất 8 ký tự.');
    showSuccess('fg-password');
    if ($('#confirm').val()) validateConfirm();
  });

  function validateConfirm() {
    const pw   = $('#password').val();
    const conf = $('#confirm').val();
    if (!conf) return showError('fg-confirm', 'Vui lòng nhập lại mật khẩu.');
    if (pw !== conf) return showError('fg-confirm', 'Mật khẩu xác nhận không trùng khớp.');
    showSuccess('fg-confirm');
  }
  $('#confirm').on('blur', validateConfirm);

  const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
  $('#phone').on('blur', function () {
    const val = $(this).val().replace(/\s/g, '');
    if (!val) return clearState('fg-phone'); // Không bắt buộc
    if (!phoneRegex.test(val)) return showError('fg-phone', 'Số điện thoại không hợp lệ (VD: 0901234567).');
    showSuccess('fg-phone');
  });


  $('#registerForm').on('submit', function (e) {
    e.preventDefault(); 

    let valid = true;

    const name = $('#fullname').val().trim();
    if (!name || name.length < 3) { showError('fg-name', 'Vui lòng nhập họ tên hợp lệ (ít nhất 3 ký tự).'); valid = false; }
    else showSuccess('fg-name');

    const email = $('#email').val().trim();
    if (!email || !emailRegex.test(email)) { showError('fg-email', 'Email không hợp lệ.'); valid = false; }
    else showSuccess('fg-email');

    const pw = $('#password').val();
    if (!pw || pw.length < 8) { showError('fg-password', 'Mật khẩu phải ít nhất 8 ký tự.'); valid = false; }
    else showSuccess('fg-password');

    const conf = $('#confirm').val();
    if (!conf || conf !== pw) { showError('fg-confirm', 'Mật khẩu xác nhận không khớp.'); valid = false; }
    else showSuccess('fg-confirm');

    const phone = $('#phone').val().replace(/\s/g, '');
    if (phone && !phoneRegex.test(phone)) { showError('fg-phone', 'Số điện thoại không hợp lệ.'); valid = false; }
    else if (phone) showSuccess('fg-phone');

    if (valid) {
      $('#registerForm').fadeOut(300, function () {
        $('#successBanner').fadeIn(400);
      });
    } else {
      $('#registerForm .btn-submit').addClass('shake');
      setTimeout(() => $('#registerForm .btn-submit').removeClass('shake'), 500);
    }
  });

});