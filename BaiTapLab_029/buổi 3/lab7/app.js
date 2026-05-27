const productImage = document.getElementById('productImage');
const productTitle = document.getElementById('productTitle');
const productDesc = document.getElementById('productDesc');
const mainCard = document.getElementById('mainCard');
const statusBadge = document.getElementById('statusBadge');

const btnVariant1 = document.getElementById('btnVariant1');
const btnVariant2 = document.getElementById('btnVariant2');
const btnReset = document.getElementById('btnReset');

const originalState = {
    src: 'https://cdn1.viettelstore.vn/Images/Product/ProductImage/1349547788.jpeg',
    title: 'iPhone 15 Pro',
    desc: 'Thiết kế Titan siêu nhẹ, siêu bền cùng chip A17 Pro đột phá. Trải nghiệm đẳng cấp với phiên bản nguyên bản hoàn hảo.',
    theme: '',
    badgeText: 'Mặc định',
    badgeClass: 'default-badge'
};

const variant1State = {
    src: 'https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/10/iPhone-15-pro-max-titan-xanh-6.jpg',
    title: 'iPhone 15 Pro - Titan Xanh',
    desc: 'Phiên bản Titan Xanh độc đáo, mang lại vẻ ngoài cực kỳ sang trọng và cuốn hút mọi ánh nhìn.',
    theme: 'theme-blue',
    badgeText: 'Phiên bản Xanh',
    badgeClass: 'blue-badge'
};

const variant2State = {
    src: 'https://cdn1.viettelstore.vn/Images/Product/ProductImage/1349547788.jpeg',
    title: 'iPhone 15 Pro - Titan Đen',
    desc: 'Sắc Đen không gian sâu thẳm, quyền lực và mạnh mẽ. Lựa chọn hoàn hảo cho sự tinh tế tối giản.',
    theme: 'theme-dark',
    badgeText: 'Phiên bản Đen',
    badgeClass: 'dark-badge'
};

function updateDOM(state) {
    productImage.style.opacity = 0;
    
    setTimeout(() => {
        productImage.src = state.src;
        productImage.style.opacity = 1;
    }, 200);

    productTitle.innerText = state.title;
    productDesc.textContent = state.desc;
    
    mainCard.className = `product-card ${state.theme}`;
    
    statusBadge.className = `badge ${state.badgeClass}`;
    statusBadge.innerText = state.badgeText;
}

btnVariant1.addEventListener('click', () => updateDOM(variant1State));
btnVariant2.addEventListener('click', () => updateDOM(variant2State));
btnReset.addEventListener('click', () => updateDOM(originalState));