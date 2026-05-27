const API_URL = "https://69e9870755d62f34797a990d.mockapi.io/api/v1/sinh_vien";

let danhSachGoc = []; 
let danhSachHienTai = []; 

// ================= Hệ thống Toast =================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-exclamation"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ================= Logic Thống Kê =================
function capNhatThongKe(danhSach) {
    let gioi = 0, kha = 0, tb = 0, yeu = 0;
    
    danhSach.forEach(sv => {
        const diem = parseFloat(sv.diem) || 0;
        if (diem >= 8) gioi++;
        else if (diem >= 6.5) kha++;
        else if (diem >= 5) tb++;
        else yeu++;
    });

    document.getElementById('countGioi').innerText = gioi;
    document.getElementById('countKha').innerText = kha;
    document.getElementById('countTb').innerText = tb;
    document.getElementById('countYeu').innerText = yeu;
}

// ================= Logic Bộ Lọc & Tìm Kiếm =================
function locDuLieu() {
    const searchText = document.getElementById('searchInput').value.toLowerCase().trim();
    const filterGioiTinh = document.getElementById('filterGioiTinh').value;
    const filterDiem = document.getElementById('filterDiem').value;

    const danhSachDaLoc = danhSachGoc.filter(sv => {
        const ten = (sv.ho_ten || "").toLowerCase();
        const ma = (sv.ma_sinh_vien || "").toLowerCase();
        const matchSearch = ten.includes(searchText) || ma.includes(searchText);

        let matchGioiTinh = true;
        if (filterGioiTinh !== "all") {
            const isNu = filterGioiTinh === "true";
            matchGioiTinh = Boolean(sv.gioi_tinh) === isNu;
        }

        let matchDiem = true;
        const diem = parseFloat(sv.diem) || 0;
        if (filterDiem === "gioi") matchDiem = (diem >= 8 && diem <= 10);
        else if (filterDiem === "kha") matchDiem = (diem >= 6.5 && diem < 8);
        else if (filterDiem === "tb") matchDiem = (diem >= 5 && diem < 6.5);
        else if (filterDiem === "yeu") matchDiem = (diem < 5);

        return matchSearch && matchGioiTinh && matchDiem;
    });

    danhSachHienTai = danhSachDaLoc; 
    hienThiDanhSachSinhVien(danhSachDaLoc);
    capNhatThongKe(danhSachGoc); 
}

// ================= Render Giao Diện =================
function hienThiDanhSachSinhVien(danhSach) {
    const danhSachElement = document.getElementById("danhSach");
    const soLuongElement = document.getElementById("soLuongHienThi");

    if (!danhSachElement) return;

    soLuongElement.innerText = `${danhSach.length} / ${danhSachGoc.length}`;

    if (danhSach.length === 0) {
        danhSachElement.innerHTML = `<div style="text-align: center; padding: 40px; color: #64748b;"><p>Không tìm thấy sinh viên nào.</p></div>`;
        return;
    }

    danhSachElement.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Mã SV</th>
          <th>Điểm</th>
          <th>Giới tính</th>
          <th>Trạng thái</th>
          <th style="text-align: center;">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        ${danhSach.map(sinhVien => {
          const gioiTinhBadge = sinhVien.gioi_tinh 
            ? '<span class="badge badge-female"><i class="fa-solid fa-venus"></i> Nữ</span>' 
            : '<span class="badge badge-male"><i class="fa-solid fa-mars"></i> Nam</span>';
          
          const isDangHoc = sinhVien.trang_thai !== false; 
          const trangThaiBadge = isDangHoc
            ? '<span class="badge badge-active">Đang học</span>'
            : '<span class="badge badge-inactive">Thôi học</span>';

          return `
          <tr>
            <td>#${sinhVien.id}</td>
            <td style="font-weight: 500;">${sinhVien.ho_ten || "—"}</td>
            <td>${sinhVien.ma_sinh_vien || "—"}</td>
            <td><strong>${sinhVien.diem || "0"}</strong></td>
            <td>${gioiTinhBadge}</td>
            <td>${trangThaiBadge}</td>
            <td>
              <div class="action-btns" style="justify-content: center;">
                <button class="btn-icon view" onclick="xemChiTiet('${sinhVien.id}')"><i class="fa-solid fa-eye"></i></button>
                <button class="btn-icon edit" onclick="moFormSua('${sinhVien.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon delete" onclick="xoaSV('${sinhVien.id}')"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>`;
}

// ================= Chức năng Xuất Excel =================
function xuatExcel() {
    if (danhSachHienTai.length === 0) {
        showToast("Không có dữ liệu để xuất!", "error");
        return;
    }

    // Chuẩn bị dữ liệu JSON
    const data = danhSachHienTai.map((sv, index) => ({
        "STT": index + 1,
        "Họ Tên": sv.ho_ten,
        "Mã SV": sv.ma_sinh_vien,
        "Điểm": sv.diem,
        "Giới Tính": sv.gioi_tinh ? "Nữ" : "Nam",
        "Trạng Thái": sv.trang_thai !== false ? "Đang học" : "Đã thôi học"
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SinhVien");
    XLSX.writeFile(wb, "Danh_Sach_Sinh_Vien.xlsx");
    showToast("Xuất Excel thành công!");
}

// ================= Các API Fetch =================
async function laySinhVien() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        danhSachGoc = data;
        locDuLieu();
    } catch (error) {
        showToast("Lỗi tải dữ liệu!", "error");
    }
}

async function layMotSinhVien(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
}

async function themMotSinhVien(sv) {
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sv),
    });
}

async function capNhatSinhVien(id, sv) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sv),
    });
}

