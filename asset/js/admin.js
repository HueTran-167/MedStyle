import { auth, db } from './firebase-config.js'
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js'
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    orderBy,
    query
} from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js'

document.addEventListener('DOMContentLoaded', function () {
    const orderList = document.getElementById('adminOrderList')

    // Tối đa 3 email admin
    const ADMIN_EMAILS = [
        'tranthihuetran167@gmail.com',
        'nguyenquynhgiao559@gmail.com',
        'medstyle.vn@gmail.com'
    ]

    function formatPrice(price) {
        return Number(price || 0).toLocaleString('vi-VN') + ',00 ₫'
    }

    function formatDate(timestamp) {
        if (!timestamp) return 'Chưa cập nhật'

        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleString('vi-VN')
    }

    function renderItemOptions(item) {
        return `
            ${item.gender ? `<p>Phân loại: ${item.gender}</p>` : ''}
            ${item.color ? `<p>Màu: ${item.color}</p>` : ''}
            ${item.sleeve ? `<p>Tay áo: ${item.sleeve}</p>` : ''}
            ${item.size ? `<p>Size: ${item.size}</p>` : ''}
            ${item.serviceType ? `<p>Dịch vụ: ${item.serviceType}</p>` : ''}
            ${item.note ? `<p>Ghi chú: ${item.note}</p>` : ''}
        `
    }

    async function loadOrders() {
        orderList.innerHTML = '<p class="account-empty">Đang tải đơn hàng...</p>'

        try {
            const q = query(
                collection(db, 'orders'),
                orderBy('createdAt', 'desc')
            )

            const snapshot = await getDocs(q)

            if (snapshot.empty) {
                orderList.innerHTML = '<p class="account-empty">Chưa có đơn hàng nào.</p>'
                return
            }

            orderList.innerHTML = ''

            snapshot.forEach(function (docSnap) {
                const order = docSnap.data()
                const orderId = docSnap.id

                const orderDiv = document.createElement('div')
                orderDiv.className = 'account-order'

                orderDiv.innerHTML = `
                    <div class="account-order-head">
                        <div>
                            <strong>Mã đơn: ${orderId}</strong>
                            <p>${formatDate(order.createdAt)}</p>
                        </div>

                        <span>Trạng thái: ${order.status || 'pending'}</span>
                    </div>

                    <div class="account-profile-box">
                        <p><strong>Khách hàng:</strong> ${order.customer?.name || 'Chưa có tên'}</p>
                        <p><strong>Email:</strong> ${order.customer?.email || 'Chưa có email'}</p>
                        <p><strong>SĐT:</strong> ${order.address?.phone || 'Chưa có số điện thoại'}</p>
                        <p>
                            <strong>Địa chỉ:</strong>
                            ${order.address?.detail || ''},
                            ${order.address?.street || ''},
                            ${order.address?.ward || ''},
                            ${order.address?.city || ''}
                        </p>
                    </div>

                    ${(order.items || []).map(function (item) {
                        return `
                            <div class="account-order-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div>
                                    <h4>${item.name}</h4>
                                    <p>Số lượng: ${item.quantity}</p>
                                    ${renderItemOptions(item)}
                                </div>
                                <strong>${formatPrice(Number(item.price) * Number(item.quantity))}</strong>
                            </div>
                        `
                    }).join('')}

                    ${order.paymentProof ? `
                        <p>
                            <strong>Minh chứng thanh toán:</strong>
                            <a href="${order.paymentProof}" target="_blank">Xem ảnh</a>
                        </p>
                    ` : `
                        <p><strong>Minh chứng thanh toán:</strong> Chưa có</p>
                    `}

                    <div class="account-order-total">
                        <p>Tạm tính: <strong>${formatPrice(order.subtotal)}</strong></p>
                        <p>Phí ship: <strong>${formatPrice(order.shipping)}</strong></p>
                        <p>Giảm giá: <strong>${formatPrice(order.discount)}</strong></p>
                        <p>Tổng đơn hàng: <strong>${formatPrice(order.total)}</strong></p>
                    </div>

                    <div style="margin-top: 14px;">
                        <label><strong>Cập nhật trạng thái:</strong></label>
                        <select class="statusSelect" data-id="${orderId}">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="shipping" ${order.status === 'shipping' ? 'selected' : ''}>Shipping</option>
                            <option value="done" ${order.status === 'done' ? 'selected' : ''}>Done</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                `

                orderList.appendChild(orderDiv)
            })

            bindStatusChange()
        } catch (error) {
            console.log(error)

            orderList.innerHTML = `
                <p class="account-empty">
                    Không tải được đơn hàng. Kiểm tra lại quyền Firebase hoặc index Firestore.
                </p>
            `
        }
    }

    function bindStatusChange() {
        document.querySelectorAll('.statusSelect').forEach(function (select) {
            select.addEventListener('change', async function () {
                const orderId = select.dataset.id
                const newStatus = select.value

                try {
                    await updateDoc(doc(db, 'orders', orderId), {
                        status: newStatus
                    })

                    alert('Đã cập nhật trạng thái đơn hàng!')
                    loadOrders()
                } catch (error) {
                    console.log(error)
                    alert('Không cập nhật được trạng thái!')
                }
            })
        })
    }

    onAuthStateChanged(auth, function (user) {
        if (!user) {
            alert('Bạn cần đăng nhập trước!')
            window.location.href = './login.html'
            return
        }

        if (!ADMIN_EMAILS.includes(user.email)) {
            alert('Bạn không có quyền truy cập trang Admin!')
            window.location.href = './index.html'
            return
        }

        loadOrders()
    })
})