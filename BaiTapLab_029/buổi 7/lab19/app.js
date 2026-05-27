$(function () {

const API_URL = 'https://6a15be9d91ff9a63de08b758.mockapi.io/api/v1/users';
  let allUsers  = []; 

  function showLoading() {
    $('#loadingState').show();
    $('#errorState, #tableWrap, #emptyState').hide();
  }

  function showError(msg) {
    $('#loadingState, #tableWrap, #emptyState').hide();
    $('#errorState').show();
    $('#errorMsg').text(msg || 'Đã xảy ra lỗi không xác định.');
  }

  function showTable() {
    $('#loadingState, #errorState, #emptyState').hide();
    $('#tableWrap').show();
  }

  function showEmpty() {
    $('#loadingState, #errorState, #tableWrap').hide();
    $('#emptyState').show();
  }

  function renderTable(users) {
    $('#countShow').text(users.length);

    if (users.length === 0) {
      showEmpty();
      return;
    }

    const rows = users.map((u, i) => `
      <tr>
        <td><div class="row-num">${i + 1}</div></td>
        <td class="td-name">${u.name}</td>
        <td class="td-user">@${u.username}</td>
        <td class="td-email"><a href="mailto:${u.email}">${u.email}</a></td>
        <td>${u.phone}</td>
        <td class="td-web"><a href="http://${u.website}" target="_blank">${u.website}</a></td>
        <td class="td-company">${u.company}</td>
      </tr>
    `).join('');

    $('#tableBody').html(rows);
    showTable();
  }

  function fetchUsers() {
    showLoading();
    $('#btnReload').addClass('loading');

    $.ajax({
      url:      API_URL,
      method:   'GET',
      dataType: 'json',
      timeout:  10000, 

      success: function (data) {
        allUsers = data;
        $('#countTotal').text(allUsers.length);
        renderTable(allUsers);
      },

      error: function (xhr, status, err) {
        let msg = 'Không thể kết nối đến server.';
        if (status === 'timeout') msg = 'Yêu cầu quá thời gian chờ (timeout).';
        else if (xhr.status === 404) msg = 'API endpoint không tồn tại (404).';
        else if (xhr.status >= 500) msg = 'Lỗi phía server (' + xhr.status + ').';
        showError(msg);
      },

      complete: function () {
        $('#btnReload').removeClass('loading');
      }
    });
  }

  $('#searchInput').on('input', function () {
    const q = $(this).val().trim().toLowerCase();
    if (!q) {
      renderTable(allUsers);
      return;
    }
    const filtered = allUsers.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.company.name.toLowerCase().includes(q)
    );
    renderTable(filtered);
  });


  $('#btnReload, #btnRetry').on('click', function () {
    $('#searchInput').val('');
    fetchUsers();
  });
  fetchUsers();

});
