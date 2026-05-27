const products = [
    { id: 1, name: "Laptop Dell XPS 15", category: "laptop", price: 30000000, oldPrice: 35000000, discount: "-14%", img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500", desc: "Laptop cao cấp mỏng nhẹ dành cho doanh nhân với màn hình 4K sắc nét và hiệu năng vượt trội." },
    { id: 2, name: "Samsung Galaxy S24 Ultra", category: "phone", price: 25000000, oldPrice: null, discount: null, img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500", desc: "Điện thoại flagship hàng đầu thế giới với camera 200MP xuất sắc và bút S-Pen tích hợp." },
    { id: 3, name: "Tai nghe Sony WH-1000XM5", category: "accessory", price: 7500000, oldPrice: 8500000, discount: "-11%", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500", desc: "Tai nghe over-ear với công nghệ chống ồn chủ động (ANC) tốt nhất hiện nay, thời lượng pin 30 giờ." },
    { id: 4, name: "Bàn phím cơ Logitech MX", category: "accessory", price: 3500000, oldPrice: null, discount: null, img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500", desc: "Bàn phím cơ không dây layout low-profile mang lại cảm giác gõ êm ái và tốc độ phản hồi nhanh chóng." },
    { id: 5, name: "MacBook Air M3", category: "laptop", price: 27990000, oldPrice: 29990000, discount: "-6%", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", desc: "Hiệu năng mạnh mẽ từ chip M3 thế hệ mới nằm trong thiết kế nhôm nguyên khối siêu mỏng nhẹ đặc trưng." },
    { id: 6, name: "iPhone 15 Pro", category: "phone", price: 28000000, oldPrice: 30000000, discount: "-6%", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500", desc: "Khung viền titan hàng không vũ trụ siêu nhẹ, kết hợp cùng chip A17 Pro chơi game đỉnh cao." }
];

const productGrid = document.getElementById('productGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('quickViewModal');
const closeModalBtn = document.querySelector('.close-modal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');

function renderProducts(data) {
    productGrid.innerHTML = data.map(p => {
        const badgeHTML = p.discount ? `<span class="badge">${p.discount}</span>` : '';
        const oldPriceHTML = p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString()}đ</span>` : '';
        
        return `
            <div class="product-card">
                ${badgeHTML}
                <img src="${p.img}" alt="${p.name}">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <div class="price-row">
                        <span class="price">${p.price.toLocaleString()}đ</span>
                        ${oldPriceHTML}
                    </div>
                    <button class="btn-quick-view" data-id="${p.id}">Xem Nhanh</button>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.btn-quick-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const product = products.find(item => item.id === id);
            openModal(product);
        });
    });
}

function openModal(product) {
    modalImg.src = product.img;
    modalTitle.textContent = product.name;
    modalPrice.textContent = `${product.price.toLocaleString()}đ`;
    modalDesc.textContent = product.desc;
    modal.style.display = 'flex';
}

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        if (category === 'all') {
            renderProducts(products);
        } else {
            const filteredData = products.filter(p => p.category === category);
            renderProducts(filteredData);
        }
    });
});

renderProducts(products);