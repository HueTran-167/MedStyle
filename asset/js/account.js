document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if (!currentUser) {
        window.location.href = './login.html'
        return
    }

    const accountHello = document.getElementById('accountHello')
    const tabs = document.querySelectorAll('.account-tab')
    const contents = document.querySelectorAll('.account-content')

    const orderList = document.getElementById('orderList')
    const couponList = document.getElementById('couponList')
    const accountAddressBox = document.getElementById('accountAddressBox')

    const profileName = document.getElementById('profileName')
    const profileEmail = document.getElementById('profileEmail')
    const logoutBtn = document.getElementById('logoutBtn')

    const editAccountAddress = document.getElementById('editAccountAddress')
    const addressPopup = document.getElementById('addressPopup')
    const closeAddressPopup = document.getElementById('closeAddressPopup')
    const addressForm = document.getElementById('addressForm')

    const citySelect = document.getElementById('citySelect')
    const wardSelect = document.getElementById('wardSelect')
    const streetSelect = document.getElementById('streetSelect')

    accountHello.innerHTML = `
        Xin chào <strong>${currentUser.name || currentUser.email}</strong>.
        Từ trang quản lý tài khoản bạn có thể xem đơn hàng mới,
        quản lý địa chỉ giao hàng và thông tin tài khoản.
    `

    profileName.textContent = currentUser.name || 'Chưa cập nhật'
    profileEmail.textContent = currentUser.email

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(item => item.classList.remove('active'))
            contents.forEach(item => item.classList.remove('active'))

            tab.classList.add('active')
            document.getElementById(tab.dataset.tab).classList.add('active')
        })
    })

    function formatPrice(price) {
        return Number(price).toLocaleString('vi-VN') + ',00 ₫'
    }

    function getUserKey(prefix) {
        return prefix + '_' + currentUser.email
    }

    function renderOrders() {
        const orders = JSON.parse(localStorage.getItem(getUserKey('orders'))) || []

        if (orders.length === 0) {
            orderList.innerHTML = `<p class="account-empty">Bạn chưa có đơn hàng nào.</p>`
            return
        }

        orderList.innerHTML = orders.map(function (order) {
            return `
                <div class="account-order">
                    <div class="account-order-head">
                        <strong>Mã đơn: ${order.id}</strong>
                        <span>${order.date}</span>
                    </div>

                    ${order.items.map(function (item) {
                        return `
                            <div class="account-order-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div>
                                    <h4>${item.name}</h4>
                                    <p>Số lượng: ${item.quantity}</p>
                                    <p>${item.size ? 'Size: ' + item.size : ''}</p>
                                    <p>${item.color ? 'Màu: ' + item.color : ''}</p>
                                </div>
                                <strong>${formatPrice(item.price * item.quantity)}</strong>
                            </div>
                        `
                    }).join('')}

                    <div class="account-order-total">
                        Tổng đơn hàng: <strong>${formatPrice(order.total)}</strong>
                    </div>
                </div>
            `
        }).join('')
    }

    function renderCoupons() {
        const couponUsed = localStorage.getItem('newUserCouponUsed_' + currentUser.email)

        if (couponUsed === 'true') {
            couponList.innerHTML = `<p class="account-empty">Bạn hiện không có khuyến mãi nào.</p>`
            return
        }

        couponList.innerHTML = `
            <div class="account-coupon-card">
                <h3>Ưu đãi 10% cho khách hàng mới</h3>
                <p>Giảm 10% cho đơn hàng đầu tiên của bạn.</p>
                <span>Chưa sử dụng</span>
            </div>
        `
    }

    function renderAddress() {
        const address = JSON.parse(localStorage.getItem('shippingAddress'))

        if (!address) {
            accountAddressBox.innerHTML = `
                <p class="account-empty">Bạn chưa có địa chỉ giao hàng.</p>
            `
            return
        }

        accountAddressBox.innerHTML = `
            <p><strong>${address.name}</strong></p>
            <p>${address.phone}</p>
            <p>${address.detail}, ${address.street}, ${address.ward}, ${address.city}</p>
        `
    }

    async function loadProvinces() {
        try {
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
            console.log('Không tải được danh sách phường/xã:', error)
        }
    }

    citySelect.addEventListener('change', function () {
        if (citySelect.value) {
            loadWards(citySelect.value)
        }
    })

    editAccountAddress.addEventListener('click', function () {
        addressPopup.classList.add('active')
    })

    closeAddressPopup.addEventListener('click', function () {
        addressPopup.classList.remove('active')
    })

    addressForm.addEventListener('submit', function (event) {
        event.preventDefault()

        const cityText = citySelect.options[citySelect.selectedIndex].text

        const addressInfo = {
            name: document.getElementById('customerName').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            city: cityText,
            ward: wardSelect.value,
            street: streetSelect.value.trim(),
            detail: document.getElementById('detailAddress').value.trim()
        }

        localStorage.setItem('shippingAddress', JSON.stringify(addressInfo))

        addressForm.reset()
        wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'
        addressPopup.classList.remove('active')

        renderAddress()
    })

    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('currentUser')
        window.location.href = './index.html'
    })

    renderOrders()
    renderCoupons()
    renderAddress()
    loadProvinces()
})