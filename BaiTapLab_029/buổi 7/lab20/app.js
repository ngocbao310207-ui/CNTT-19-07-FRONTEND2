
const ROLE_CONFIG = {
  admin:  { label: '👑 Quản trị viên', cls: 'role-admin' },
  editor: { label: '✏️ Biên tập viên', cls: 'role-editor' },
  member: { label: '👥 Thành viên',    cls: 'role-member' },
  viewer: { label: '👁️ Người xem',    cls: 'role-viewer' },
};

let addedMembers = [];
let requestCount = 0;

function toggleApiConfig() {
  const body = $('#api-config-body');
  const icon = $('#toggle-icon');
  body.slideToggle(200);
  icon.toggleClass('open');
}

function validateForm() {
  let valid = true;

  $('.field-error').removeClass('show').text('');
  $('.input-wrap').removeClass('error-border');

  const name     = $('#inp-name').val().trim();
  const username = $('#inp-username').val().trim();
  const email    = $('#inp-email').val().trim();
  const role     = $('#inp-role').val();

  if (!name) {
    showFieldError('err-name', 'inp-name', '⚠ Vui lòng nhập họ và tên');
    valid = false;
  } else if (name.length < 2) {
    showFieldError('err-name', 'inp-name', '⚠ Họ tên phải có ít nhất 2 ký tự');
    valid = false;
  }

  if (!username) {
    showFieldError('err-username', 'inp-username', '⚠ Vui lòng nhập tên đăng nhập');
    valid = false;
  } else if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
    showFieldError('err-username', 'inp-username', '⚠ Chỉ dùng chữ, số, gạch dưới (≥3 ký tự)');
    valid = false;
  }

  if (!email) {
    showFieldError('err-email', 'inp-email', '⚠ Vui lòng nhập email');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError('err-email', 'inp-email', '⚠ Định dạng email không hợp lệ');
    valid = false;
  }

  if (!role) {
    showFieldError('err-role', 'inp-role', '⚠ Vui lòng chọn vai trò');
    valid = false;
  }

  return valid;
}

function showFieldError(errId, inputId, msg) {
  $(`#${errId}`).text(msg).addClass('show');
  $(`#${inputId}`).closest('.input-wrap').addClass('error-border');
}

function resetForm() {
  $('#inp-name, #inp-username, #inp-email, #inp-phone, #inp-avatar').val('');
  $('#inp-role').val('');
  $('.field-error').removeClass('show').text('');
  $('.input-wrap').removeClass('error-border');
  $('#submit-feedback').hide().text('').removeClass('success error');
}

function submitForm() {
  if (!validateForm()) return;
  const apiUrl = $('#inp-api-url').val().trim() || 'https://jsonplaceholder.typicode.com/users';

  const payload = {
    name:     $('#inp-name').val().trim(),
    username: $('#inp-username').val().trim(),
    email:    $('#inp-email').val().trim(),
    phone:    $('#inp-phone').val().trim() || 'N/A',
    role:     $('#inp-role').val(),
    avatar:   $('#inp-avatar').val().trim(),
    createdAt: new Date().toISOString(),
  };

  setLoadingState(true);
  logRequest('info', `POST ${apiUrl}`, JSON.stringify({ name: payload.name, email: payload.email, role: payload.role }));

  $.ajax({
    url: apiUrl,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    dataType: 'json',
    timeout: 10000,

    success: function(response) {
      const newMember = {
        ...payload,
        id: response.id || response._id || `local-${Date.now()}`,
      };

      addedMembers.unshift(newMember);
      renderMemberCard(newMember, true);
      updateCount();

      showSubmitFeedback('success', `✅ Thêm thành công! ID: ${newMember.id} — "${newMember.name}" đã được lưu.`);
      logRequest('success', `201 Created`, `ID = ${newMember.id}, name = "${newMember.name}"`);

      resetForm();
    },

    error: function(xhr, status, error) {
      const msg = xhr.responseJSON?.message || error || 'Không thể kết nối server';
      showSubmitFeedback('error', `❌ Lỗi: ${msg}. Kiểm tra lại API URL.`);
      logRequest('error', `${xhr.status || 'ERR'} ${status}`, msg);
    },

    complete: function() {
      setLoadingState(false);
    }
  });
}

function setLoadingState(loading) {
  const $btn = $('#btn-submit');
  if (loading) {
    $btn.prop('disabled', true);
    $btn.find('.btn-text').hide();
    $btn.find('.btn-loader').show();
  } else {
    $btn.prop('disabled', false);
    $btn.find('.btn-text').show();
    $btn.find('.btn-loader').hide();
  }
}

function showSubmitFeedback(type, msg) {
  $('#submit-feedback')
    .show()
    .removeClass('success error')
    .addClass(type)
    .text(msg);
}

function renderMemberCard(member, animate) {
  $('#list-empty').hide();

  const roleInfo = ROLE_CONFIG[member.role] || { label: member.role, cls: 'role-member' };
  const initials = member.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  const avatarHtml = member.avatar
    ? `<img src="${member.avatar}" alt="${member.name}" onerror="this.style.display='none'; this.nextSibling.style.display='flex'" /><span style="display:none">${initials}</span>`
    : initials;

  const card = $(`
    <div class="member-card">
      <div class="member-avatar">${avatarHtml}</div>
      <div class="member-info">
        <div class="member-name">${escHtml(member.name)}</div>
        <div class="member-email">${escHtml(member.email)}</div>
        <div class="member-id">@${escHtml(member.username)} · ID: ${member.id}</div>
      </div>
      <span class="member-role ${roleInfo.cls}">${roleInfo.label}</span>
    </div>
  `);

  $('#added-list').prepend(card);
}

function updateCount() {
  const n = addedMembers.length;
  $('#added-count').text(`${n} thành viên`);
}

function logRequest(type, title, detail) {
  requestCount++;
  const time = new Date().toLocaleTimeString('vi-VN');
  const entry = $(`
    <div class="log-entry log-${type}">
      [${time}] #${requestCount} ${title} — ${detail}
    </div>
  `);

  const $body = $('#log-body');
  $body.find('.log-empty').remove();
  $body.prepend(entry);

  if ($body.children().length > 20) {
    $body.children().last().remove();
  }
}

function clearLog() {
  $('#log-body').html('<div class="log-empty">Chưa có request nào được gửi...</div>');
  requestCount = 0;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

$(document).on('keydown', function(e) {
  if (e.key === 'Enter' && $(e.target).is('input')) {
    submitForm();
  }
});

$('.input-wrap input, .input-wrap select').on('focus', function() {
  $(this).closest('.input-wrap').removeClass('error-border');
});

$(document).ready(function() {
  logRequest('info', 'READY', 'Trang đã tải xong, sẵn sàng nhận dữ liệu');
});
