document.addEventListener('DOMContentLoaded', function () {
    const categoryTitles = document.querySelectorAll('.category-title')
    const filterCategories = document.querySelectorAll('.filter-category')
    const showAllProducts = document.getElementById('showAllProducts')

    const priceRange = document.getElementById('priceRange')
    const priceValue = document.getElementById('priceValue')
    const filterPriceBtn = document.getElementById('filterPriceBtn')
    const productGrid = document.querySelector('.product-grid')
    const productCards = Array.from(document.querySelectorAll('.product-card'))
    const sortProducts = document.getElementById('sortProducts')

    let currentCategory = 'all'
    let currentMaxPrice = Number(priceRange?.value || 729000)

    categoryTitles.forEach(function (title) {
        title.addEventListener('click', function () {
            const categoryItem = title.closest('.category-item')
            categoryItem.classList.toggle('open')
        })
    })

    function formatPrice(price) {
        return Number(price).toLocaleString('vi-VN')
    }

    function filterProducts() {
        productCards.forEach(function (card) {
            const productPrice = Number(card.dataset.price)
            const productCategory = card.dataset.category

            const matchPrice = productPrice <= currentMaxPrice
            const matchCategory =
                currentCategory === 'all' ||
                productCategory === currentCategory

            if (matchPrice && matchCategory) {
                card.classList.remove('hide')
            } else {
                card.classList.add('hide')
            }
        })
    }

    function sortProductCards(type) {
        let sortedCards = [...productCards]

        if (type === 'newest') {
            sortedCards.reverse()
        }

        if (type === 'price-asc') {
            sortedCards.sort(function (a, b) {
                return Number(a.dataset.price) - Number(b.dataset.price)
            })
        }

        if (type === 'price-desc') {
            sortedCards.sort(function (a, b) {
                return Number(b.dataset.price) - Number(a.dataset.price)
            })
        }

        if (type === 'default') {
            sortedCards = [...productCards]
        }

        sortedCards.forEach(function (card) {
            productGrid.appendChild(card)
        })

        filterProducts()
    }

    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function () {
            currentMaxPrice = Number(priceRange.value)
            priceValue.textContent = formatPrice(currentMaxPrice)
        })
    }

    if (filterPriceBtn) {
        filterPriceBtn.addEventListener('click', function () {
            currentMaxPrice = Number(priceRange.value)
            filterProducts()
        })
    }

    filterCategories.forEach(function (item) {
        item.addEventListener('click', function () {
            currentCategory = item.dataset.filter
            filterProducts()
        })
    })

    if (showAllProducts) {
        showAllProducts.addEventListener('click', function () {
            currentCategory = 'all'
            currentMaxPrice = Number(priceRange.max)

            priceRange.value = currentMaxPrice
            priceValue.textContent = formatPrice(currentMaxPrice)

            if (sortProducts) {
                sortProducts.value = 'default'
            }

            sortProductCards('default')
        })
    }

    if (sortProducts) {
        sortProducts.addEventListener('change', function () {
            sortProductCards(sortProducts.value)
        })
    }
})