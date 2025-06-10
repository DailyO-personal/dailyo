const API_KEY = 'f3bf044c-fd1a-4ddc-b6c7-a8dca6626a00';
const API_URL = `https://content.guardianapis.com/search?api-key=${API_KEY}&show-fields=thumbnail&page-size=50`;

async function fetchNews() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const articles = data.response.results || [];

        if (articles.length === 0) {
            console.error("Haber bulunamadı.");
            return;
        }

        populateSlider(articles.slice(0, 10));
        populateGrid(articles.slice(10));
    } catch (error) {
        console.error("Haberler alınırken hata oluştu:", error);
    }
}

function createNewsCard(article, index = 0, isFeatured = false) {
    const container = document.createElement("div");
    // container.className = isFeatured ? "news-item large" : "news-item";

    const imageUrl = article.fields?.thumbnail || 'https://via.placeholder.com/400x200?text=No+Image';
    const title = article.webTitle || `Haber ${index + 1}`;

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Haber görseli";

    const titleElement = document.createElement("p");
    titleElement.className = "text-bg";
    titleElement.textContent = title;

    container.appendChild(img);
    container.appendChild(titleElement);

    container.addEventListener("click", () => {
        if (article.webUrl) window.open(article.webUrl, "_blank");
    });

    return container;
}

function populateSlider(articles) {
    const slider = document.querySelector(".slider");
    slider.innerHTML = ""; 

    articles.forEach((article, index) => {
        const slide = document.createElement("div");
        slide.classList.add("slide");

        const newsBox = document.createElement("div");
        newsBox.classList.add("news-box");

        const imageUrl = article.fields?.thumbnail || 'https://via.placeholder.com/400x200?text=No+Image';
        const title = article.webTitle || `Haber ${index + 1}`;

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = "Haber görseli";

        const titleElement = document.createElement("p");
        titleElement.textContent = title;

        newsBox.appendChild(img);
        newsBox.appendChild(titleElement);
        slide.appendChild(newsBox);
        slider.appendChild(slide);
    });
}



function startSlider() {
    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");
    const firstClone = slides[0].cloneNode(true); // İlk elemanın kopyasını oluştur
    slider.appendChild(firstClone); // Bunu en sona ekle

    let index = 0;

    function slideNext() {
        index++;
        slider.style.transition = "transform 1s ease-in-out";
        slider.style.transform = `translateX(-${100 * index}%)`;

        if (index >= slides.length) {
            setTimeout(() => {
                slider.style.transition = "none"; // Geçiş animasyonunu sıfırla
                slider.style.transform = "translateX(0)"; // Baştan başlat
                index = 0;
            }, 1000); // Biraz bekleme süresi ekleyerek daha doğal geçiş sağla
        }
    }

    setInterval(slideNext, 4000);
}





function populateGrid(articles) {
    const grid = document.querySelector(".news-grid");
    grid.innerHTML = ""; // Eski içerikleri temizle

    const fragment = document.createDocumentFragment();

    if (articles.length > 0) {
        fragment.appendChild(createNewsCard(articles[0], 0, true));
    }

    articles.slice(1).forEach((article, index) => {
        fragment.appendChild(createNewsCard(article, index + 1, false));
    });

    grid.appendChild(fragment);
}

fetchNews();
