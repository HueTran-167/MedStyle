import { auth } from './firebase-config.js'
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js'

document.addEventListener('DOMContentLoaded', function () {
    const userBtn = document.querySelector('.js-ti-user')
    const navLinks = document.querySelectorAll('.header-menu .nav a')
    const cartBtn = document.querySelector('.nav-shopping')
    const searchInput = document.getElementById('Search')
    const searchForm = document.querySelector('.search-form')

    const searchProducts = [
        'Blouse MSCool',
        'Blouse Plus',
        'Blouse Vest',
        'Blouse Điều Dưỡng',
        'Blouse Kĩ Thuật Viên',
        'Scrubs MSCool',
        'Scrubs Plus',
        'Thêu tên',
        'In logo',
        'Thêu logo',
        'May đo'
    ]

    function getUserKey(prefix) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (!currentUser || !currentUser.email) return null
        return prefix + '_' + currentUser.email
    }

    function goLogin() {
        window.location.href = './login.html'
    }

    function saveSearchHistory(keyword) {
        if (!keyword) return

        let history = JSON.parse(localStorage.getItem('searchHistory')) || []

        history = history.filter(item => item.toLowerCase() !== keyword.toLowerCase())
        history.unshift(keyword)

        if (history.length > 8) history = history.slice(0, 8)

        localStorage.setItem('searchHistory', JSON.stringify(history))
    }

    function goSearch(keyword) {
        keyword = keyword.trim()

        if (!keyword) {
            alert('Vui lòng nhập từ khóa tìm kiếm!')
            return
        }

        saveSearchHistory(keyword)
        window.location.href = './search.html?q=' + encodeURIComponent(keyword)
    }

    function createSearchDropdown() {
        if (!searchInput) return

        const wrapper = searchInput.closest('.search-form') || searchInput.parentElement
        wrapper.style.position = 'relative'

        const dropdown = document.createElement('div')
        dropdown.className = 'search-suggest-box'
        dropdown.style.display = 'none'

        wrapper.appendChild(dropdown)

        function renderDropdown() {
            const keyword = searchInput.value.trim().toLowerCase()
            const history = JSON.parse(localStorage.getItem('searchHistory')) || []

            let suggestions = []

            if (keyword) {
                suggestions = searchProducts.filter(item =>
                    item.toLowerCase().includes(keyword)
                )
            } else {
                suggestions = history
            }

            if (suggestions.length === 0) {
                dropdown.style.display = 'none'
                return
            }

            dropdown.innerHTML = suggestions.map(item => `
                <div class="search-suggest-item" data-keyword="${item}">
                    <i class="${keyword ? 'ti-search' : 'ti-time'}"></i>
                    <span>${item}</span>
                </div>
            `).join('')

            dropdown.style.display = 'block'
        }

        searchInput.addEventListener('focus', renderDropdown)
        searchInput.addEventListener('input', renderDropdown)

        dropdown.addEventListener('click', function (event) {
            const item = event.target.closest('.search-suggest-item')
            if (!item) return

            const keyword = item.dataset.keyword
            searchInput.value = keyword
            goSearch(keyword)
        })

        document.addEventListener('click', function (event) {
            if (!wrapper.contains(event.target)) {
                dropdown.style.display = 'none'
            }
        })
    }

    function updateCartCountGlobal() {
        const cartIcon = document.querySelector('.nav-shopping')
        if (!cartIcon) return

        let badge = cartIcon.querySelector('.cart-count-badge')

        if (!badge) {
            badge = document.createElement('span')
            badge.className = 'cart-count-badge'
            cartIcon.appendChild(badge)
        }

        const userKey = getUserKey('cart')
        const cart = userKey ? JSON.parse(localStorage.getItem(userKey)) || [] : []

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

    function checkLoginBeforeGo(event) {
        const href = event.currentTarget.getAttribute('href')

        if (!href || href === '' || href === '#') return

        const isHome = href.includes('index.html')
        const isLoginPage = href.includes('login.html') || href.includes('register.html')
        const isSearchPage = href.includes('search.html')

        if (isHome || isLoginPage || isSearchPage) return

        if (!auth.currentUser) {
            event.preventDefault()
            localStorage.setItem('redirectAfterLogin', href)
            alert('Bạn cần đăng nhập trước khi truy cập trang này!')
            window.location.href = './login.html'
        }
    }

    onAuthStateChanged(auth, function (user) {
        if (user) {
            const currentUser = {
                uid: user.uid,
                name: user.displayName || user.email.split('@')[0],
                email: user.email
            }

            localStorage.setItem('currentUser', JSON.stringify(currentUser))

            if (userBtn) {
                userBtn.classList.remove('ti-user')
                userBtn.textContent = currentUser.name
                userBtn.classList.add('user-logged')
            }
        } else {
            localStorage.removeItem('currentUser')

            if (userBtn) {
                userBtn.textContent = ''
                userBtn.classList.add('ti-user')
                userBtn.classList.remove('user-logged')
            }
        }

        updateCartCountGlobal()
    })

    if (userBtn) {
        userBtn.addEventListener('click', function () {
            if (auth.currentUser) {
                window.location.href = './account.html'
            } else {
                goLogin()
            }
        })
    }

    navLinks.forEach(link => link.addEventListener('click', checkLoginBeforeGo))

    if (cartBtn) {
        cartBtn.addEventListener('click', checkLoginBeforeGo)
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault()
            goSearch(searchInput.value)
        })
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault()
                goSearch(searchInput.value)
            }
        })
    }

    createSearchDropdown()

    window.medstyleLogout = async function () {
        localStorage.removeItem('currentUser')

        await signOut(auth)

        updateCartCountGlobal()
        window.location.href = './index.html'
    }
})