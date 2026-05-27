document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('discountForm');
    const receiptArea = document.getElementById('receiptArea');
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    function calculateDiscount(orderValue, tier) {
        let discountRate = 0;

        if (orderValue >= 5000000) {
            discountRate = tier === 'platinum' ? 0.20 : tier === 'gold' ? 0.15 : 0.10;
        } else if (orderValue >= 2000000) {
            discountRate = tier === 'platinum' ? 0.15 : tier === 'gold' ? 0.10 : 0.05;
        } else if (orderValue >= 500000) {
            discountRate = tier === 'platinum' ? 0.10 : tier === 'silver' ? 0.05 : 0;
        } else {
            discountRate = tier === 'platinum' ? 0.05 : 0; 
        }

        const discountAmount = orderValue * discountRate;
        const finalPrice = orderValue - discountAmount;
        return { discountRate, discountAmount, finalPrice };
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const orderValue = Number(document.getElementById('orderValue').value);
        const memberTier = document.getElementById('memberTier').value;
        if (orderValue <= 0) {
            alert('Giá trị đơn hàng phải lớn hơn 0');
            return;
        }
        const result = calculateDiscount(orderValue, memberTier);
        document.getElementById('originalPrice').textContent = formatCurrency(orderValue);
        document.getElementById('discountRate').textContent = `${(result.discountRate * 100).toFixed(0)}%`;
        document.getElementById('discountAmount').textContent = `- ${formatCurrency(result.discountAmount)}`;
        document.getElementById('finalPrice').textContent = formatCurrency(result.finalPrice);

        receiptArea.classList.remove('hidden');
    });
});