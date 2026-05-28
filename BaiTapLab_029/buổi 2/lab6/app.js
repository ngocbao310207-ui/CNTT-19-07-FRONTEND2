const logArea = document.getElementById('logArea');

const writeLog = (msg) => {
    const p = document.createElement('p');
    p.textContent = `> ${msg}`;
    logArea.appendChild(p);
};

function tinhTienGoc(donHang, cb) {
    setTimeout(() => {
        writeLog("Đang tính tiền gốc...");
        donHang.gia = donHang.soLuong * donHang.donGia;
        cb(donHang); 
    }, 800);
}

function apDungGiamGia(donHang, cb) {
    setTimeout(() => {
        writeLog("Đang áp dụng mã giảm giá...");
        donHang.gia -= 50000;
        cb(donHang);
    }, 800);
}

function congPhiVanChuyen(donHang, cb) {
    setTimeout(() => {
        writeLog("Đang cộng phí vận chuyển...");
        donHang.gia += 20000;
        cb(donHang);
    }, 800);
}

document.getElementById('btnOrder').addEventListener('click', () => {
    logArea.innerHTML = '';
    const myOrder = { donGia: 200000, soLuong: 2 };
    
    tinhTienGoc(myOrder, (order) => {
        apDungGiamGia(order, (order) => {
            congPhiVanChuyen(order, (finalOrder) => {
                writeLog(`HOÀN TẤT! Tổng tiền: ${finalOrder.gia.toLocaleString()} VNĐ`);
            });
        });
    });
});