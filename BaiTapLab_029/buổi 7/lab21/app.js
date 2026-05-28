
const DEFAULT_API = 'https://69e9870755d62f34797a990d.mockapi.io/api/v1/sinh_vien';

function getApiUrl() {
  return $('#api-url').val().trim() || DEFAULT_API;
}

let localStudents = [];   
let allStudents   = [];   
let deleteTargetId = null;

const STATUS_MAP = {
  active:    { label: '🟢 Đang học',   cls: 'status-active' },
  leave:     { label: '🟡 Bảo lưu',    cls: 'status-leave' },
  graduated: { label: '🎓 Tốt nghiệp', cls: 'status-graduated' },
};

const MAJOR_MAP = {
  CNTT: '💻 CNTT',
  KTPM: '⚙️ KTPM',
  HTTT: '🗄️ HTTT',
  MMT:  '🌐 MMT',
  KHMT: '🔬 KHMT',
};

function mapToStudent(raw) {
  return {
    id:     raw.id,
    name:   raw.ho_ten || raw.name || raw.fullName || 'Chưa có tên',
    mssv:   raw.ma_sinh_vien || raw.mssv || raw.username || `SV${String(raw.id).padStart(3,'0')}`,
    email:  raw.email || '',
    major:  raw.khoa  || raw.major || ['CNTT','KTPM','HTTT','MMT','KHMT'][raw.id % 5] || 'CNTT',
    year:   Number(raw.namhoc || raw.year || (raw.id % 4 + 1)),
    gpa:    raw.diemgpa != null ? Number(raw.diemgpa) : (raw.gpa != null ? Number(raw.gpa) : null),
    status: raw.trangthai || raw.status || 'active',
  };
}

function loadStudents() {
  showLoading(true);
  $('#btn-reload').addClass('spinning');

  $.ajax({
    url: getApiUrl(),
    method: 'GET',
    dataType: 'json',
    timeout: 12000,

    success: function(data) {
      const arr = Array.isArray(data) ? data : [data];
      allStudents = arr.map(mapToStudent);
      filterLocal();
      updateStats();
      showToast('success', `✅ Đã tải ${allStudents.length} sinh viên`);
    },

    error: function(xhr, status) {
      showLoading(false);
      showError(true, `Lỗi ${xhr.status || status}: Không tải được dữ liệu`);
    },

    complete: function() {
      $('#btn-reload').removeClass('spinning');
      showLoading(false);
    }
  });
}
function filterLocal() {
  const q       = $('#search-input').val().toLowerCase().trim();
  const major   = $('#filter-major').val();
  const status  = $('#filter-status').val();
  const sortBy  = $('#sort-by').val();

  $('#btn-clear-search').toggle(!!q);

  let list = allStudents.filter(s => {
    const matchQ      = !q || s.name.toLowerCase().includes(q) || s.mssv.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchMajor  = !major  || s.major  === major;
    const matchStatus = !status || s.status === status;
    return matchQ && matchMajor && matchStatus;
  });

  switch (sortBy) {
    case 'name':     list.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'gpa-desc': list.sort((a, b) => (b.gpa || 0) - (a.gpa || 0)); break;
    case 'newest':   list.reverse(); break;
  }

  localStudents = list;
  renderTable(list);
}

function clearSearch() {
  $('#search-input').val('');
  filterLocal();
}

function renderTable(list) {
  const tbody = $('#table-body');
  tbody.empty();

  if (list.length === 0) {
    $('#table-wrap').hide();
    $('#empty-state').show();
    return;
  }

  $('#empty-state').hide();
  $('#table-wrap').show();
  $('#stats-bar').show();

  list.forEach((s, idx) => {
    const initials = s.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
    const statusInfo = STATUS_MAP[s.status] || STATUS_MAP.active;
    const gpaHtml = getGpaBadge(s.gpa);

    const tr = $(`
      <tr data-id="${s.id}">
        <td><span style="color:var(--muted);font-weight:600">${idx + 1}</span></td>
        <td>
          <div class="cell-avatar">
            <div class="avatar-circle">${initials}</div>
            <div>
              <div class="cell-name">${escHtml(s.name)}</div>
              <div class="cell-email">${escHtml(s.email)}</div>
            </div>
          </div>
        </td>
        <td><code style="background:var(--surface-2);padding:3px 8px;border-radius:6px;font-size:12px">${escHtml(s.mssv)}</code></td>
        <td>${MAJOR_MAP[s.major] || s.major || '—'}</td>
        <td>Năm ${s.year || '—'}</td>
        <td>${gpaHtml}</td>
        <td><span class="status-badge ${statusInfo.cls}">${statusInfo.label}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-edit" onclick="openEditForm(${s.id})">✏️ Sửa</button>
            <button class="btn-delete" onclick="openDeleteModal(${s.id}, '${escHtml(s.name)}')">🗑️</button>
          </div>
        </td>
      </tr>
    `);

    tbody.append(tr);
  });
}

