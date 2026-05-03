// document.addEventListener('DOMContentLoaded', function () {
//     const checkoutEmail = document.getElementById('checkoutEmail')
//     const savedAddressBox = document.getElementById('savedAddressBox')
//     const savedAddressText = document.getElementById('savedAddressText')
//     const editAddressBtn = document.getElementById('editAddressBtn')
//     const checkoutItems = document.getElementById('checkoutItems')
//     const checkoutSubtotal = document.getElementById('checkoutSubtotal')
//     const checkoutTotal = document.getElementById('checkoutTotal')
//     const checkoutShippingText = document.getElementById('checkoutShippingText')
//     const placeOrderBtn = document.getElementById('placeOrderBtn')

//     const paymentOptions = document.querySelectorAll('.checkout-payment')
//     const paymentInputs = document.querySelectorAll('input[name="payment"]')
//     const paymentPopup = document.getElementById('paymentPopup')
//     const paymentDoneBtn = document.getElementById('paymentDoneBtn')
//     const paymentCancelBtn = document.getElementById('paymentCancelBtn')

//     const addressPopup = document.getElementById('addressPopup')
//     const closeAddressPopup = document.getElementById('closeAddressPopup')
//     const addressForm = document.getElementById('addressForm')
//     const citySelect = document.getElementById('citySelect')
//     const wardSelect = document.getElementById('wardSelect')
//     const streetSelect = document.getElementById('streetSelect')

//     const orderPopup = document.getElementById('orderPopup')
//     const orderOkBtn = document.getElementById('orderOkBtn')

//     const shippingFee = 20000
//     const couponApplied = localStorage.getItem('cartCouponApplied') === 'true'

//     function formatPrice(price) {
//         return Number(price).toLocaleString('vi-VN') + ',00 ₫'
//     }

//     function getCart() {
//         return JSON.parse(localStorage.getItem('cart')) || []
//     }

//     function getCurrentUser() {
//         return JSON.parse(localStorage.getItem('currentUser'))
//     }

//     function getCurrentUserEmail() {
//         const user = getCurrentUser()
//         return user ? user.email : 'guest'
//     }

//     function getCouponKey() {
//         return 'newUserCouponUsed_' + getCurrentUserEmail()
//     }

//     function getAddress() {
//         return JSON.parse(localStorage.getItem('shippingAddress'))
//     }

//     function getSelectedPayment() {
//         const checked = document.querySelector('input[name="payment"]:checked')
//         return checked ? checked.value : 'cod'
//     }

//     function getProductKey(item) {
//         return [
//             item.name || '',
//             item.price || '',
//             item.gender || '',
//             item.color || '',
//             item.sleeve || '',
//             item.size || ''
//         ].join('|').toLowerCase()
//     }

//     function mergeCart() {
//         const cart = getCart()
//         const merged = []

//         cart.forEach(function (item) {
//             const existed = merged.find(function (product) {
//                 return getProductKey(product) === getProductKey(item)
//             })

//             if (existed) {
//                 existed.quantity = Number(existed.quantity || 1) + Number(item.quantity || 1)
//             } else {
//                 merged.push({
//                     ...item,
//                     quantity: Number(item.quantity || 1)
//                 })
//             }
//         })

//         localStorage.setItem('cart', JSON.stringify(merged))
//         return merged
//     }

//     function getSubtotal() {
//         return getCart().reduce(function (total, item) {
//             return total + Number(item.price) * Number(item.quantity)
//         }, 0)
//     }

//     function renderEmail() {
//         const user = getCurrentUser()
//         checkoutEmail.value = user && user.email ? user.email : ''
//     }

//     function renderAddress() {
//         const address = getAddress()

//         if (!address) {
//             savedAddressBox.classList.add('empty')
//             savedAddressText.innerHTML = `
//                 <strong>Chưa có địa chỉ giao hàng</strong><br>
//                 Vui lòng thêm địa chỉ trước khi đặt hàng.
//             `
//             checkoutShippingText.textContent = 'Giao hàng đến Việt Nam'
//             return
//         }

//         savedAddressBox.classList.remove('empty')
//         savedAddressText.innerHTML = `
//             <strong>${address.name}</strong><br>
//             ${address.detail}, ${address.street}, ${address.ward}, ${address.city}<br>
//             ${address.phone}
//         `
//         checkoutShippingText.textContent = `Giao hàng đến ${address.ward}, ${address.city}`
//     }

//     function renderOrder() {
//         const cart = mergeCart()
//         checkoutItems.innerHTML = ''

//         if (cart.length === 0) {
//             checkoutItems.innerHTML = `<p class="checkout-empty">Không có sản phẩm trong đơn hàng.</p>`
//             checkoutSubtotal.textContent = formatPrice(0)
//             checkoutTotal.textContent = formatPrice(0)
//             return
//         }

//         cart.forEach(function (item) {
//             const itemEl = document.createElement('div')
//             itemEl.className = 'checkout-item'

