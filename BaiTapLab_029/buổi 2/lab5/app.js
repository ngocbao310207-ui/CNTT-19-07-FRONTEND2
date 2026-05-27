const products = [
    { id: 1, name: "MacBook Pro M4", price: 35000000 },
    { id: 2, name: "iPhone XS Max", price: 8000000 },
    { id: 3, name: "Bánh sữa Ba Vì", price: 50000 },
    { id: 4, name: "AirPods 4", price: 4000000 },
    { id: 5, name: "DareU LK160D", price: 300000 }
];

function renderProducts(data) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = data.length ? data.map(p => `
        <div class="product-card">
            <h3>${p.name}</h3>
            <p class="price">${p.price.toLocaleString()} VNĐ</p>
        </div>
    `).join('') : '<p class="no-result">Không tìm thấy sản phẩm nào!</p>';
}

function filterData() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const priceRange = document.getElementById('priceFilter').value;

    const filtered = products.filter(p => {
        const matchesName = p.name.toLowerCase().includes(searchTerm);
        const matchesPrice = priceRange === 'all' ? true 
                           : priceRange === 'low' ? p.price < 500000 
                           : p.price >= 500000;
        return matchesName && matchesPrice;
    });

    renderProducts(filtered);
}

document.getElementById('searchBar').addEventListener('input', filterData);
document.getElementById('priceFilter').addEventListener('change', filterData);
renderProducts(products);