function getGpaBadge(gpa) {
  if (gpa == null || gpa === '') return `<span class="gpa-badge gpa-none">—</span>`;
  const n = Number(gpa);
  const cls = n >= 3.2 ? 'gpa-high' : n >= 2.5 ? 'gpa-mid' : 'gpa-low';
  return `<span class="gpa-badge ${cls}">${n.toFixed(2)}</span>`;
}

function updateStats() {
  const total  = allStudents.length;
  const active = allStudents.filter(s => s.status === 'active').length;
  const gpas   = allStudents.map(s => s.gpa).filter(g => g != null && !isNaN(g));
  const avgGpa = gpas.length ? (gpas.reduce((a,b) => a+b, 0) / gpas.length).toFixed(2) : '—';
  $('#s-total').text(total);
  $('#s-active').text(active);
  $('#s-avg-gpa').text(avgGpa);
  $('#stats-bar').show();
}
function openAddForm() {
  clearFormFields();
  $('#edit-id').val('');
  $('#form-title').text('➕ Thêm sinh viên');
  openSidebar();
}


function openEditForm(id) {
  const s = allStudents.find(x => x.id == id);
  if (!s) return;

  clearFormFields();
  $('#edit-id').val(s.id);
  $('#f-name').val(s.name);
  $('#f-mssv').val(s.mssv);
  $('#f-email').val(s.email);
  $('#f-major').val(s.major);
  $('#f-year').val(s.year || 3);
  $('#f-gpa').val(s.gpa != null ? s.gpa : '');
  $(`input[name="f-status"][value="${s.status}"]`).prop('checked', true);
  $('#form-title').text('✏️ Sửa thông tin sinh viên');
  openSidebar();
}

function openSidebar()  { $('#sidebar').addClass('open'); $('body').css('overflow','hidden'); }
function closeSidebar() { $('#sidebar').removeClass('open'); $('body').css('overflow',''); clearFormErrors(); }


function saveStudent() {
  if (!validateSidebarForm()) return;

  const id     = $('#edit-id').val();
  const isEdit = !!id;
  const apiUrl = getApiUrl();

  const payload = {
    ho_ten:       $('#f-name').val().trim(),
    ma_sinh_vien: $('#f-mssv').val().trim(),
    email:        $('#f-email').val().trim(),
    khoa:         $('#f-major').val(),
    namhoc:       parseInt($('#f-year').val()),
    diemgpa:      $('#f-gpa').val() !== '' ? parseFloat($('#f-gpa').val()) : null,
    trangthai:    $('input[name="f-status"]:checked').val(),
    updatedAt:    new Date().toISOString(),
  };

  setSaveLoading(true);

  if (isEdit) {
    
    $.ajax({
      url: `${apiUrl}/${id}`,
      method: 'PUT',            
      contentType: 'application/json',
      data: JSON.stringify(payload),
      dataType: 'json',
      timeout: 10000,

      success: function(response) {
        const updated = mapToStudent({ ...payload, id: id });
        const idx = allStudents.findIndex(s => s.id == id);
        if (idx > -1) allStudents[idx] = updated;
        filterLocal();
        updateStats();
        closeSidebar();
        showToast('success', `✅ Đã cập nhật thông tin "${updated.name}"`);
        highlightRow(id);
      },

      error: function(xhr) {
        
        
        const updated = mapToStudent({ ...payload, id: id });
        const idx = allStudents.findIndex(s => s.id == id);
        if (idx > -1) allStudents[idx] = updated;
        filterLocal();
        updateStats();
        closeSidebar();
        showToast('info', `ℹ️ Cập nhật cục bộ (API demo không lưu thật)`);
      },

      complete: () => setSaveLoading(false)
    });

  } else {
    
    $.ajax({
      url: apiUrl,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ ...payload, createdAt: new Date().toISOString() }),
      dataType: 'json',
      timeout: 10000,

      success: function(response) {
        const newStudent = mapToStudent({ ...payload, id: response.id || response._id || Date.now() });
        allStudents.unshift(newStudent);
        filterLocal();
        updateStats();
        closeSidebar();
        showToast('success', `✅ Đã thêm sinh viên "${newStudent.name}"`);
      },

      error: function() {
        
        const newStudent = mapToStudent({ ...payload, id: Date.now() });
        allStudents.unshift(newStudent);
        filterLocal();
        updateStats();
        closeSidebar();
        showToast('info', `ℹ️ Thêm cục bộ (API demo không lưu thật)`);
      },

      complete: () => setSaveLoading(false)
    });
  }
}


