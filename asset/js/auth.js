document.addEventListener('DOMContentLoaded', function () {
    const userBtn = document.querySelector('.js-ti-user')
    const navLinks = document.querySelectorAll('.header-menu .nav a')
    const cartBtn = document.querySelector('.nav-shopping')
    const searchInput = document.getElementById('Search')

    const currentUser = JSON.parse(localStorage.getItem('currentUser'))

    /* ================= USER LOGIN STATUS ================= */

    if (currentUser && userBtn) {
        userBtn.classList.remove('ti-user')
        userBtn.textContent = currentUser.email.split('@')[0]
        userBtn.classList.add('user-logged')
    }

    function goLogin() {
        window.location.href = './login.html'
    }

    function checkLoginBeforeGo(event) {
        const href = event.currentTarget.getAttribute('href')

        if (!href || href === '' || href === '#') return

        const isHome =
            href === 'index.html' ||
            href === './index.html' ||
            href.includes('index.html')

        const isLoginPage =
            href.includes('login.html') ||
            href.includes('register.html')

        const isSearchPage =
            href.includes('search.html')

        if (isHome || isLoginPage || isSearchPage) return

        const isLoggedIn = localStorage.getItem('currentUser')

        if (!isLoggedIn) {
            event.preventDefault()
            localStorage.setItem('redirectAfterLogin', href)
            alert('Bạn cần đăng nhập trước khi truy cập trang này!')
            window.location.href = './login.html'
        }
    }

    if (userBtn) {
        userBtn.addEventListener('click', function () {
            if (localStorage.getItem('currentUser')) {
                window.location.href = './account.html'
            } else {
                goLogin()
            }
        })
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', checkLoginBeforeGo)
    })

    if (cartBtn) {
        cartBtn.addEventListener('click', checkLoginBeforeGo)
    }

    /* ================= SEARCH ================= */

    if (searchInput) {
        searchInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                const keyword = searchInput.value.trim()

                if (keyword === '') {
                    event.preventDefault()
                    alert('Vui lòng nhập từ khóa tìm kiếm!')
                    return
                }

                event.preventDefault()
                window.location.href = './search.html?q=' + encodeURIComponent(keyword)
            }
        })
    }

    /* ================= CART COUNT BADGE ================= */

    function updateCartCountGlobal() {
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

    updateCartCountGlobal()
})