let allData = [];
let targetDeleteId = null;

const MAP_MAJOR = {
  CNTT: '💻 CNTT',
  KTPM: '⚙️ KTPM',
  HTTT: '🗄️ HTTT',
  MMT: '🌐 MMT',
  KHMT: '🔬 KHMT'
};

const MAP_STATUS = {
  active: { label: 'Đang học', class: 'badge-active' },
  leave: { label: 'Bảo lưu', class: 'badge-leave' },
  graduated: { label: 'Tốt nghiệp', class: 'badge-graduated' }
};

document.addEventListener('DOMContentLoaded', () => {
  loadStudents();
});

function getApiUrl() {
  const customUrl = document.getElementById('api-url').value.trim();
  return customUrl || 'https://jsonplaceholder.typicode.com/users';
}

function normalizeData(raw) {
  return {
    id: raw.id,
    name: raw.ho_ten || raw.name || raw.fullName || 'Chưa cập nhật',
    mssv: raw.ma_sinh_vien || raw.mssv || raw.username || `SV${raw.id}`,
    email: raw.email || '',
    phone: raw.phone || raw.so_dien_thoai || '',
    major: raw.khoa || raw.major || ['CNTT','KTPM','HTTT','MMT','KHMT'][raw.id % 5] || 'CNTT',
    year: raw.namhoc || raw.year || (raw.id % 4 + 1),
    gpa: raw.diemgpa != null ? Number(raw.diemgpa) : (raw.gpa != null ? Number(raw.gpa) : null),
    status: raw.trangthai || raw.status || 'active'
  };
}

async function loadStudents() {
  const btn = document.querySelector('.btn-reload');
  btn.classList.add('spinning');
  
  toggleState('loading');

  try {
    const res = await fetch(getApiUrl());
    if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
    
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [data];
    allData = arr.map(normalizeData);
    
    applyFilter();
    updateStats();
    showToast('Tải dữ liệu thành công', 'success');
  } catch (err) {
    document.getElementById('err-detail').textContent = err.message;
    toggleState('error');
    showToast('Lỗi tải dữ liệu', 'error');
  } finally {
    btn.classList.remove('spinning');
  }
}