function openDeleteModal(id, name) {
  deleteTargetId = id;
  $('#delete-name').text(name);
  $('#delete-modal').show();
}

function closeDeleteModal() {
  deleteTargetId = null;
  $('#delete-modal').hide();
}


function confirmDelete() {
  if (deleteTargetId == null) return;

  const id = deleteTargetId;
  const apiUrl = getApiUrl();
  const student = allStudents.find(s => s.id == id);

  $('#btn-confirm-delete').prop('disabled', true).text('Đang xóa...');

  $.ajax({
    url: `${apiUrl}/${id}`,
    method: 'DELETE',
    timeout: 10000,

    success: function() {
      removeStudentLocal(id);
      showToast('success', `🗑️ Đã xóa sinh viên "${student?.name || id}"`);
    },

    error: function() {
      
      removeStudentLocal(id);
      showToast('info', `ℹ️ Xóa cục bộ (API demo không lưu thật)`);
    },

    complete: function() {
      $('#btn-confirm-delete').prop('disabled', false).text('Xóa');
      closeDeleteModal();
    }
  });
}

function removeStudentLocal(id) {
  allStudents = allStudents.filter(s => s.id != id);
  filterLocal();
  updateStats();
}


function validateSidebarForm() {
  let valid = true;
  clearFormErrors();

  const name  = $('#f-name').val().trim();
  const mssv  = $('#f-mssv').val().trim();
  const email = $('#f-email').val().trim();

  if (!name) {
    showSidebarError('err-f-name', 'f-name', '⚠ Vui lòng nhập họ tên');
    valid = false;
  }
  if (!mssv) {
    showSidebarError('err-f-mssv', 'f-mssv', '⚠ Vui lòng nhập MSSV');
    valid = false;
  }
  if (!email) {
    showSidebarError('err-f-email', 'f-email', '⚠ Vui lòng nhập email');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showSidebarError('err-f-email', 'f-email', '⚠ Email không hợp lệ');
    valid = false;
  }

  const gpaVal = $('#f-gpa').val();
  if (gpaVal !== '' && (isNaN(gpaVal) || +gpaVal < 0 || +gpaVal > 4)) {
    
    $('#f-gpa').addClass('error');
    valid = false;
  }

  return valid;
}

function showSidebarError(errId, inputId, msg) {
  $(`#${errId}`).text(msg);
  $(`#${inputId}`).addClass('error');
}

function clearFormErrors() {
  $('.field-err').text('');
  $('.f-input').removeClass('error');
}

function clearFormFields() {
  $('#f-name, #f-mssv, #f-email, #f-gpa').val('');
  $('#f-major').val('');
  $('#f-year').val('3');
  $('#f-avatar').val('');
  $('input[name="f-status"][value="active"]').prop('checked', true);
  clearFormErrors();
}


function setSaveLoading(on) {
  const $btn = $('#btn-save');
  if (on) {
    $btn.prop('disabled', true);
    $btn.find('.save-text').hide();
    $btn.find('.save-loader').show();
  } else {
    $btn.prop('disabled', false);
    $btn.find('.save-text').show();
    $btn.find('.save-loader').hide();
  }
}


function highlightRow(id) {
  const row = $(`tr[data-id="${id}"]`);
  row.css({ background: 'rgba(79,70,229,0.08)' });
  setTimeout(() => row.css({ background: '' }), 1500);
}


function showLoading(on) {
  if (on) {
    $('#loading-state').show();
    $('#table-wrap').hide();
    $('#empty-state').hide();
    $('#error-state').hide();
  } else {
    $('#loading-state').hide();
  }
}

function showError(on, msg) {
  if (on) {
    $('#error-state').show();
    $('#error-msg-text').text(msg || 'Đã xảy ra lỗi');
    $('#table-wrap').hide();
    $('#empty-state').hide();
  } else {
    $('#error-state').hide();
  }
}


function showToast(type, msg) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = $(`<div class="toast ${type}">${icons[type]} ${msg}</div>`);
  $('#toast-container').append(toast);
  setTimeout(() => toast.remove(), 3500);
}


function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

$(document).on('click', '#delete-modal', function(e) {
  if ($(e.target).is('#delete-modal')) closeDeleteModal();
});

$(document).on('keydown', function(e) {
  if (e.key === 'Escape') {
    closeSidebar();
    closeDeleteModal();
  }
});

$(document).ready(function() {
  loadStudents();
});