async function xoaSinhVien(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

// ================= Logic Giao Diện (Modal) =================
const modal = document.getElementById("sinhVienModal");

function dongModal() {
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = "none"; }, 300);
}

function moFormThem() {
    document.getElementById("modalTitle").innerText = "Thêm Sinh Viên Mới";
    document.getElementById("svId").value = "";
    document.getElementById("hoTen").value = "";
    document.getElementById("maSV").value = "";
    document.getElementById("diem").value = "";
    document.getElementById("gioiTinh").value = "false";
    document.getElementById("trangThai").value = "true";
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add('show'), 10);
}

async function moFormSua(id) {
    try {
        const sv = await layMotSinhVien(id);
        document.getElementById("modalTitle").innerText = "Cập Nhật Sinh Viên";
        document.getElementById("svId").value = sv.id;
        document.getElementById("hoTen").value = sv.ho_ten;
        document.getElementById("maSV").value = sv.ma_sinh_vien;
        document.getElementById("diem").value = sv.diem;
        document.getElementById("gioiTinh").value = sv.gioi_tinh ? "true" : "false";
        document.getElementById("trangThai").value = sv.trang_thai !== false ? "true" : "false";
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add('show'), 10);
    } catch (e) { showToast("Lỗi tải thông tin!", "error"); }
}

async function luuSinhVien() {
    const id = document.getElementById("svId").value;
    const sv = {
        ho_ten: document.getElementById("hoTen").value,
        ma_sinh_vien: document.getElementById("maSV").value,
        diem: parseFloat(document.getElementById("diem").value) || 0,
        gioi_tinh: document.getElementById("gioiTinh").value === "true",
        trang_thai: document.getElementById("trangThai").value === "true"
    };

    try {
        if (id) await capNhatSinhVien(id, sv);
        else await themMotSinhVien(sv);
        showToast("Lưu thành công!");
        dongModal();
        laySinhVien();
    } catch (e) { showToast("Lỗi khi lưu!", "error"); }
}

async function xoaSV(id) {
    if (confirm("Xóa sinh viên này?")) {
        await xoaSinhVien(id);
        showToast("Đã xóa!");
        laySinhVien();
    }
}

async function xemChiTiet(id) {
    const sv = await layMotSinhVien(id);
    alert(`Sinh viên: ${sv.ho_ten}\nMã SV: ${sv.ma_sinh_vien}\nĐiểm: ${sv.diem}`);
}

window.onclick = (e) => { if (e.target == modal) dongModal(); }
laySinhVien();