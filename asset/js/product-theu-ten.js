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

    const mainImg = document.getElementById('mainProductImage')
    const zoomArea = document.getElementById('zoomArea')
    const thumbs = document.querySelectorAll('.thumb')

    const minusBtn = document.getElementById('minusQty')
    const plusBtn = document.getElementById('plusQty')
    const quantityInput = document.getElementById('quantityInput')
    const addToCartBtn = document.getElementById('addToCartBtn')

    const serviceButtons = document.querySelectorAll('.service-btn')
    const detailPrice = document.getElementById('detailPrice')
    const embroideryNote = document.getElementById('embroideryNote')

    let selectedType = '1 - 2 chữ'
    let selectedPrice = 15000

    function formatPrice(price) {
        return Number(price).toLocaleString('vi-VN') + ',00 ₫'
    }

    serviceButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault()

            serviceButtons.forEach(item => item.classList.remove('active'))
            button.classList.add('active')

            selectedType = button.getAttribute('data-type')
            selectedPrice = Number(button.getAttribute('data-price'))

            detailPrice.textContent = formatPrice(selectedPrice)
        })
    })

    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            thumbs.forEach(item => item.classList.remove('active'))
            thumb.classList.add('active')
            mainImg.src = thumb.src
        })
    })

    if (zoomArea) {
        zoomArea.addEventListener('mousemove', function (event) {
            const rect = zoomArea.getBoundingClientRect()
            const x = ((event.clientX - rect.left) / rect.width) * 100
            const y = ((event.clientY - rect.top) / rect.height) * 100

            mainImg.style.transformOrigin = x + '% ' + y + '%'
            mainImg.style.transform = 'scale(1.8)'
        })

        zoomArea.addEventListener('mouseleave', function () {
            mainImg.style.transformOrigin = 'center center'
            mainImg.style.transform = 'scale(1)'
        })
    }

    plusBtn.addEventListener('click', function () {
        quantityInput.value = Number(quantityInput.value) + 1
    })

    minusBtn.addEventListener('click', function () {
        if (Number(quantityInput.value) > 1) {
            quantityInput.value = Number(quantityInput.value) - 1
        }
    })

    addToCartBtn.addEventListener('click', function () {
        const key = getUserKey('cart')
        if (!key) return

        if (embroideryNote.value.trim() === '') {
            addToCartBtn.textContent = 'VUI LÒNG NHẬP NỘI DUNG THÊU'
            addToCartBtn.classList.add('cart-warning')

            setTimeout(function () {
                addToCartBtn.textContent = 'THÊM VÀO GIỎ HÀNG'
                addToCartBtn.classList.remove('cart-warning')
            }, 1500)

            return
        }

        const product = {
            name: 'Thêu tên lên sản phẩm',
            price: selectedPrice,
            image: mainImg.src,
            serviceType: selectedType,
            note: embroideryNote.value.trim(),
            quantity: Number(quantityInput.value)
        }

        const cart = JSON.parse(localStorage.getItem(key)) || []
        cart.push(product)
        localStorage.setItem(key, JSON.stringify(cart))

        window.location.href = './cart.html'
    })
})