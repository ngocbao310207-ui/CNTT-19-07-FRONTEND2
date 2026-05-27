const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom');
revealElements.forEach(element => {
    revealObserver.observe(element);
});

const regForm = document.getElementById('registrationForm');
const inputName = document.getElementById('fullName');
const inputEmail = document.getElementById('email');
const selectCourse = document.getElementById('course');

regForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let isValid = true;
    
    inputName.classList.remove('is-invalid');
    inputEmail.classList.remove('is-invalid');
    selectCourse.classList.remove('is-invalid');

    if (inputName.value.trim() === '') {
        inputName.classList.add('is-invalid');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail.value.trim())) {
        inputEmail.classList.add('is-invalid');
        isValid = false;
    }

    if (selectCourse.value === '') {
        selectCourse.classList.add('is-invalid');
        isValid = false;
    }

    if (isValid) {
        const originalText = regForm.querySelector('button').innerText;
        const btn = regForm.querySelector('button');
        
        btn.innerText = "Đang xử lý...";
        btn.style.opacity = 0.8;
        
        setTimeout(() => {
            alert('Cảm ơn bạn! Thông tin đăng ký đã được ghi nhận.');
            regForm.reset();
            btn.innerText = originalText;
            btn.style.opacity = 1;
            
            inputName.classList.remove('is-valid', 'is-invalid');
            inputEmail.classList.remove('is-valid', 'is-invalid');
            selectCourse.classList.remove('is-valid', 'is-invalid');
        }, 800);
    }
});

const inputs = [inputName, inputEmail, selectCourse];
inputs.forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('is-invalid');
    });
});