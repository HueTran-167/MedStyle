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
    const logoNote = document.getElementById('logoNote')

    plusBtn.onclick = () => quantityInput.value++

    minusBtn.onclick = () => {
        if (Number(quantityInput.value) > 1) {
            quantityInput.value--
        }
    }

    addToCartBtn.onclick = function () {
        const key = getUserKey('cart')
        if (!key) return

        if (logoNote.value.trim() === '') {
            addToCartBtn.textContent = 'NHẬP NỘI DUNG LOGO'
            setTimeout(() => addToCartBtn.textContent = 'THÊM VÀO GIỎ HÀNG', 1200)
            return
        }

        const product = {
            name: 'Thêu logo',
            price: 70000,
            image: './asset/images/DV/theu-logo.png',
            serviceType: 'Thêu logo',
            note: logoNote.value.trim(),
            quantity: Number(quantityInput.value)
        }

        const cart = JSON.parse(localStorage.getItem(key)) || []
        cart.push(product)
        localStorage.setItem(key, JSON.stringify(cart))

        window.location.href = './cart.html'
    }
})