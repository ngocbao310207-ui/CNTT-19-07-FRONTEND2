const API_URL = 'https://6a15be9d91ff9a63de08b758.mockapi.io/api/v1/users';
const loader = document.getElementById('loader');
const errorBox = document.getElementById('errorBox');
const userGrid = document.getElementById('userGrid');

async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Mã lỗi máy chủ: ${response.status}`);
        }
        
        const data = await response.json();
        
        setTimeout(() => {
            renderUsers(data);
        }, 800);
        
    } catch (error) {
        showError(error.message);
    }
}

function renderUsers(users) {
    loader.classList.add('hidden');
    userGrid.classList.remove('hidden');

    const htmlContent = users.map(user => {
        const initial = user.name.charAt(0);
        return `
            <div class="user-card">
                <div class="avatar-placeholder">${initial}</div>
                <div class="user-name">${user.name}</div>
                <div class="user-username">@${user.username}</div>
                <div class="user-detail">
                    <span>📧</span> ${user.email}
                </div>
                <div class="user-detail">
                    <span>📞</span> ${user.phone}
                </div>
                <div class="user-detail">
                    <span>🏢</span> ${user.company.name}
                </div>
            </div>
        `;
    }).join('');

    userGrid.innerHTML = htmlContent;
}

function showError(message) {
    loader.classList.add('hidden');
    errorBox.classList.remove('hidden');
    errorBox.innerHTML = `⚠️ Không thể tải dữ liệu: ${message}. Vui lòng kiểm tra lại đường truyền mạng.`;
}

fetchUsers();