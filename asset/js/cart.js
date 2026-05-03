document.addEventListener('DOMContentLoaded', function () {

    function getUserKey(prefix) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (!currentUser || !currentUser.email) return null
        return prefix + '_' + currentUser.email
    }

    function formatPrice(price) {
        return Number(price).toLocaleString('vi-VN') + ',00 ₫'
    }

    function getCart() {
        const key = getUserKey('cart')
        if (!key) return []
        return JSON.parse(localStorage.getItem(key)) || []
    }

    function saveCart(cart) {
        const key = getUserKey('cart')
        if (!key) return
        localStorage.setItem(key, JSON.stringify(cart))
    }

    function getAddressKey() {
        return getUserKey('address')
    }

    function getCouponKey() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        return currentUser ? 'newUserCouponUsed_' + currentUser.email : null
    }

    const cartItems = document.getElementById('cartItems')
    const cartEmpty = document.getElementById('cartEmpty')
    const subtotalEl = document.getElementById('subtotal')
    const discountEl = document.getElementById('discount')
    const totalEl = document.getElementById('total')

    const couponToggle = document.getElementById('couponToggle')
    const couponContent = document.getElementById('couponContent')
    const checkoutBtn = document.querySelector('.checkout-btn')

    const changeAddressBtn = document.getElementById('changeAddressBtn')
    const addressPopup = document.getElementById('addressPopup')
    const closeAddressPopup = document.getElementById('closeAddressPopup')
    const addressForm = document.getElementById('addressForm')

    const citySelect = document.getElementById('citySelect')
    const wardSelect = document.getElementById('wardSelect')
    const streetSelect = document.getElementById('streetSelect')
    const shippingAddressText = document.getElementById('shippingAddressText')

    const shippingFee = 20000

    let isCouponApplied = false

    function getSubtotal() {
        return getCart().reduce((total, item) => {
            return total + Number(item.price) * Number(item.quantity)
        }, 0)
    }

    function updateSummary() {
        const cart = getCart()
        const subtotal = getSubtotal()

        if (cart.length === 0) {
            subtotalEl.textContent = formatPrice(0)
            discountEl.textContent = formatPrice(0)
            totalEl.textContent = formatPrice(0)
            return
        }

        const discount = isCouponApplied ? subtotal * 0.1 : 0
        const total = subtotal - discount + shippingFee

        subtotalEl.textContent = formatPrice(subtotal)
        discountEl.textContent = discount > 0 ? '-' + formatPrice(discount) : formatPrice(0)
        totalEl.textContent = formatPrice(total)
    }

    function updateCartBadge() {
        const cartIcon = document.querySelector('.nav-shopping')
        if (!cartIcon) return

        let badge = cartIcon.querySelector('.cart-count-badge')

        if (!badge) {
            badge = document.createElement('span')
            badge.className = 'cart-count-badge'
            cartIcon.appendChild(badge)
        }

        const cart = getCart()
        const totalQuantity = cart.reduce((total, item) => total + Number(item.quantity || 1), 0)

        if (totalQuantity > 0) {
            badge.textContent = totalQuantity
            badge.style.display = 'flex'
        } else {
            badge.style.display = 'none'
        }
    }

    function renderCart() {
        const cart = getCart()
        cartItems.innerHTML = ''

        if (cart.length === 0) {
            cartEmpty.style.display = 'block'
            cartItems.style.display = 'none'
        } else {
            cartEmpty.style.display = 'none'
            cartItems.style.display = 'block'

            cart.forEach((item, index) => {
                const div = document.createElement('div')
                div.className = 'cart-item'

                div.innerHTML = `
                    <div class="cart-product">
                        <img src="${item.image}">
                        <div>
                            <h4>${item.name}</h4>
                            <p>${formatPrice(item.price)}</p>

                            <div class="cart-qty">
                                <button class="minus-cart" data-index="${index}">-</button>
                                <input value="${item.quantity}" readonly>
                                <button class="plus-cart" data-index="${index}">+</button>
                            </div>

                            <button class="remove-cart" data-index="${index}">Xóa</button>
                        </div>
                    </div>

                    <strong>${formatPrice(item.price * item.quantity)}</strong>
                `

                cartItems.appendChild(div)
            })
        }

        updateSummary()
        updateCartBadge()
        bindButtons()
    }

    function bindButtons() {
        document.querySelectorAll('.plus-cart').forEach(btn => {
            btn.onclick = () => {
                const cart = getCart()
                cart[btn.dataset.index].quantity++
                saveCart(cart)
                renderCart()
            }
        })

        document.querySelectorAll('.minus-cart').forEach(btn => {
            btn.onclick = () => {
                const cart = getCart()
                const i = btn.dataset.index

                if (cart[i].quantity > 1) {
                    cart[i].quantity--
                } else {
                    cart.splice(i, 1)
                }

                saveCart(cart)
                renderCart()
            }
        })

        document.querySelectorAll('.remove-cart').forEach(btn => {
            btn.onclick = () => {
                const cart = getCart()
                cart.splice(btn.dataset.index, 1)
                saveCart(cart)
                renderCart()
            }
        })
    }

    function renderCoupon() {
        const used = localStorage.getItem(getCouponKey())

        if (used === 'true') {
            couponContent.innerHTML = `<p>Không có voucher</p>`
            return
        }

        couponContent.innerHTML = `
            <label>
                <input type="checkbox" id="couponCheck">
                Ưu đãi 10%
            </label>
        `

        document.getElementById('couponCheck').onchange = function () {
            isCouponApplied = this.checked
            updateSummary()
        }
    }

    function saveAddress(address) {
        const key = getAddressKey()
        if (!key) return
        localStorage.setItem(key, JSON.stringify(address))
    }

    function loadAddress() {
        const key = getAddressKey()
        if (!key) return

        const data = JSON.parse(localStorage.getItem(key))
        if (!data || !shippingAddressText) return

        shippingAddressText.textContent =
            `Giao hàng đến ${data.detail}, ${data.street}, ${data.ward}, ${data.city}`
    }

    if (addressForm) {
        addressForm.onsubmit = function (e) {
            e.preventDefault()

            const address = {
                name: document.getElementById('customerName').value,
                phone: document.getElementById('customerPhone').value,
                city: citySelect.options[citySelect.selectedIndex].text,
                ward: wardSelect.value,
                street: streetSelect.value,
                detail: document.getElementById('detailAddress').value
            }

            saveAddress(address)
            loadAddress()
            addressPopup.classList.remove('active')
        }
    }

    if (checkoutBtn) {
        checkoutBtn.onclick = function () {
            if (getCart().length === 0) {
                alert('Giỏ hàng trống!')
                return
            }
            window.location.href = './checkout.html'
        }
    }

    renderCart()
    renderCoupon()
    loadAddress()
})