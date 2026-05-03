document.addEventListener('DOMContentLoaded', function () {
    function getUserKey(prefix) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))

        if (!currentUser || !currentUser.email) {
            alert('Bạn cần đăng nhập!')
            window.location.href = './login.html'
            return null
        }

        return prefix + '_' + currentUser.email
    }

    const minusBtn = document.getElementById('minusQty')
    const plusBtn = document.getElementById('plusQty')
    const quantityInput = document.getElementById('quantityInput')
    const addToCartBtn = document.getElementById('addToCartBtn')
    const measureNote = document.getElementById('measureNote')

    plusBtn.onclick = () => quantityInput.value++

    minusBtn.onclick = () => {
        if (Number(quantityInput.value) > 1) {
            quantityInput.value--
        }
    }

    addToCartBtn.onclick = function () {
        const key = getUserKey('cart')
        if (!key) return

        if (measureNote.value.trim() === '') {
            addToCartBtn.textContent = 'NHẬP SỐ ĐO'
            setTimeout(() => addToCartBtn.textContent = 'THÊM VÀO GIỎ HÀNG', 1200)
            return
        }

        const product = {
            name: 'May đo theo số đo',
            price: 0,
            image: './asset/images/DV/may-do.png',
            serviceType: 'May đo',
            note: measureNote.value.trim(),
            quantity: Number(quantityInput.value)
        }

        const cart = JSON.parse(localStorage.getItem(key)) || []
        cart.push(product)
        localStorage.setItem(key, JSON.stringify(cart))

        window.location.href = './cart.html'
    }
})