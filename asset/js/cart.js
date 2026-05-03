document.addEventListener('DOMContentLoaded', function () {
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

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'))
    }

    function getUserKey(prefix) {
        const user = getCurrentUser()
        if (!user || !user.email) return null
        return prefix + '_' + user.email
    }

    function formatPrice(price) {
        return Number(price || 0).toLocaleString('vi-VN') + ',00 ₫'
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

    function getAddress() {
        const key = getUserKey('address')
        if (!key) return null
        return JSON.parse(localStorage.getItem(key))
    }

    function saveAddress(address) {
        const key = getUserKey('address')
        if (!key) return
        localStorage.setItem(key, JSON.stringify(address))
    }

    function getCouponUsedKey() {
        const user = getCurrentUser()
        if (!user || !user.email) return null
        return 'newUserCouponUsed_' + user.email
    }

    function getCouponAppliedKey() {
        const user = getCurrentUser()
        if (!user || !user.email) return null
        return 'cartCouponApplied_' + user.email
    }

    let isCouponApplied = localStorage.getItem(getCouponAppliedKey()) === 'true'

    function getProductKey(item) {
        return [
            item.name || '',
            item.price || '',
            item.gender || '',
            item.color || '',
            item.sleeve || '',
            item.size || '',
            item.serviceType || '',
            item.note || ''
        ].join('|').toLowerCase()
    }

    function mergeSameProducts() {
        const cart = getCart()
        const merged = []

        cart.forEach(function (item) {
            const existedItem = merged.find(function (product) {
                return getProductKey(product) === getProductKey(item)
            })

            if (existedItem) {
                existedItem.quantity = Number(existedItem.quantity || 1) + Number(item.quantity || 1)
            } else {
                merged.push({
                    ...item,
                    quantity: Number(item.quantity || 1)
                })
            }
        })

        saveCart(merged)
        return merged
    }

    function getSubtotal() {
        return getCart().reduce(function (total, item) {
            return total + Number(item.price || 0) * Number(item.quantity || 1)
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

        const totalQuantity = getCart().reduce(function (total, item) {
            return total + Number(item.quantity || 1)
        }, 0)

        if (totalQuantity > 0) {
            badge.textContent = totalQuantity
            badge.style.display = 'flex'
        } else {
            badge.style.display = 'none'
        }
    }

    function renderProductOptions(item) {
        return `
            ${item.gender ? 'Phân loại: ' + item.gender + '<br>' : ''}
            ${item.color ? 'Màu: ' + item.color + '<br>' : ''}
            ${item.sleeve ? 'Tay áo: ' + item.sleeve + '<br>' : ''}
            ${item.size ? 'Size: ' + item.size + '<br>' : ''}
            ${item.serviceType ? 'Dịch vụ: ' + item.serviceType + '<br>' : ''}
            ${item.note ? 'Ghi chú: ' + item.note : ''}
        `
    }

    function renderCart() {
        const cart = mergeSameProducts()
        cartItems.innerHTML = ''

        if (cart.length === 0) {
            cartEmpty.style.display = 'block'
            cartItems.style.display = 'none'
        } else {
            cartEmpty.style.display = 'block'
            cartItems.style.display = 'block'
            cartEmpty.style.display = 'none'

            cart.forEach(function (item, index) {
                const cartItem = document.createElement('div')
                cartItem.className = 'cart-item'

                cartItem.innerHTML = `
                    <div class="cart-product">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <p>${formatPrice(item.price)}</p>
                            <small>${renderProductOptions(item)}</small>

                            <div class="cart-qty">
                                <button class="minus-cart" data-index="${index}">-</button>
                                <input type="text" value="${item.quantity}" readonly>
                                <button class="plus-cart" data-index="${index}">+</button>
                            </div>

                            <button class="remove-cart" data-index="${index}">Xóa sản phẩm</button>
                        </div>
                    </div>

                    <strong>${formatPrice(Number(item.price) * Number(item.quantity))}</strong>
                `

                cartItems.appendChild(cartItem)
            })
        }

        updateSummary()
        updateCartBadge()
        bindCartButtons()
    }

    function bindCartButtons() {
        document.querySelectorAll('.plus-cart').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const index = Number(btn.dataset.index)
                const cart = getCart()

                cart[index].quantity = Number(cart[index].quantity) + 1
                saveCart(cart)
                renderCart()
            })
        })

        document.querySelectorAll('.minus-cart').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const index = Number(btn.dataset.index)
                const cart = getCart()

                if (Number(cart[index].quantity) > 1) {
                    cart[index].quantity = Number(cart[index].quantity) - 1
                } else {
                    cart.splice(index, 1)
                }

                saveCart(cart)
                renderCart()
            })
        })

        document.querySelectorAll('.remove-cart').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const index = Number(btn.dataset.index)
                const cart = getCart()

                cart.splice(index, 1)
                saveCart(cart)
                renderCart()
            })
        })
    }

    function renderCoupon() {
        if (!couponContent) return

        const couponUsedKey = getCouponUsedKey()
        const couponAppliedKey = getCouponAppliedKey()
        const couponUsed = couponUsedKey ? localStorage.getItem(couponUsedKey) : null

        if (couponUsed === 'true') {
            isCouponApplied = false
            if (couponAppliedKey) localStorage.setItem(couponAppliedKey, 'false')

            couponContent.innerHTML = `
                <p class="coupon-error">Bạn hiện không có phiếu giảm giá nào.</p>
            `

            updateSummary()
            return
        }

        couponContent.innerHTML = `
            <label class="coupon-option">
                <input type="checkbox" id="newUserCoupon">
                <span>Ưu đãi 10% cho khách hàng mới</span>
            </label>
            <p id="couponMessage"></p>
        `

        const newUserCoupon = document.getElementById('newUserCoupon')
        const couponMessage = document.getElementById('couponMessage')

        if (isCouponApplied) {
            newUserCoupon.checked = true
            couponMessage.textContent = 'Đã áp dụng ưu đãi 10% cho khách hàng mới.'
            couponMessage.className = 'coupon-success'
        }

        newUserCoupon.addEventListener('change', function () {
            isCouponApplied = newUserCoupon.checked

            if (couponAppliedKey) {
                localStorage.setItem(couponAppliedKey, isCouponApplied ? 'true' : 'false')
            }

            if (isCouponApplied) {
                couponMessage.textContent = 'Đã áp dụng ưu đãi 10% cho khách hàng mới.'
                couponMessage.className = 'coupon-success'
            } else {
                couponMessage.textContent = 'Đã bỏ áp dụng voucher. Bạn vẫn có thể dùng lại trước khi thanh toán.'
                couponMessage.className = 'coupon-success'
            }

            updateSummary()
        })
    }

    if (couponToggle) {
        couponToggle.addEventListener('click', function () {
            couponContent.classList.toggle('open')
        })
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            const cart = getCart()

            if (cart.length === 0) {
                alert('Giỏ hàng chưa có sản phẩm!')
                return
            }

            window.location.href = './checkout.html'
        })
    }

    if (changeAddressBtn) {
        changeAddressBtn.addEventListener('click', function () {
            addressPopup.classList.add('active')
        })
    }

    if (closeAddressPopup) {
        closeAddressPopup.addEventListener('click', function () {
            addressPopup.classList.remove('active')
        })
    }

    if (addressPopup) {
        addressPopup.addEventListener('click', function (event) {
            if (event.target === addressPopup) {
                addressPopup.classList.remove('active')
            }
        })
    }

    async function loadProvinces() {
        try {
            if (!citySelect) return

            citySelect.innerHTML = '<option value="">Chọn Tỉnh/Thành phố</option>'

            const response = await fetch('https://provinces.open-api.vn/api/p/')
            const provinces = await response.json()

            provinces.forEach(function (province) {
                const option = document.createElement('option')
                option.value = province.code
                option.textContent = province.name
                citySelect.appendChild(option)
            })
        } catch (error) {
            console.log('Không tải được danh sách tỉnh/thành phố:', error)
        }
    }

    async function loadWards(provinceCode) {
        try {
            if (!wardSelect) return

            wardSelect.innerHTML = '<option value="">Đang tải Phường/Xã...</option>'

            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=3`)
            const province = await response.json()

            wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'

            province.districts.forEach(function (district) {
                district.wards.forEach(function (ward) {
                    const option = document.createElement('option')
                    option.value = ward.name + ' - ' + district.name
                    option.textContent = ward.name + ' - ' + district.name
                    wardSelect.appendChild(option)
                })
            })
        } catch (error) {
            if (wardSelect) {
                wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'
            }

            console.log('Không tải được danh sách phường/xã:', error)
        }
    }

    if (citySelect) {
        citySelect.addEventListener('change', function () {
            if (wardSelect) {
                wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'
            }

            if (citySelect.value) {
                loadWards(citySelect.value)
            }
        })
    }

    if (addressForm) {
        addressForm.addEventListener('submit', function (event) {
            event.preventDefault()

            const cityText = citySelect.options[citySelect.selectedIndex].text
            const wardText = wardSelect.value
            const streetText = streetSelect.value.trim()
            const detailText = document.getElementById('detailAddress').value.trim()

            const addressInfo = {
                name: document.getElementById('customerName').value.trim(),
                phone: document.getElementById('customerPhone').value.trim(),
                city: cityText,
                ward: wardText,
                street: streetText,
                detail: detailText
            }

            saveAddress(addressInfo)

            if (shippingAddressText) {
                shippingAddressText.textContent = `Giao hàng đến ${detailText}, ${streetText}, ${wardText}, ${cityText}`
            }

            alert('Đã lưu địa chỉ giao hàng!')
            addressPopup.classList.remove('active')
            addressForm.reset()

            if (wardSelect) {
                wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'
            }
        })
    }

    function loadSavedAddress() {
        const savedAddress = getAddress()

        if (savedAddress && shippingAddressText) {
            shippingAddressText.textContent = `Giao hàng đến ${savedAddress.detail}, ${savedAddress.street}, ${savedAddress.ward}, ${savedAddress.city}`
        }
    }

    renderCoupon()
    renderCart()
    loadSavedAddress()
    loadProvinces()
})