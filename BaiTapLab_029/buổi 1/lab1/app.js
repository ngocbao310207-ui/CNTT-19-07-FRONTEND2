document.addEventListener('DOMContentLoaded', () => {
    const bmiForm = document.getElementById('bmiForm');
    const resultArea = document.getElementById('resultArea');
    const bmiValueEl = document.getElementById('bmiValue');
    const bmiCategoryEl = document.getElementById('bmiCategory');
    const bmiMessageEl = document.getElementById('bmiMessage');

    bmiForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert('Vui lòng nhập chiều cao và cân nặng là số dương hợp lệ!');
            return;
        }
        const bmi = weight / (Math.pow(height, 2));
        const roundedBMI = bmi.toFixed(2);

        displayResult(roundedBMI);
    });

    function displayResult(bmi) {
        bmiValueEl.textContent = bmi;
        bmiCategoryEl.className = 'badge';
        if (bmi < 18.5) {
            bmiCategoryEl.textContent = 'Gầy';
            bmiCategoryEl.classList.add('status-underweight');
            bmiMessageEl.textContent = 'Bạn cần bổ sung thêm dinh dưỡng nhé.';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            bmiCategoryEl.textContent = 'Bình thường';
            bmiCategoryEl.classList.add('status-normal');
            bmiMessageEl.textContent = 'Tuyệt vời! Hãy duy trì thể trạng này.';
        } else if (bmi >= 25 && bmi < 29.9) {
            bmiCategoryEl.textContent = 'Thừa cân';
            bmiCategoryEl.classList.add('status-overweight');
            bmiMessageEl.textContent = 'Bạn nên chú ý chế độ ăn uống và tập luyện.';
        } else {
            bmiCategoryEl.textContent = 'Béo phì';
            bmiCategoryEl.classList.add('status-obese');
            bmiMessageEl.textContent = 'Cảnh báo! Bạn cần giảm cân để bảo vệ sức khỏe.';
        }
        resultArea.classList.remove('hidden');
    }
});