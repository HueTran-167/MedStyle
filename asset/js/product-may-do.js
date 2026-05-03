document.addEventListener('DOMContentLoaded', function () {

    const minusBtn = document.getElementById('minusQty')
    const plusBtn = document.getElementById('plusQty')
    const quantityInput = document.getElementById('quantityInput')
    const addToCartBtn = document.getElementById('addToCartBtn')
    const measureNote = document.getElementById('measureNote')

    plusBtn.onclick = () => quantityInput.value++
    minusBtn.onclick = () => {
        if (quantityInput.value > 1) quantityInput.value--
    }

    addToCartBtn.onclick = function () {

        if (measureNote.value.trim() === '') {
            addToCartBtn.textContent = 'NHẬP SỐ ĐO'
            setTimeout(() => addToCartBtn.textContent = 'THÊM VÀO GIỎ HÀNG', 1200)
            return
        }

        const product = {
            name: 'May đo theo số đo',
            price: 0,
            image: './asset/images/DV/MayDo.png',
            serviceType: 'May đo',
            note: measureNote.value,
            quantity: Number(quantityInput.value)
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || []
        cart.push(product)
        localStorage.setItem('cart', JSON.stringify(cart))

        window.location.href = './cart.html'
    }

})