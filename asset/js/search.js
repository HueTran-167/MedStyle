document.addEventListener('DOMContentLoaded', function () {
    const searchKeyword = document.getElementById('searchKeyword')
    const searchResult = document.getElementById('searchResult')
    const searchEmpty = document.getElementById('searchEmpty')

    const params = new URLSearchParams(window.location.search)
    const keyword = (params.get('q') || '').trim().toLowerCase()

    searchKeyword.textContent = keyword || '...'

    const products = [
        {
            name: 'ÁO BLOUSE TRẮNG BÁC SĨ BASIC – MSCool',
            category: 'BLOUSE BÁC SĨ',
            price: '379.000,00 ₫',
            image: './asset/images/Store/Blouse_MSCool.png',
            link: './product-blouse-mscool.html',
            keywords: 'blouse blouse bác sĩ bac si mscool áo blouse trắng basic'
        },
        {
            name: 'ÁO BLOUSE PLUS BÁC SĨ',
            category: 'BLOUSE BÁC SĨ',
            price: '499.000,00 ₫',
            image: './asset/images/Store/BL_PL.png',
            link: './product-blouse-plus.html',
            keywords: 'blouse plus bác sĩ bac si áo blouse'
        },
        {
            name: 'ÁO BLOUSE TRẮNG BÁC SĨ VESTON',
            category: 'BLOUSE BÁC SĨ',
            price: '729.000,00 ₫',
            image: './asset/images/Store/BL_V.png',
            link: './product-blouse-vest.html',
            keywords: 'blouse vest veston bác sĩ bac si áo blouse trắng'
        },
        {
            name: 'BLOUSE TRẮNG ĐIỀU DƯỠNG',
            category: 'BLOUSE ĐIỀU DƯỠNG',
            price: '379.000,00 ₫',
            image: './asset/images/Store/BL_DD.png',
            link: './product-blouse-dieuduong.html',
            keywords: 'blouse điều dưỡng dieu duong áo blouse trắng y tá'
        },
        {
            name: 'ÁO NỮ BLOUSE TRẮNG KĨ THUẬT VIÊN – MSCool',
            category: 'BLOUSE KĨ THUẬT VIÊN',
            price: '399.000,00 ₫',
            image: './asset/images/Store/BL_KTV.png',
            link: './product-blouse-ktv.html',
            keywords: 'blouse kỹ thuật viên ki thuat vien ktv mscool áo blouse trắng'
        },
        {
            name: 'BỘ ĐỒ SCRUBS BASIC – MSCool',
            category: 'SCRUBS',
            price: '379.000,00 ₫',
            image: './asset/images/Store/SC_BS.png',
            link: './product-scrubs.html',
            keywords: 'scrubs scrub mscool basic bộ đồ scrubs'
        },
        {
            name: 'BỘ ĐỒ SCRUBS PLUS',
            category: 'SCRUBS',
            price: '399.000,00 ₫',
            image: './asset/images/Store/SC_PL.png',
            link: './product-scrubs-plus.html',
            keywords: 'scrubs scrub plus bộ đồ scrubs'
        },
        {
            name: 'THÊU TÊN LÊN SẢN PHẨM',
            category: 'DỊCH VỤ',
            price: '15.000,00 ₫',
            image: './asset/images/DV/theu-ten.png',
            link: './product-theu-ten.html',
            keywords: 'thêu tên theu ten dịch vụ dich vu'
        },
        {
            name: 'IN LOGO LÊN SẢN PHẨM',
            category: 'DỊCH VỤ',
            price: '0,00 ₫',
            image: './asset/images/DV/in-logo.png',
            link: './product-in-logo.html',
            keywords: 'in logo dịch vụ dich vu logo trường'
        },
        {
            name: 'THÊU LOGO LÊN SẢN PHẨM',
            category: 'DỊCH VỤ',
            price: '70.000,00 ₫',
            image: './asset/images/DV/theu-logo.png',
            link: './product-theu-logo.html',
            keywords: 'thêu logo theu logo dịch vụ dich vu'
        },
        {
            name: 'MAY ĐO THEO SỐ ĐO',
            category: 'DỊCH VỤ',
            price: '0,00 ₫',
            image: './asset/images/DV/may-do.png',
            link: './product-may-do.html',
            keywords: 'may đo may do số đo so do dịch vụ dich vu'
        }
    ]

    function removeVietnameseTone(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase()
    }

    function renderProducts(list) {
        searchResult.innerHTML = ''

        if (list.length === 0) {
            searchEmpty.style.display = 'block'
            return
        }

        searchEmpty.style.display = 'none'

        list.forEach(function (product) {
            const productCard = document.createElement('a')
            productCard.href = product.link
            productCard.className = 'search-card'

            productCard.innerHTML = `
                <div class="search-card-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <p>${product.category}</p>
                <h3>${product.name}</h3>
                <strong>${product.price}</strong>
            `

            searchResult.appendChild(productCard)
        })
    }

    if (!keyword) {
        renderProducts(products)
        return
    }

    const cleanKeyword = removeVietnameseTone(keyword)

    const filteredProducts = products.filter(function (product) {
        const searchableText = removeVietnameseTone(
            product.name + ' ' + product.category + ' ' + product.keywords
        )

        return searchableText.includes(cleanKeyword)
    })

    renderProducts(filteredProducts)
})