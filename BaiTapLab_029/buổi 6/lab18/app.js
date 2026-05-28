$(function () {

  let members = [
    { id: 1, name: 'Trần Minh Khoa',  email: 'khoa@example.com',  role: 'Quản trị viên' },
    { id: 2, name: 'Lê Thị Thu Hà',   email: 'ha@example.com',    role: 'Trưởng nhóm'   },
    { id: 3, name: 'Phạm Văn Bình',   email: 'binh@example.com',  role: 'Thành viên'    },
  ];
  let nextId  = 4;
  let editId  = null; 

  const avatarColors = ['#3b82f6','#8b5cf6','#ec4899','#10b981','#f59e0b','#ef4444','#06b6d4'];
  function avatarColor(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return avatarColors[Math.abs(h) % avatarColors.length];
  }

  function initials(name) {
    return name.trim().split(/\s+/).slice(-2).map(w => w[0]).join('').toUpperCase();
  }

  function roleClass(role) {
    if (role === 'Quản trị viên') return 'role-admin';
    if (role === 'Trưởng nhóm')   return 'role-leader';
    return 'role-member';
  }

  let toastTimer;
  function showToast(msg, type = 'success') {
    clearTimeout(toastTimer);
    $('#toast').attr('class', 'toast ' + type).text(msg).fadeIn(200);
    toastTimer = setTimeout(() => $('#toast').fadeOut(300), 2800);
  }

  function validateForm() {
    let ok = true;
    const name  = $('#inputName').val().trim();
    const email = $('#inputEmail').val().trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    $('#errName').text('');
    $('#errEmail').text('');

    if (!name) { $('#errName').text('Vui lòng nhập họ và tên.'); ok = false; }
    if (!email) { $('#errEmail').text('Vui lòng nhập email.'); ok = false; }
    else if (!emailRx.test(email)) { $('#errEmail').text('Email không đúng định dạng.'); ok = false; }
    else if (members.some(m => m.email === email && m.id !== editId)) {
      $('#errEmail').text('Email này đã được sử dụng.'); ok = false;
    }
    return ok;
  }

  function render() {
    const search     = $('#searchInput').val().trim().toLowerCase();
    const filterRole = $('#filterRole').val();

    const filtered = members.filter(m => {
      const matchText = !search || m.name.toLowerCase().includes(search) || m.email.toLowerCase().includes(search);
      const matchRole = !filterRole || m.role === filterRole;
      return matchText && matchRole;
    });

    if (filtered.length === 0) {
      $('#memberList').empty();
      $('#emptyState').show();
    } else {
      $('#emptyState').hide();
      const html = filtered.map((m, idx) => `
        <div class="member-card" data-id="${m.id}">
          <span class="member-num">#${idx + 1}</span>
          <div class="member-avatar" style="background:${avatarColor(m.name)}">
            ${initials(m.name)}
          </div>
          <div class="member-info">
            <div class="member-name">${m.name}</div>
            <div class="member-email">${m.email}</div>
          </div>
          <span class="role-badge ${roleClass(m.role)}">${m.role}</span>
          <div class="member-actions">
            <button class="act-btn act-edit"   data-id="${m.id}">✏ Sửa</button>
            <button class="act-btn act-delete" data-id="${m.id}">✕ Xoá</button>
          </div>
        </div>
      `).join('');
      $('#memberList').html(html);
    }

    $('#statTotal').text(members.length);
    $('#statAdmin').text(members.filter(m => m.role === 'Quản trị viên').length);
    $('#statLeader').text(members.filter(m => m.role === 'Trưởng nhóm').length);
  }

  function resetForm() {
    editId = null;
    $('#inputName').val('');
    $('#inputEmail').val('');
    $('#inputRole').val('Thành viên');
    $('#errName').text('');
    $('#errEmail').text('');
    $('#formTitle').text('Thêm Thành Viên');
    $('#saveBtnText').text('＋ Thêm mới');
    $('#btnCancel').hide();
  }

  $('#btnSave').on('click', function () {
    if (!validateForm()) return;

    const name  = $('#inputName').val().trim();
    const email = $('#inputEmail').val().trim();
    const role  = $('#inputRole').val();

    if (editId === null) {
      members.push({ id: nextId++, name, email, role });
      showToast('✅ Đã thêm thành viên mới!');
    } else {
      const idx = members.findIndex(m => m.id === editId);
      members[idx] = { id: editId, name, email, role };
      showToast('✏ Đã cập nhật thông tin!');
    }

    resetForm();
    render();
  });

  $('#btnCancel').on('click', resetForm);

  $('#memberList').on('click', '.act-edit', function () {
    const id = +$(this).data('id');
    const m  = members.find(x => x.id === id);
    if (!m) return;

    editId = id;
    $('#inputName').val(m.name);
    $('#inputEmail').val(m.email);
    $('#inputRole').val(m.role);
    $('#formTitle').text('Chỉnh Sửa Thành Viên');
    $('#saveBtnText').text('💾 Lưu thay đổi');
    $('#btnCancel').show();

    $('html, body').animate({ scrollTop: 0 }, 300);
  });

  $('#memberList').on('click', '.act-delete', function () {
    const id = +$(this).data('id');
    const m  = members.find(x => x.id === id);
    if (!m) return;

    if (!confirm(`Bạn có chắc muốn xoá "${m.name}"?`)) return;

    members = members.filter(x => x.id !== id);
    if (editId === id) resetForm();

    $(this).closest('.member-card').slideUp(200, function () {
      render();
    });
    showToast('🗑 Đã xoá thành viên.', 'danger');
  });

  $('#searchInput, #filterRole').on('input change', function () {
    render();
  });

  render();

});
