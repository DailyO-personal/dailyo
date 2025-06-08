// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all data fetching
  fetchCryptocurrencyData();
  fetchExchangeRates();
  fetchEconomicNews();
  setupCurrencyConverter();
  setupThemeToggle();
  setupNewsModal();
});

// Theme Toggle Functionality
function setupThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");

  themeToggleBtn.addEventListener("click", () => {
    // Get current theme
    const currentTheme = document.documentElement.getAttribute("data-theme");

    // Toggle theme
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Set new theme
    document.documentElement.setAttribute("data-theme", newTheme);

    // Save theme preference
    localStorage.setItem("theme", newTheme);
  });
}

// News Modal Functionality
function setupNewsModal() {
  const modal = document.getElementById("news-modal");
  const closeModal = document.querySelector(".close-modal");

  // Close modal when clicking the X
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
  });

  // Close modal when clicking outside the modal content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }
  });
}

// Open modal with news details
function openNewsModal(news) {
  const modal = document.getElementById("news-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalSourceDate = document.getElementById("modal-source-date");
  const modalImage = document.getElementById("modal-image");
  const modalDescription = document.getElementById("modal-description");
  const modalLink = document.getElementById("modal-link");

  // Format date
  const publishedDate = new Date(news.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Set modal content
  modalTitle.textContent = news.title;
  modalSourceDate.innerHTML = `<span>${news.source}</span><span>${formattedDate}</span>`;
  modalImage.src = news.image;
  modalImage.alt = news.title;
  modalDescription.textContent = news.description;
  modalLink.href = news.url;

  // Show modal
  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
}

// ===== Cryptocurrency Section =====
async function fetchCryptocurrencyData() {
  const cryptoContainer = document.getElementById("crypto-container");

  try {
    // Fetch top 10 cryptocurrencies by market cap
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cryptocurrency data");
    }

    const data = await response.json();

    // Clear loading message
    cryptoContainer.innerHTML = "";

    // Create crypto cards
    data.forEach((crypto) => {
      const priceChangeClass =
        crypto.price_change_percentage_24h >= 0
          ? "positive-change"
          : "negative-change";
      const priceChangeSymbol =
        crypto.price_change_percentage_24h >= 0 ? "+" : "";

      const cryptoCard = document.createElement("div");
      cryptoCard.className = "crypto-card";
      cryptoCard.innerHTML = `
              <img src="${crypto.image}" alt="${
        crypto.name
      }" class="crypto-icon">
              <div class="crypto-info">
                  <div class="crypto-name">${
                    crypto.name
                  } (${crypto.symbol.toUpperCase()})</div>
                  <div>
                      <span class="crypto-price">$${crypto.current_price.toLocaleString()}</span>
                      <span class="crypto-change ${priceChangeClass}">${priceChangeSymbol}${crypto.price_change_percentage_24h.toFixed(
        2
      )}%</span>
                  </div>
              </div>
          `;

      cryptoContainer.appendChild(cryptoCard);
    });
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error);
    cryptoContainer.innerHTML = `<div class="error">Failed to load cryptocurrency data. ${error.message}</div>`;
  }
}

// ===== Currency Section =====
// Exchange rates API
async function fetchExchangeRates() {
  const popularRatesContainer = document.getElementById("popular-rates");

  try {
    // Using ExchangeRate-API (free tier)
    const response = await fetch("https://open.er-api.com/v6/latest/USD");

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();
    const rates = data.rates;

    // Clear loading message
    popularRatesContainer.innerHTML = "<h3>Popular Exchange Rates</h3>";

    // Display popular currency pairs
    const popularCurrencies = ["EUR", "GBP", "JPY", "TRY", "CHF"];

    popularCurrencies.forEach((currency) => {
      const rateCard = document.createElement("div");
      rateCard.className = "rate-card";
      rateCard.innerHTML = `
              <span class="rate-pair">USD / ${currency}</span>
              <span class="rate-value">${rates[currency].toFixed(4)}</span>
          `;

      popularRatesContainer.appendChild(rateCard);
    });

    // Store all rates in a global variable for the converter
    window.exchangeRates = rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    popularRatesContainer.innerHTML = `<div class="error">Failed to load exchange rates. ${error.message}</div>`;
  }
}

// Currency converter functionality
function setupCurrencyConverter() {
  const amountInput = document.getElementById("amount");
  const fromCurrencySelect = document.getElementById("from-currency");
  const toCurrencySelect = document.getElementById("to-currency");
  const resultInput = document.getElementById("result");
  const convertBtn = document.getElementById("convert-btn");
  const swapBtn = document.getElementById("swap-currencies");

  // Convert button click handler
  convertBtn.addEventListener("click", () => {
    convertCurrency();
  });

  // Swap currencies button click handler
  swapBtn.addEventListener("click", () => {
    const fromValue = fromCurrencySelect.value;
    const toValue = toCurrencySelect.value;

    fromCurrencySelect.value = toValue;
    toCurrencySelect.value = fromValue;

    convertCurrency();
  });

  // Convert currency function
  function convertCurrency() {
    if (!window.exchangeRates) {
      resultInput.value = "Exchange rates not loaded yet";
      return;
    }

    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
      resultInput.value = "Please enter a valid amount";
      return;
    }

    // Convert to USD first (base currency)
    let amountInUSD;
    if (fromCurrency === "USD") {
      amountInUSD = amount;
    } else {
      amountInUSD = amount / window.exchangeRates[fromCurrency];
    }

    // Convert from USD to target currency
    let result;
    if (toCurrency === "USD") {
      result = amountInUSD;
    } else {
      result = amountInUSD * window.exchangeRates[toCurrency];
    }

    resultInput.value = result.toFixed(4);
  }
}

