const DEFAULT_API = 'https://69e9870755d62f34797a990d.mockapi.io/api/v1/sinh_vien';
let currentId = null;
let searchHistory = JSON.parse(localStorage.getItem('student_search_history')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const baseApiInput = document.getElementById('inp-base-url');
    if (baseApiInput) baseApiInput.value = DEFAULT_API;
    
    renderHistory();

    const idInput = document.getElementById('inp-id');
    if (idInput) {
        idInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') lookupById();
        });
    }
});

function getApiUrl() {
    const url = document.getElementById('inp-base-url').value.trim();
    return url || DEFAULT_API;
}

async function lookupById(id = null) {
    const inputId = id || document.getElementById('inp-id').value.trim();
    
    if (!inputId) {
        alert("Vui lòng nhập ID sinh viên!");
        return;
    }

    currentId = parseInt(inputId);
    document.getElementById('inp-id').value = currentId; 
    hideAllStates();
    document.getElementById('state-loading').style.display = 'flex';
    document.getElementById('btn-search').disabled = true;
    document.getElementById('btn-clear').style.display = 'none';
    document.querySelector('.btn-spinner').style.display = 'inline-block';

    try {
        const response = await fetch(`${getApiUrl()}/${currentId}`);
        
        if (response.status === 404) {
            showState('not-found');
            return;
        }
        if (!response.ok) throw new Error("Lỗi kết nối máy chủ");

        const data = await response.json();
        
        displayResult(data);
        addToHistory(data);

    } catch (error) {
        document.getElementById('error-detail').textContent = error.message;
        showState('error');
    } finally {
        document.getElementById('btn-search').disabled = false;
        document.querySelector('.btn-spinner').style.display = 'none';
    }
}

function quickSearch(id) {
    lookupById(id);
}

function navigateId(direction) {
    if (currentId) {
        const nextId = currentId + direction;
        if (nextId > 0) lookupById(nextId);
    }
}

function hideAllStates() {
    document.getElementById('state-loading').style.display = 'none';
    document.getElementById('state-not-found').style.display = 'none';
    document.getElementById('state-error').style.display = 'none';
    document.getElementById('result-card').style.display = 'none';
}

function showState(state) {
    hideAllStates();
    if (state === 'not-found') document.getElementById('state-not-found').style.display = 'flex';
    if (state === 'error') document.getElementById('state-error').style.display = 'flex';
}
function displayResult(user) {
    hideAllStates();
    document.getElementById('result-card').style.display = 'block';
    document.getElementById('btn-clear').style.display = 'block';

    const name = user.ho_ten || user.name || "Chưa cập nhật";
    const initials = name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
    
    document.getElementById('res-avatar').textContent = initials;
    document.getElementById('res-id-tag').textContent = `ID: ${user.id}`;
    document.getElementById('res-name').textContent = name;
    document.getElementById('res-username').textContent = user.ma_sinh_vien || "Chưa có MSSV";
    
    document.getElementById('res-email').textContent = user.email || "Không có dữ liệu";

    document.getElementById('res-phone').textContent = getStatusLabel(user.trangthai);
    document.getElementById('res-phone').previousElementSibling.textContent = "🟢 Trạng thái";
    
    const websiteEl = document.getElementById('res-website');
    websiteEl.textContent = user.khoa || "Chưa cập nhật";
    websiteEl.removeAttribute("href"); 
    websiteEl.previousElementSibling.textContent = "🏫 Khoa";

    document.getElementById('res-company').textContent = user.diemgpa ? `${Number(user.diemgpa).toFixed(2)} / 4.0` : "Chưa có điểm";
    document.getElementById('res-company').previousElementSibling.textContent = "🎓 GPA";
    const gender = user.gioi_tinh === true ? "Nam" : (user.gioi_tinh === false ? "Nữ" : "Chưa rõ");
    document.getElementById('res-address').textContent = `Sinh viên năm ${user.namhoc || "?"} - Giới tính: ${gender}`;
    document.getElementById('res-address').previousElementSibling.textContent = "👤 Thông tin chung";

    document.getElementById('nav-hint').textContent = `Đang xem sinh viên ID ${user.id}`;
    document.getElementById('btn-prev').disabled = (user.id <= 1);
}

function getStatusLabel(status) {
    if (status === 'active') return "Đang học";
    if (status === 'leave') return "Bảo lưu";
    if (status === 'graduated') return "Tốt nghiệp";
    return status || "Không rõ";
}

function clearResult() {
    hideAllStates();
    document.getElementById('inp-id').value = '';
    document.getElementById('btn-clear').style.display = 'none';
    currentId = null;
}

function addToHistory(user) {
    const name = user.ho_ten || user.name || "Không rõ";
    const mssv = user.ma_sinh_vien || "";
    searchHistory = searchHistory.filter(h => h.id !== user.id);
    searchHistory.unshift({
        id: user.id,
        name: name,
        mssv: mssv,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    });
    if (searchHistory.length > 5) searchHistory.pop();
    
    localStorage.setItem('student_search_history', JSON.stringify(searchHistory));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    const section = document.getElementById('history-section');
    
    list.innerHTML = '';
    
    if (searchHistory.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    searchHistory.forEach(item => {
        const initials = item.name.split(' ').slice(-2).map(w => w[0] || '').join('').toUpperCase();
        
        const div = document.createElement('div');
        div.className = 'history-item';
        div.onclick = () => lookupById(item.id);
        
        div.innerHTML = `
            <div class="history-item-left">
                <div class="history-mini-avatar">${initials}</div>
                <div>
                    <div class="history-name">${item.name}</div>
                    <div class="history-meta">ID: ${item.id} • ${item.mssv}</div>
                </div>
            </div>
            <div class="history-time">${item.time}</div>
        `;
        list.appendChild(div);
    });
}

function clearHistory() {
    searchHistory = [];
    localStorage.removeItem('student_search_history');
    renderHistory();
}