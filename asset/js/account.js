import { auth, db } from './firebase-config.js'
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js'
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    doc,
    updateDoc,
    addDoc
} from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js'

document.addEventListener('DOMContentLoaded', function () {
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

    let currentUserData = null

    function formatPrice(price) {
        return Number(price || 0).toLocaleString('vi-VN') + ',00 ₫'
    }

    function getUserKey(prefix) {
        if (!currentUserData || !currentUserData.email) return null
        return prefix + '_' + currentUserData.email
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

    function isAdmin() {
        const adminEmails = [
            'medstyle.vn@gmail.com',
            'tranthihuetran167@gmail.com'
        ]

        return adminEmails.includes(auth.currentUser?.email)
    }

    function getStatusText(status) {
        const statusMap = {
            pending: 'Chờ xác nhận',
            shipping: 'Đang giao hàng',
            done: 'Hoàn thành',
            cancelled: 'Đã hủy'
        }

        return statusMap[status] || 'Chờ xác nhận'
    }

    function renderItemOptions(item) {
        return `
            ${item.gender ? `<p><strong>Phân loại:</strong> ${item.gender}</p>` : ''}
            ${item.sleeve ? `<p><strong>Tay áo:</strong> ${item.sleeve}</p>` : ''}
            ${item.color ? `<p><strong>Màu:</strong> ${item.color}</p>` : ''}
            ${item.size ? `<p><strong>Size:</strong> ${item.size}</p>` : ''}
            ${item.serviceType ? `<p><strong>Dịch vụ:</strong> ${item.serviceType}</p>` : ''}
            ${item.note ? `<p><strong>Ghi chú:</strong> ${item.note}</p>` : ''}
        `
    }

    async function renderOrders() {
        if (!auth.currentUser) return

        orderList.innerHTML = `<p class="account-empty">Đang tải đơn hàng...</p>`

        try {
            let q

            if (isAdmin()) {
                q = query(
                    collection(db, 'orders'),
                    orderBy('createdAt', 'desc')
                )
            } else {
                q = query(
                    collection(db, 'orders'),
                    where('userId', '==', auth.currentUser.uid),
                    orderBy('createdAt', 'desc')
                )
            }

            const snapshot = await getDocs(q)

            if (snapshot.empty) {
                orderList.innerHTML = `<p class="account-empty">Bạn chưa có đơn hàng nào.</p>`
                return
            }

            orderList.innerHTML = ''

            snapshot.forEach(function (docSnap) {
                const order = docSnap.data()
                const orderId = docSnap.id

                const orderCard = document.createElement('div')
                orderCard.className = 'account-shop-order'

                orderCard.innerHTML = `
                    <div class="shop-order-head">
                        <div>
                            <strong>MedStyle</strong>
                            <span>Mã đơn: ${orderId}</span>
                        </div>

                        <div class="shop-order-action">
                            <span class="shop-order-status">${getStatusText(order.status)}</span>

                            ${isAdmin() && order.status === 'pending' ? `
                                <button 
                                    class="admin-confirm-btn" 
                                    data-id="${orderId}"
                                    data-email="${order.customer?.email || ''}"
                                >
                                    Xác nhận đơn
                                </button>
                            ` : ''}

                            ${isAdmin() && order.status === 'shipping' ? `
                                <button 
                                    class="admin-done-btn" 
                                    data-id="${orderId}"
                                    data-email="${order.customer?.email || ''}"
                                >
                                    Đã giao hàng
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    ${(order.items || []).map(function (item) {
                        return `
                            <div class="shop-order-product">
                                <img src="${item.image}" alt="${item.name}">

                                <div class="shop-order-info">
                                    <h3>${item.name}</h3>
                                    <div class="shop-order-options">
                                        ${renderItemOptions(item)}
                                    </div>
                                    <p>x${item.quantity}</p>
                                </div>

                                <div class="shop-order-price">
                                    ${formatPrice(Number(item.price) * Number(item.quantity))}
                                </div>
                            </div>
                        `
                    }).join('')}

                    <div class="shop-order-summary">
                        <p>Tạm tính: <strong>${formatPrice(order.subtotal)}</strong></p>
                        <p>Phí giao hàng: <strong>${formatPrice(order.shipping)}</strong></p>

                        ${Number(order.discount || 0) > 0 ? `
                            <p>Giảm giá: <strong>-${formatPrice(order.discount)}</strong></p>
                        ` : ''}

                        <h3>Thành tiền: <strong>${formatPrice(order.total)}</strong></h3>
                    </div>

                    <div class="shop-order-address">
                        <strong>Địa chỉ nhận hàng:</strong>
                        <p>
                            ${order.address?.name || ''} - ${order.address?.phone || ''}<br>
                            ${order.address?.detail || ''}, ${order.address?.street || ''}, ${order.address?.ward || ''}, ${order.address?.city || ''}
                        </p>
                    </div>
                `

                orderList.appendChild(orderCard)
            })

            bindAdminConfirmButtons()
                } catch (error) {
                    console.log(error)

                    orderList.innerHTML = `
                        <p class="account-empty">
                            Chưa tải được đơn hàng. Kiểm tra lại Firestore Index hoặc Rules.
                        </p>
                    `
                }
            }

            function bindAdminDoneButtons() {
                const buttons = document.querySelectorAll('.admin-done-btn')

                buttons.forEach(function (button) {
                    button.addEventListener('click', async function () {
                        const orderId = button.dataset.id
                        const customerEmail = button.dataset.email

                        const confirmDone = confirm('Xác nhận đơn hàng đã giao thành công?')
                        if (!confirmDone) return

                        try {
                            await updateDoc(doc(db, 'orders', orderId), {
                                status: 'done'
                            })

                            await addDoc(collection(db, 'mail'), {
                                to: customerEmail,
                                message: {
                                    subject: 'Đơn hàng của bạn đã được giao - MedStyle',
                                    html: `
                                        <h2>Đơn hàng đã được giao thành công 💙</h2>
                                        <p>Cảm ơn bạn đã mua hàng tại MedStyle.</p>
                                        <p>Hy vọng bạn hài lòng với sản phẩm của chúng tôi!</p>
                                    `
                                }
                            })

                            alert('Đã cập nhật đơn hàng hoàn thành!')
                            renderOrders()
                        } catch (error) {
                            console.log(error)
                            alert('Không thể cập nhật đơn hàng. Vui lòng thử lại!')
                        }
                    })
                })
            }

    function bindAdminConfirmButtons() {
        const buttons = document.querySelectorAll('.admin-confirm-btn')

        buttons.forEach(function (button) {
            button.addEventListener('click', async function () {
                const orderId = button.dataset.id
                const customerEmail = button.dataset.email

                const confirmOrder = confirm('Xác nhận đơn hàng này?')
                if (!confirmOrder) return

                try {
                    await updateDoc(doc(db, 'orders', orderId), {
                        status: 'shipping'
                    })

                    await addDoc(collection(db, 'mail'), {
                        to: customerEmail,
                        message: {
                            subject: 'Đơn hàng của bạn đã được xác nhận - MedStyle',
                            html: `
                                <h2>MedStyle đã xác nhận đơn hàng của bạn 💙</h2>
                                <p>Đơn hàng của bạn đang được xử lý và sẽ sớm được giao.</p>
                                <p>Cảm ơn bạn đã mua hàng tại MedStyle!</p>
                            `
                        }
                    })

                    alert('Đã xác nhận đơn hàng và gửi email!')
                    renderOrders()
                } catch (error) {
                    console.log(error)
                    alert('Không thể xác nhận đơn hàng. Vui lòng thử lại!')
                }
            })
        })
    }

    function renderCoupons() {
        const couponUsed = localStorage.getItem('newUserCouponUsed_' + currentUserData.email)

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
        const address = getAddress()

        if (!address) {
            accountAddressBox.innerHTML = `<p class="account-empty">Bạn chưa có địa chỉ giao hàng.</p>`
            return
        }

        accountAddressBox.innerHTML = `
            <p><strong>${address.name}</strong></p>
            <p>${address.phone}</p>
            <p>${address.detail}, ${address.street}, ${address.ward}, ${address.city}</p>
        `
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(item => item.classList.remove('active'))
            contents.forEach(item => item.classList.remove('active'))

            tab.classList.add('active')
            document.getElementById(tab.dataset.tab).classList.add('active')
        })
    })

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
            console.log(error)
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
            console.log(error)
        }
    }

    citySelect.addEventListener('change', function () {
        wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'

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

        const addressInfo = {
            name: document.getElementById('customerName').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            city: citySelect.options[citySelect.selectedIndex].text,
            ward: wardSelect.value,
            street: streetSelect.value.trim(),
            detail: document.getElementById('detailAddress').value.trim()
        }

        saveAddress(addressInfo)

        addressForm.reset()
        wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'
        addressPopup.classList.remove('active')

        renderAddress()
    })

    logoutBtn.addEventListener('click', function () {
        if (window.medstyleLogout) {
            window.medstyleLogout()
        } else {
            localStorage.removeItem('currentUser')
            window.location.href = './index.html'
        }
    })

    onAuthStateChanged(auth, function (user) {
        if (!user) {
            window.location.href = './login.html'
            return
        }

        currentUserData = {
            uid: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email
        }

        localStorage.setItem('currentUser', JSON.stringify(currentUserData))

        accountHello.innerHTML = `
            Xin chào <strong>${currentUserData.name}</strong>.
            Từ trang quản lý tài khoản bạn có thể xem đơn hàng mới,
            quản lý địa chỉ giao hàng và thông tin tài khoản.
        `

        profileName.textContent = currentUserData.name
        profileEmail.textContent = currentUserData.email

        renderOrders()
        renderCoupons()
        renderAddress()
        loadProvinces()
        bindAdminConfirmButtons()
        bindAdminDoneButtons()
    })
})