// ===== Economic News Section =====
async function fetchEconomicNews() {
  const newsContainer = document.getElementById("news-container");

  try {
    // Using GNews API with economic topic
    // Note: In a production environment, you would need to sign up for an API key
    // For demo purposes, we'll use a sample of economic news

    // Simulated news data (in a real app, this would come from an API)
    const sampleNews = [
      {
        title: "Federal Reserve Announces Interest Rate Decision",
        description:
          "The Federal Reserve has decided to maintain current interest rates, citing stable inflation and employment figures. The decision comes after a two-day meeting of the Federal Open Market Committee, which voted unanimously to keep the federal funds rate in its current target range. Officials noted that while inflation has moderated somewhat, it remains above the committee's 2% target. The Fed also indicated it would continue to monitor economic data closely and would be prepared to adjust its stance if risks emerge that could impede the attainment of its goals.",
        url: "#",
        image:
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        source: "Financial Times",
        publishedAt: "2025-06-07T14:30:00Z",
      },
      {
        title: "Global Markets React to Trade Agreement",
        description:
          "Stock markets worldwide showed positive movement following the announcement of a new international trade agreement. The comprehensive deal, which involves major economies including the United States, European Union, and several Asian nations, aims to reduce tariffs and streamline regulatory processes. Analysts suggest this could boost global GDP by an estimated 0.5% over the next five years. Technology and manufacturing sectors saw particularly strong gains, with semiconductor and automotive stocks leading the rally across multiple exchanges.",
        url: "#",
        image:
          "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        source: "Bloomberg",
        publishedAt: "2025-06-08T09:15:00Z",
      },
      {
        title: "Cryptocurrency Regulation Framework Proposed",
        description:
          "A new regulatory framework for cryptocurrencies has been proposed, aiming to provide clarity while fostering innovation. The proposal, put forward by an international consortium of financial regulators, outlines standards for cryptocurrency exchanges, stablecoin issuers, and decentralized finance platforms. Key provisions include enhanced know-your-customer requirements, capital reserves for stablecoin issuers, and disclosure standards for DeFi protocols. Industry reaction has been mixed, with some praising the clarity while others express concerns about compliance costs for smaller players.",
        url: "#",
        image:
          "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        source: "CoinDesk",
        publishedAt: "2025-06-07T18:45:00Z",
      },
      {
        title: "Oil Prices Fluctuate Amid Supply Concerns",
        description:
          "Global oil prices have shown volatility as market participants assess potential supply disruptions in key producing regions. Geopolitical tensions in the Middle East and production challenges in several OPEC+ nations have created uncertainty about near-term supply levels. Meanwhile, demand forecasts remain strong despite growing electric vehicle adoption, with aviation and petrochemical sectors driving consumption growth. Analysts suggest that the market may remain volatile until more clarity emerges on both the supply situation and the pace of energy transition policies in major economies.",
        url: "#",
        image:
          "https://images.unsplash.com/photo-1582486225644-dce7c7d8d3ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        source: "Reuters",
        publishedAt: "2025-06-08T11:20:00Z",
      },
      {
        title: "Tech Sector Leads Stock Market Gains",
        description:
          "Technology companies have outperformed other sectors in recent trading sessions, driven by strong earnings reports and positive growth outlooks. Artificial intelligence and cloud computing firms posted particularly impressive results, with several exceeding analyst expectations by significant margins. The sector's strength has helped major indices reach new highs despite concerns in other areas of the economy. Institutional investors have been increasing their allocations to tech stocks, citing the sector's resilience in the face of broader economic uncertainties and its potential to benefit from ongoing digital transformation trends.",
        url: "#",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        source: "Wall Street Journal",
        publishedAt: "2025-06-08T13:10:00Z",
      },
      {
        title: "Housing Market Shows Signs of Cooling",
        description:
          "After months of rapid price increases, the housing market is showing initial signs of moderation with slightly lower demand and increased inventory. The national median home price remains elevated compared to pre-pandemic levels, but the pace of appreciation has slowed considerably. Rising mortgage rates appear to be dampening buyer enthusiasm, particularly among first-time homebuyers. Construction of new homes has accelerated in many regions, helping to address the inventory shortage that has characterized the market in recent years. Economists suggest this rebalancing could lead to a more sustainable housing market in the coming quarters.",
        url: "#",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        source: "CNBC",
        publishedAt: "2025-06-07T16:30:00Z",
      },
    ];

    // Store news data globally for modal access
    window.newsData = sampleNews;

    // Clear loading message
    newsContainer.innerHTML = "";

    // Create news cards
    sampleNews.forEach((news, index) => {
      const publishedDate = new Date(news.publishedAt);
      const formattedDate = publishedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const newsCard = document.createElement("div");
      newsCard.className = "news-card";
      newsCard.dataset.index = index; // Store index for modal reference
      newsCard.innerHTML = `
              <img src="${news.image}" alt="${news.title}" class="news-image">
              <div class="news-content">
                  <div class="news-source">${news.source}</div>
                  <h3 class="news-title">${news.title}</h3>
                  <p class="news-description">${news.description}</p>
                  <div class="news-link">Read more</div>
                  <div class="news-date">${formattedDate}</div>
              </div>
          `;

      // Add click event to open modal
      newsCard.addEventListener("click", () => {
        openNewsModal(news);
      });

      newsContainer.appendChild(newsCard);
    });
  } catch (error) {
    console.error("Error fetching economic news:", error);
    newsContainer.innerHTML = `<div class="error">Failed to load economic news. ${error.message}</div>`;
  }
}

// Refresh data periodically (every 5 minutes)
setInterval(() => {
  fetchCryptocurrencyData();
  fetchExchangeRates();
}, 300000); // 5 minutes in milliseconds