//             itemEl.innerHTML = `
//                 <div class="checkout-item-img">
//                     <img src="${item.image}" alt="${item.name}">
//                     <span>${item.quantity}</span>
//                 </div>

//                 <div class="checkout-item-info">
//                     <h4>${item.name}</h4>
//                     <p>${formatPrice(item.price)}</p>
//                     <small>
//                         ${item.gender ? 'Phân loại: ' + item.gender + '<br>' : ''}
//                         ${item.color ? 'Màu: ' + item.color + '<br>' : ''}
//                         ${item.sleeve ? 'Tay áo: ' + item.sleeve + '<br>' : ''}
//                         ${item.size ? 'Size: ' + item.size : ''}
//                     </small>
//                 </div>

//                 <strong>${formatPrice(item.price * item.quantity)}</strong>
//             `

//             checkoutItems.appendChild(itemEl)
//         })

//         const subtotal = getSubtotal()
//         const discount = couponApplied ? subtotal * 0.1 : 0
//         const total = subtotal - discount + shippingFee

//         checkoutSubtotal.textContent = formatPrice(subtotal)
//         checkoutTotal.textContent = formatPrice(total)
//     }

//     async function loadProvinces() {
//         try {
//             citySelect.innerHTML = '<option value="">Chọn Tỉnh/Thành phố</option>'

//             const response = await fetch('https://provinces.open-api.vn/api/p/')
//             const provinces = await response.json()

//             provinces.forEach(function (province) {
//                 const option = document.createElement('option')
//                 option.value = province.code
//                 option.textContent = province.name
//                 citySelect.appendChild(option)
//             })
//         } catch (error) {
//             console.log('Không tải được danh sách tỉnh/thành phố:', error)
//         }
//     }

//     async function loadWards(provinceCode) {
//         try {
//             wardSelect.innerHTML = '<option value="">Đang tải Phường/Xã...</option>'

//             const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=3`)
//             const province = await response.json()

//             wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'

//             province.districts.forEach(function (district) {
//                 district.wards.forEach(function (ward) {
//                     const option = document.createElement('option')
//                     option.value = ward.name + ' - ' + district.name
//                     option.textContent = ward.name + ' - ' + district.name
//                     wardSelect.appendChild(option)
//                 })
//             })
//         } catch (error) {
//             wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'
//             console.log('Không tải được danh sách phường/xã:', error)
//         }
//     }

//     function completeOrder() {
//         const currentUser = getCurrentUser()
//         const cart = getCart()
//         const subtotal = getSubtotal()
//         const discount = couponApplied ? subtotal * 0.1 : 0
//         const total = subtotal - discount + shippingFee

//         if (currentUser) {
//             const orderKey = 'orders_' + currentUser.email
//             const oldOrders = JSON.parse(localStorage.getItem(orderKey)) || []

//             const newOrder = {
//                 id: 'MS' + Date.now(),
//                 date: new Date().toLocaleDateString('vi-VN'),
//                 items: cart,
//                 subtotal: subtotal,
//                 discount: discount,
//                 shipping: shippingFee,
//                 total: total,
//                 payment: getSelectedPayment(),
//                 address: getAddress()
//             }

//             oldOrders.unshift(newOrder)
//             localStorage.setItem(orderKey, JSON.stringify(oldOrders))
//         }

//         if (couponApplied) {
//             localStorage.setItem(getCouponKey(), 'true')
//         }

//         localStorage.removeItem('cart')
//         localStorage.removeItem('cartCouponApplied')

//         if (paymentPopup) {
//             paymentPopup.classList.remove('active')
//         }

//         orderPopup.classList.add('active')
//     }

//     if (citySelect) {
//         citySelect.addEventListener('change', function () {
//             wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'

//             if (citySelect.value) {
//                 loadWards(citySelect.value)
//             }
//         })
//     }

//     paymentInputs.forEach(function (input) {
//         input.addEventListener('change', function () {
//             paymentOptions.forEach(function (option) {
//                 option.classList.remove('active')
//             })

//             input.closest('.checkout-payment').classList.add('active')
//         })
//     })

//     if (placeOrderBtn) {
//         placeOrderBtn.addEventListener('click', function () {
//             const cart = getCart()
//             const address = getAddress()

//             if (cart.length === 0) {
//                 alert('Không có sản phẩm để đặt hàng!')
//                 return
//             }

//             if (!address) {
//                 addressPopup.classList.add('active')
//                 return
//             }

//             if (getSelectedPayment() === 'bank') {
//                 paymentPopup.classList.add('active')
//             } else {
//                 completeOrder()
//             }
//         })
//     }

//     if (paymentDoneBtn) {
//         paymentDoneBtn.addEventListener('click', function () {
//             const proofInput = document.getElementById('paymentProof')

//             if (proofInput && proofInput.files.length === 0) {
//                 alert('Vui lòng tải lên minh chứng thanh toán!')
//                 return
//             }

//             completeOrder()
//         })
//     }

//     if (paymentCancelBtn) {
//         paymentCancelBtn.addEventListener('click', function () {
//             paymentPopup.classList.remove('active')
//         })
//     }

