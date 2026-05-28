// Lay cac phan tu DOM
var btnTinh = document.getElementById("btnTinh");
var result = document.getElementById("result");

btnTinh.onclick = function () {
    // Lay gia tri va chuyen sang so
    var canNang = Number(document.getElementById("canNang").value);
    var chieuCao = Number(document.getElementById("chieuCao").value);

    // Kiem tra hop le
    if (isNaN(canNang) || isNaN(chieuCao) || canNang <= 0 || chieuCao <= 0) {
        result.innerHTML = "Vui lòng nhập số hợp lệ!";
        return;
    }

    // Tinh BMI
    var bmi = canNang / (chieuCao * chieuCao);
    var phanLoai = "";

    // Phan loai BMI
    if (bmi < 18.5) {
        phanLoai = "Gầy";
    } else if (bmi < 25) {
        phanLoai = "Bình thường";
    } else if (bmi < 30) {
        phanLoai = "Thừa cân";
    } else {
        phanLoai = "Béo phì";
    }

    // Hien thi ket qua
    result.innerHTML = "BMI: " + bmi.toFixed(2) + " - " + phanLoai;
};