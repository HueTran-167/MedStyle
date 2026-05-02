const products = [
    {
        name: "Áo Blouse Trắng Bác Sĩ Basic - MScool",
        category: "Blouse bác sĩ",
        price: "379.000đ",
        image: "./asset/images/BST/Blouse-plus.JPG",
        link: "#"
    },
    {
        name: "Áo Blouse Kỹ Thuật Viên - MedStyle",
        category: "Blouse kỹ thuật viên",
        price: "379.000đ",
        image: "./asset/images/BST/Blouse-plus.JPG",
        link: "#"
    },
    {
        name: "Áo Blouse Điều Dưỡng Form Dài",
        category: "Blouse điều dưỡng",
        price: "379.000đ",
        image: "./asset/images/BST/Blouse-plus.JPG",
        link: "#"
    },
    {
        name: "Blouse Plus Cao Cấp",
        category: "Blouse Plus",
        price: "429.000đ",
        image: "./asset/images/BST/Blouse-plus.JPG",
        link: "#"
    },
    {
        name: "Scrubs Xám Basic - MScool",
        category: "Scrubs",
        price: "379.000đ",
        image: "./asset/images/Scrubs/Xám.JPG",
        link: "#"
    },
    {
        name: "Scrubs Xanh Đen Basic - MScool",
        category: "Scrubs",
        price: "379.000đ",
        image: "./asset/images/Scrubs/Xanh đen.jpg",
        link: "#"
    },
    {
        name: "Scrubs Xanh Rêu Basic - MScool",
        category: "Scrubs",
        price: "379.000đ",
        image: "./asset/images/Scrubs/Xanh rêu.JPG",
        link: "#"
    },
    {
        name: "Scrubs Xanh Cổ Vịt - MScool",
        category: "Scrubs",
        price: "379.000đ",
        image: "./asset/images/Scrubs/Xanh cổ vịt.JPG",
        link: "#"
    }
];

const params = new URLSearchParams(window.location.search);
const keyword = params.get("q") || "";

const searchKeyword = document.getElementById("searchKeyword");
const searchResult = document.getElementById("searchResult");
const searchEmpty = document.getElementById("searchEmpty");
const searchInput = document.getElementById("Search");

searchKeyword.textContent = keyword;
searchInput.value = keyword;

const normalizedKeyword = keyword.toLowerCase().trim();

const result = products.filter(product => {
    return (
        product.name.toLowerCase().includes(normalizedKeyword) ||
        product.category.toLowerCase().includes(normalizedKeyword)
    );
});

if (result.length === 0 || normalizedKeyword === "") {
    searchEmpty.style.display = "block";
} else {
    searchEmpty.style.display = "none";

    searchResult.innerHTML = result.map(product => {
        return `
            <a href="${product.link}" class="search-card">
                <div class="search-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <div class="search-info">
                    <p class="category">${product.category}</p>
                    <h3>${product.name}</h3>
                    <div class="stars">★★★★★</div>
                    <p class="price">${product.price}</p>
                </div>
            </a>
        `;
    }).join("");
}