//     if (orderOkBtn) {
//         orderOkBtn.addEventListener('click', function () {
//             orderPopup.classList.remove('active')
//             window.location.href = './account.html'
//         })
//     }

//     if (editAddressBtn) {
//         editAddressBtn.addEventListener('click', function () {
//             addressPopup.classList.add('active')
//         })
//     }

//     if (closeAddressPopup) {
//         closeAddressPopup.addEventListener('click', function () {
//             addressPopup.classList.remove('active')
//         })
//     }

//     if (addressPopup) {
//         addressPopup.addEventListener('click', function (event) {
//             if (event.target === addressPopup) {
//                 addressPopup.classList.remove('active')
//             }
//         })
//     }

//     if (addressForm) {
//         addressForm.addEventListener('submit', function (event) {
//             event.preventDefault()

//             const cityText = citySelect.options[citySelect.selectedIndex].text
//             const wardText = wardSelect.value
//             const streetText = streetSelect.value.trim()
//             const detailText = document.getElementById('detailAddress').value.trim()

//             const addressInfo = {
//                 name: document.getElementById('customerName').value.trim(),
//                 phone: document.getElementById('customerPhone').value.trim(),
//                 city: cityText,
//                 ward: wardText,
//                 street: streetText,
//                 detail: detailText
//             }

//             localStorage.setItem('shippingAddress', JSON.stringify(addressInfo))

//             addressForm.reset()
//             wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>'
//             addressPopup.classList.remove('active')
//             renderAddress()
//         })
//     }

//     renderEmail()
//     renderAddress()
//     renderOrder()
//     loadProvinces()
// })

import { auth, db, storage } from './firebase-config.js'
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js'
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js'

document.addEventListener('DOMContentLoaded', function () {
    const placeOrderBtn = document.getElementById('placeOrderBtn')
    const paymentProofInput = document.getElementById('paymentProof')

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'))
    }

    function getUserKey(prefix) {
        const currentUser = getCurrentUser()
        if (!currentUser || !currentUser.email) return null
        return prefix + '_' + currentUser.email
    }

    function getCouponKey() {
        const currentUser = getCurrentUser()
        if (!currentUser || !currentUser.email) return null
        return 'newUserCouponUsed_' + currentUser.email
    }

    function getCart() {
        const key = getUserKey('cart')
        if (!key) return []
        return JSON.parse(localStorage.getItem(key)) || []
    }

    function getAddress() {
        const key = getUserKey('address')
        if (!key) return null
        return JSON.parse(localStorage.getItem(key))
    }

    function removeCart() {
        const key = getUserKey('cart')
        if (key) localStorage.removeItem(key)
    }

    placeOrderBtn.addEventListener('click', async function () {
        const user = auth.currentUser
        const currentUser = getCurrentUser()

        if (!user || !currentUser) {
            alert('Bạn cần đăng nhập!')
            window.location.href = './login.html'
            return
        }

        const cart = getCart()
        const address = getAddress()

        if (cart.length === 0) {
            alert('Giỏ hàng trống!')
            return
        }

        if (!address) {
            alert('Vui lòng nhập địa chỉ giao hàng!')
            return
        }

        placeOrderBtn.disabled = true
        placeOrderBtn.textContent = 'ĐANG XỬ LÝ...'

        try {
            let proofURL = ''

            if (paymentProofInput && paymentProofInput.files.length > 0) {
                const file = paymentProofInput.files[0]
                const storageRef = ref(
                    storage,
                    'paymentProofs/' + user.uid + '/' + Date.now() + '_' + file.name
                )

                const snapshot = await uploadBytes(storageRef, file)
                proofURL = await getDownloadURL(snapshot.ref)
            }

            const subtotal = cart.reduce(function (total, item) {
                return total + Number(item.price) * Number(item.quantity)
            }, 0)

            const shipping = 20000
            const couponApplied = localStorage.getItem('cartCouponApplied') === 'true'
            const discount = couponApplied ? subtotal * 0.1 : 0
            const total = subtotal + shipping - discount

            await addDoc(collection(db, 'orders'), {
                userId: user.uid,
                customer: {
                    name: currentUser.name || user.displayName || '',
                    email: user.email
                },
                address: address,
                items: cart,
                subtotal: subtotal,
                shipping: shipping,
                discount: discount,
                total: total,
                couponApplied: couponApplied,
                paymentProof: proofURL,
                status: 'pending',
                createdAt: serverTimestamp()
            })

            if (couponApplied) {
                const couponKey = getCouponKey()
                if (couponKey) localStorage.setItem(couponKey, 'true')
            }

            localStorage.setItem('cartCouponApplied', 'false')
            removeCart()

            alert('Đặt hàng thành công!')
            window.location.href = './account.html'
        } catch (error) {
            console.log(error)
            alert('Đặt hàng thất bại. Vui lòng thử lại!')
            placeOrderBtn.disabled = false
            placeOrderBtn.textContent = 'ĐẶT HÀNG'
        }
    })
})