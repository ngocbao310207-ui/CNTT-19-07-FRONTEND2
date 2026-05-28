$(document).ready(function() {
    function setStatus(text) {
        $('#statusText').hide().text(text).fadeIn(200);
    }

    $('#btnFadeOut').click(function() {
        setStatus('Đang chạy: Fade Out...');
        $('#contentBox').stop(true, true).fadeOut(600, function() {
            setStatus('Hoàn tất: Fade Out');
        });
    });

    $('#btnFadeIn').click(function() {
        setStatus('Đang chạy: Fade In...');
        $('#contentBox').stop(true, true).fadeIn(600, function() {
            setStatus('Hoàn tất: Fade In');
        });
    });

    $('#btnSlideUp').click(function() {
        setStatus('Đang chạy: Slide Up...');
        $('#contentBox').stop(true, true).slideUp(600, function() {
            setStatus('Hoàn tất: Slide Up');
        });
    });

    $('#btnSlideDown').click(function() {
        setStatus('Đang chạy: Slide Down...');
        $('#contentBox').stop(true, true).slideDown(600, function() {
            setStatus('Hoàn tất: Slide Down');
        });
    });

    $('#btnSlideToggle').click(function() {
        setStatus('Đang chạy: Slide Toggle...');
        $('#contentBox').stop(true, true).slideToggle(600, function() {
            setStatus('Hoàn tất: Slide Toggle');
        });
    });

    $('#btnCustom').click(function() {
        setStatus('Đang chạy: Custom Animate...');
        $('#contentBox').stop(true, true).animate({
            opacity: 0.3,
            marginTop: "50px",
            width: "80%"
        }, 800, function() {
            setStatus('Hoàn tất: Custom Animate');
        });
    });

    $('#btnChain').click(function() {
        setStatus('Đang chạy: Chaining Effects...');
        $('#contentBox')
            .stop(true, true)
            .removeClass('highlight-active')
            .slideUp(400)
            .slideDown(400)
            .fadeOut(400)
            .fadeIn(400, function() {
                $(this).addClass('highlight-active');
                setStatus('Hoàn tất: Chaining + Highlight');
            });
    });

    $('#btnReset').click(function() {
        setStatus('Đã Reset giao diện');
        $('#contentBox')
            .stop(true, true)
            .show()
            .css({ opacity: 1, marginTop: "0px", width: "100%" })
            .removeClass('highlight-active');
    });
});