const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

const savedEmail = localStorage.getItem('user_saved_email');
if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMeCheckbox.checked = true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function clearErrors() {
    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
    emailError.textContent = '';
    passwordError.textContent = '';
}

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();

    let isValid = true;
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    if (emailValue === '') {
        emailError.textContent = 'Vui lòng nhập địa chỉ email';
        emailInput.classList.add('input-error');
        isValid = false;
    } else if (!validateEmail(emailValue)) {
        emailError.textContent = 'Email không đúng định dạng';
        emailInput.classList.add('input-error');
        isValid = false;
    }

    if (passwordValue === '') {
        passwordError.textContent = 'Vui lòng nhập mật khẩu';
        passwordInput.classList.add('input-error');
        isValid = false;
    } else if (passwordValue.length < 6) {
        passwordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
        passwordInput.classList.add('input-error');
        isValid = false;
    }

    if (isValid) {
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('user_saved_email', emailValue);
        } else {
            localStorage.removeItem('user_saved_email');
        }

        alert('Đăng nhập thành công vào hệ thống!');
        loginForm.reset();
        
        if (rememberMeCheckbox.checked) {
            emailInput.value = emailValue;
            rememberMeCheckbox.checked = true;
        }
    }
});

emailInput.addEventListener('input', function() {
    emailError.textContent = '';
    this.classList.remove('input-error');
});

passwordInput.addEventListener('input', function() {
    passwordError.textContent = '';
    this.classList.remove('input-error');
});