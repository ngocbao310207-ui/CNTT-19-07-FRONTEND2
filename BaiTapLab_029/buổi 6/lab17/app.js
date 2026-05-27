$(function () {

  const products = [
    { id: 1, name: 'Tai Nghe ANC Pro',   price: 1_290_000, emoji: '🎧', desc: 'Chống ồn chủ động, bass sâu' },
    { id: 2, name: 'Bàn Phím Cơ 75%',   price:   890_000, emoji: '⌨️', desc: 'Switch Blue, RGB per-key' },
    { id: 3, name: 'Chuột Không Dây',    price:   650_000, emoji: '🖱️', desc: 'Pin 6 tháng, 4000 DPI' },
    { id: 4, name: 'Đế Tản Nhiệt',       price:   320_000, emoji: '💨', desc: 'Quạt kép, USB-A' },
    { id: 5, name: 'Webcam Full HD',      price:   780_000, emoji: '📷', desc: '1080p 30fps, autofocus' },
    { id: 6, name: 'Hub USB-C 7in1',      price:   450_000, emoji: '🔌', desc: 'HDMI 4K, PD 100W' },
  ];

  const cart = {};

  function fmt(n) {
    return n.toLocaleString('vi-VN') + '₫';
  }

  function renderProducts() {
    const html = products.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-thumb">${p.emoji}</div>
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="product-footer">
            <span class="product-price">${fmt(p.price)}</span>
            <button class="btn-add" data-id="${p.id}">+ Thêm</button>
          </div>
        </div>
      </div>
    `).join('');
    $('#productsGrid').html(html);
  }

  function renderCart() {
    const ids = Object.keys(cart).filter(id => cart[id] > 0);

    if (ids.length === 0) {
      $('#cartEmpty').show();
      $('#cartItems').empty();
      $('#cartSummary').hide();
      $('#cartBadge').text(0);
      return;
    }

    $('#cartEmpty').hide();
    $('#cartSummary').show();

    let subtotal = 0;
    let totalQty = 0;

    const itemsHtml = ids.map(id => {
      const p   = products.find(x => x.id === +id);
      const qty = cart[id];
      const sub = p.price * qty;
      subtotal += sub;
      totalQty += qty;

      return `
        <div class="cart-item" data-id="${p.id}">
          <span class="cart-item-emoji">${p.emoji}</span>
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">${fmt(p.price)} / cái</div>
          </div>
          <div class="qty-control">
            <button class="qty-btn btn-qty-minus" data-id="${p.id}">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn btn-qty-plus"  data-id="${p.id}">+</button>
          </div>
          <span class="item-subtotal">${fmt(sub)}</span>
          <button class="btn-remove" data-id="${p.id}" title="Xoá">✕</button>
        </div>
      `;
    }).join('');

    $('#cartItems').html(itemsHtml);

    const shipping = subtotal >= 1_000_000 ? 0 : 30_000;
    const total    = subtotal + shipping;

    $('#subtotal').text(fmt(subtotal));
    $('#shipping').text(shipping === 0 ? 'Miễn phí 🎉' : fmt(shipping));
    $('#totalPrice').text(fmt(total));

    $('#cartBadge').text(totalQty).addClass('pop');
    setTimeout(() => $('#cartBadge').removeClass('pop'), 300);
  }

  $('#productsGrid').on('click', '.btn-add', function () {
    const id = $(this).data('id');
    cart[id] = (cart[id] || 0) + 1;

    $(this).text('✔ Đã thêm').prop('disabled', true);
    const self = this;
    setTimeout(() => { $(self).text('+ Thêm').prop('disabled', false); }, 800);

    renderCart();
  });

  $('#cartItems').on('click', '.btn-qty-plus', function () {
    const id = $(this).data('id');
    cart[id]++;
    renderCart();
  });

  $('#cartItems').on('click', '.btn-qty-minus', function () {
    const id = $(this).data('id');
    if (cart[id] > 1) {
      cart[id]--;
    } else {
      delete cart[id]; 
    }
    renderCart();
  });

  $('#cartItems').on('click', '.btn-remove', function () {
    const id = $(this).data('id');
    delete cart[id];
    renderCart();
  });

  $('#clearCart').on('click', function () {
    Object.keys(cart).forEach(k => delete cart[k]);
    renderCart();
  });

  $(document).on('click', '.btn-checkout', function () {
    alert('🎉 Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    Object.keys(cart).forEach(k => delete cart[k]);
    renderCart();
  });

  renderProducts();
  renderCart();

});