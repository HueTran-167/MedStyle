document.addEventListener('DOMContentLoaded', function () {
    const mainImg = document.getElementById('mainProductImage')
    const zoomArea = document.getElementById('zoomArea')
    const thumbs = document.querySelectorAll('.thumb')

    const minusBtn = document.getElementById('minusQty')
    const plusBtn = document.getElementById('plusQty')
    const quantityInput = document.getElementById('quantityInput')
    const addToCartBtn = document.getElementById('addToCartBtn')
    const sizeButtons = document.querySelectorAll('.size-options button')
    const genderButtons = document.querySelectorAll('.gender-btn')
    const sleeveSelect = document.getElementById('sleeveSelect')

    let selectedSize = ''
    let selectedGender = 'Nữ'

    function updateCartCount() {
        const cartIcon = document.querySelector('.nav-shopping')
        if (!cartIcon) return

        let badge = cartIcon.querySelector('.cart-count-badge')

        if (!badge) {
            badge = document.createElement('span')
            badge.className = 'cart-count-badge'
            cartIcon.appendChild(badge)
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || []

        const totalQuantity = cart.reduce(function (total, item) {
            return total + Number(item.quantity || 1)
        }, 0)

        if (totalQuantity > 0) {
            badge.textContent = totalQuantity
            badge.style.display = 'flex'
        } else {
            badge.style.display = 'none'
        }
    }

    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            thumbs.forEach(function (item) {
                item.classList.remove('active')
            })

            thumb.classList.add('active')
            mainImg.src = thumb.src
        })
    })

    genderButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            genderButtons.forEach(function (item) {
                item.classList.remove('active')
            })

            button.classList.add('active')
            selectedGender = button.dataset.gender
            mainImg.src = button.dataset.img
        })
    })

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

    plusBtn.addEventListener('click', function () {
        quantityInput.value = Number(quantityInput.value) + 1
    })

    minusBtn.addEventListener('click', function () {
        if (Number(quantityInput.value) > 1) {
            quantityInput.value = Number(quantityInput.value) - 1
        }
    })

    sizeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            sizeButtons.forEach(function (item) {
                item.classList.remove('active')
            })

            button.classList.add('active')
            selectedSize = button.textContent
        })
    })

    addToCartBtn.addEventListener('click', function () {
        if (!selectedSize) {
            addToCartBtn.textContent = 'VUI LÒNG CHỌN SIZE'
            addToCartBtn.classList.add('cart-warning')

            setTimeout(function () {
                addToCartBtn.textContent = 'THÊM VÀO GIỎ HÀNG'
                addToCartBtn.classList.remove('cart-warning')
            }, 1200)

            return
        }

        const product = {
            name: 'Bộ đồ blouse trắng kĩ thuật viên – MSCool',
            price: 399000,
            image: mainImg.src,
            gender: selectedGender,
            sleeve: sleeveSelect.value,
            size: selectedSize,
            quantity: Number(quantityInput.value)
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || []
        cart.push(product)
        localStorage.setItem('cart', JSON.stringify(cart))

        updateCartCount()
        flyToCart()
    })

    function flyToCart() {
        const cartIcon = document.querySelector('.nav-shopping')
        const productImage = document.getElementById('mainProductImage')

        if (!cartIcon || !productImage) return

        const imgRect = productImage.getBoundingClientRect()
        const cartRect = cartIcon.getBoundingClientRect()

        const flyingImg = document.createElement('img')
        flyingImg.src = productImage.src
        flyingImg.className = 'flying-product-img'

        flyingImg.style.left = imgRect.left + imgRect.width / 2 + 'px'
        flyingImg.style.top = imgRect.top + imgRect.height / 2 + 'px'

        document.body.appendChild(flyingImg)

        setTimeout(function () {
            flyingImg.style.left = cartRect.left + cartRect.width / 2 + 'px'
            flyingImg.style.top = cartRect.top + cartRect.height / 2 + 'px'
            flyingImg.style.width = '24px'
            flyingImg.style.height = '24px'
            flyingImg.style.opacity = '0'
            flyingImg.style.transform = 'translate(-50%, -50%) scale(0.2)'
        }, 20)

        setTimeout(function () {
            flyingImg.remove()
            cartIcon.classList.add('cart-shake')

            setTimeout(function () {
                cartIcon.classList.remove('cart-shake')
            }, 600)
        }, 850)
    }

    updateCartCount()
})