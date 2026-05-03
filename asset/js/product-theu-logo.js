document.addEventListener('DOMContentLoaded', function () {

    const minusBtn = document.getElementById('minusQty')
    const plusBtn = document.getElementById('plusQty')
    const quantityInput = document.getElementById('quantityInput')
    const addToCartBtn = document.getElementById('addToCartBtn')
    const logoNote = document.getElementById('logoNote')

    plusBtn.onclick = () => quantityInput.value++
    minusBtn.onclick = () => {
        if (quantityInput.value > 1) quantityInput.value--
    }

    addToCartBtn.onclick = function () {

        if (logoNote.value.trim() === '') {
            addToCartBtn.textContent = 'NHẬP NỘI DUNG LOGO'
            setTimeout(() => addToCartBtn.textContent = 'THÊM VÀO GIỎ HÀNG', 1200)
            return
        }

        const product = {
            name: 'Thêu logo',
            price: 70000,
            image: './asset/images/DV/TheuLogo.png',
            serviceType: 'Thêu logo',
            note: logoNote.value,
            quantity: Number(quantityInput.value)
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || []
        cart.push(product)
        localStorage.setItem('cart', JSON.stringify(cart))

        window.location.href = './cart.html'
    }

})