function renderTable(list) {
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';

  if (list.length === 0) {
    toggleState('empty');
    return;
  }

  toggleState('table');

  list.forEach((item, index) => {
    const initials = item.name.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase();
    const majorText = MAP_MAJOR[item.major] || item.major || '—';
    const statusObj = MAP_STATUS[item.status] || MAP_STATUS.active;
    
    let gpaBadge = '<span class="badge badge-gpa">—</span>';
    if (item.gpa !== null && !isNaN(item.gpa)) {
      const g = Number(item.gpa);
      const c = g >= 3.2 ? 'gpa-high' : g >= 2.5 ? 'gpa-mid' : 'gpa-low';
      gpaBadge = `<span class="badge badge-gpa ${c}">${g.toFixed(2)}</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <div class="user-cell">
          <div class="avatar">${initials}</div>
          <div class="user-info">
            <span class="user-name">${escapeHTML(item.name)}</span>
            <span class="user-email">${escapeHTML(item.email)}</span>
          </div>
        </div>
      </td>
      <td><span class="code-txt">${escapeHTML(item.mssv)}</span></td>
      <td>${majorText}</td>
      <td>Năm ${item.year}</td>
      <td>${gpaBadge}</td>
      <td><span class="badge ${statusObj.class}">${statusObj.label}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" onclick="openEdit('${item.id}')">✏️ Sửa</button>
          <button class="btn-del-icon" onclick="openDelModal('${item.id}', '${escapeHTML(item.name)}')">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function applyFilter() {
  const q = document.getElementById('q').value.toLowerCase().trim();
  const major = document.getElementById('sel-major').value;
  const status = document.getElementById('sel-status').value;
  const sort = document.getElementById('sel-sort').value;

  document.getElementById('btn-clear-q').style.display = q ? 'block' : 'none';

  let filtered = allData.filter(s => {
    const mQ = !q || s.name.toLowerCase().includes(q) || s.mssv.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const mMajor = !major || s.major === major;
    const mStatus = !status || s.status === status;
    return mQ && mMajor && mStatus;
  });

  if (sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'gpa') {
    filtered.sort((a, b) => (b.gpa || 0) - (a.gpa || 0));
  }

  renderTable(filtered);
}

function clearQ() {
  document.getElementById('q').value = '';
  applyFilter();
}

function updateStats() {
  document.getElementById('stats-row').style.display = 'flex';
  document.getElementById('st-total').textContent = allData.length;
  
  const activeCount = allData.filter(s => s.status === 'active').length;
  document.getElementById('st-active').textContent = activeCount;

  const validGpas = allData.map(s => s.gpa).filter(g => g !== null && !isNaN(g));
  if (validGpas.length > 0) {
    const avg = validGpas.reduce((a, b) => a + b, 0) / validGpas.length;
    document.getElementById('st-gpa').textContent = avg.toFixed(2);
  } else {
    document.getElementById('st-gpa').textContent = '—';
  }
}

function toggleState(state) {
  document.getElementById('state-loading').style.display = 'none';
  document.getElementById('state-error').style.display = 'none';
  document.getElementById('state-empty').style.display = 'none';
  document.getElementById('table-card').style.display = 'none';

  if (state === 'loading') document.getElementById('state-loading').style.display = 'flex';
  if (state === 'error') document.getElementById('state-error').style.display = 'flex';
  if (state === 'empty') document.getElementById('state-empty').style.display = 'flex';
  if (state === 'table') document.getElementById('table-card').style.display = 'block';
}

function openAdd() {
  clearForm();
  document.getElementById('edit-id').value = '';
  document.getElementById('form-title').textContent = 'Thêm sinh viên';
  document.getElementById('sidebar-icon').textContent = '➕';
  document.getElementById('sidebar').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openEdit(id) {
  const item = allData.find(x => x.id == id);
  if (!item) return;

  clearForm();
  document.getElementById('edit-id').value = item.id;
  document.getElementById('form-title').textContent = 'Sửa sinh viên';
  document.getElementById('sidebar-icon').textContent = '✏️';
  
  document.getElementById('f-name').value = item.name;
  document.getElementById('f-mssv').value = item.mssv;
  document.getElementById('f-email').value = item.email;
  document.getElementById('f-phone').value = item.phone;
  document.getElementById('f-year').value = item.year;
  document.getElementById('f-major').value = item.major;
  document.getElementById('f-gpa').value = item.gpa != null ? item.gpa : '';
  
  const radio = document.querySelector(`input[name="f-status"][value="${item.status}"]`);
  if (radio) radio.checked = true;

  document.getElementById('sidebar').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('active');
  document.body.style.overflow = '';
  clearFormErrs();
}

function clearForm() {
  document.getElementById('f-name').value = '';
  document.getElementById('f-mssv').value = '';
  document.getElementById('f-email').value = '';
  document.getElementById('f-phone').value = '';
  document.getElementById('f-year').value = '3';
  document.getElementById('f-major').value = '';
  document.getElementById('f-gpa').value = '';
  document.querySelector('input[name="f-status"][value="active"]').checked = true;
  clearFormErrs();
}

function clearFormErrs() {
  document.querySelectorAll('.f-err').forEach(e => e.textContent = '');
  document.querySelectorAll('.inp-wrap input').forEach(e => e.classList.remove('error'));
}

async function saveStudent() {
  clearFormErrs();
  let isValid = true;

  const id = document.getElementById('edit-id').value;
  const name = document.getElementById('f-name').value.trim();
  const mssv = document.getElementById('f-mssv').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const year = document.getElementById('f-year').value;
  const major = document.getElementById('f-major').value;
  const gpaStr = document.getElementById('f-gpa').value;
  const status = document.querySelector('input[name="f-status"]:checked').value;

  if (!name) { document.getElementById('err-name').textContent = 'Vui lòng nhập họ tên'; document.getElementById('f-name').classList.add('error'); isValid = false; }
  if (!mssv) { document.getElementById('err-mssv').textContent = 'Vui lòng nhập MSSV'; document.getElementById('f-mssv').classList.add('error'); isValid = false; }
  if (!email) { 
    document.getElementById('err-email').textContent = 'Vui lòng nhập email'; 
    document.getElementById('f-email').classList.add('error'); 
    isValid = false; 
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('err-email').textContent = 'Email không hợp lệ'; 
    document.getElementById('f-email').classList.add('error'); 
    isValid = false;
  }

  if (gpaStr !== '' && (isNaN(gpaStr) || Number(gpaStr) < 0 || Number(gpaStr) > 4)) {
    document.getElementById('f-gpa').classList.add('error');
    isValid = false;
  }

  if (!isValid) return;

  const payload = {
    ho_ten: name,
    ma_sinh_vien: mssv,
    email: email,
    so_dien_thoai: phone,
    namhoc: year,
    khoa: major,
    diemgpa: gpaStr,
    trangthai: status
  };

  const btn = document.getElementById('btn-save');
  btn.disabled = true;
  btn.querySelector('.save-label').style.display = 'none';
  btn.querySelector('.save-loader').style.display = 'inline-block';

  const isEdit = !!id;
  const method = isEdit ? 'PUT' : 'POST';
  const url = isEdit ? `${getApiUrl()}/${id}` : getApiUrl();

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('API Error');
    
    const responseData = await res.json();
    const finalItem = normalizeData({ ...payload, id: responseData.id || id || Date.now() });

    if (isEdit) {
      const idx = allData.findIndex(x => x.id == id);
      if (idx > -1) allData[idx] = finalItem;
      showToast('Đã cập nhật sinh viên', 'success');
    } else {
      allData.unshift(finalItem);
      showToast('Đã thêm sinh viên', 'success');
    }

    applyFilter();
    updateStats();
    closeSidebar();
  } catch (err) {
    const fallbackItem = normalizeData({ ...payload, id: id || Date.now() });
    if (isEdit) {
      const idx = allData.findIndex(x => x.id == id);
      if (idx > -1) allData[idx] = fallbackItem;
    } else {
      allData.unshift(fallbackItem);
    }
    applyFilter();
    updateStats();
    closeSidebar();
    showToast('Lưu cục bộ (API demo)', 'info');
  } finally {
    btn.disabled = false;
    btn.querySelector('.save-label').style.display = 'inline';
    btn.querySelector('.save-loader').style.display = 'none';
  }
}

function openDelModal(id, name) {
  targetDeleteId = id;
  document.getElementById('del-name').textContent = name;
  document.getElementById('del-modal').style.display = 'flex';
}

function closeDelModal() {
  targetDeleteId = null;
  document.getElementById('del-modal').style.display = 'none';
}

async function confirmDelete() {
  if (!targetDeleteId) return;

  const btn = document.getElementById('btn-confirm-del');
  btn.disabled = true;
  btn.textContent = 'Đang xóa...';

  try {
    const res = await fetch(`${getApiUrl()}/${targetDeleteId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('API Error');
    
    allData = allData.filter(x => x.id != targetDeleteId);
    showToast('Đã xóa sinh viên', 'success');
  } catch (err) {
    allData = allData.filter(x => x.id != targetDeleteId);
    showToast('Xóa cục bộ (API demo)', 'info');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Xóa ngay';
    applyFilter();
    updateStats();
    closeDelModal();
  }
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toasts');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}