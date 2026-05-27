$(function () {

  
  function updateStatus1() {
    const visible = $('#gallery').is(':visible');
    const $dot    = $('#status1 .dot');
    const $text   = $('#status1Text');

    if (visible) {
      $dot.attr('class', 'dot dot-green');
      $text.text('Đang hiển thị');
    } else {
      $dot.attr('class', 'dot dot-red');
      $text.text('Đang ẩn');
    }
  }

  $('#btn1Hide').on('click', function () {
    $('#gallery').hide(350);              
    setTimeout(updateStatus1, 360);
  });

  $('#btn1Show').on('click', function () {
    $('#gallery').show(350);
    setTimeout(updateStatus1, 360);
  });

  $('#btn1Toggle').on('click', function () {
    $('#gallery').toggle(350);
    setTimeout(updateStatus1, 360);
  });


  $('.acc-head').on('click', function () {
    const $item = $(this).closest('.acc-item');
    const $body = $item.find('.acc-body');
    const isOpen = $item.hasClass('is-open');

    if (isOpen) {
      $body.slideUp(250);
      $item.removeClass('is-open');
    } else {
      $body.slideDown(250);
      $item.addClass('is-open');
    }
  });

  $('#btnExpandAll').on('click', function () {
    $('.acc-body').slideDown(300);
    $('.acc-item').addClass('is-open');
  });

  $('#btnCollapseAll').on('click', function () {
    $('.acc-body').slideUp(300);
    $('.acc-item').removeClass('is-open');
  });


  let noticeVisible = true;
  function updateNoticeUI() {
    const $dot  = $('#status3 .dot');
    const $text = $('#status3Text');

    if (noticeVisible) {
      $('#noticeToggleIco').text('🙈');
      $('#noticeToggleLabel').text('Ẩn Thông Báo');
      $dot.attr('class', 'dot dot-green');
      $text.text('Đang hiển thị');
      $('#btnNoticeRestore').hide();
    } else {
      $('#noticeToggleIco').text('👁');
      $('#noticeToggleLabel').text('Hiện Thông Báo');
      $dot.attr('class', 'dot dot-red');
      $text.text('Đang ẩn');
    }
  }

  $('#btnNoticeToggle').on('click', function () {
    $('#noticeBox').toggle(300);
    noticeVisible = !noticeVisible;
    updateNoticeUI();
  });

  $('#noticeClose').on('click', function () {
    $('#noticeBox').slideUp(250, function () {
      noticeVisible = false;
      updateNoticeUI();
      $('#btnNoticeRestore').show();       // Hiện nút khôi phục
    });
  });

  $('#btnNoticeRestore').on('click', function () {
    $('#noticeBox').slideDown(300);
    noticeVisible = true;
    updateNoticeUI();
    $('#btnNoticeRestore').hide();
  });

  updateStatus1();
  updateNoticeUI();

});