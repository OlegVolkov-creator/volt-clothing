
const products = {
  tshirt: {
    category: "01 / ESSENTIALS",
    name: "VOLT T-Shirt",
    price: 3900,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
    description: "Базовая футболка со свободным силуэтом, спущенными плечами и минималистичным дизайном.",
    details: [
      ["Материал", "Хлопок"],
      ["Плотность", "240 г/м² — концепт"],
      ["Посадка", "Oversized"],
      ["Цвет", "Black"],
      ["Уход", "Стирка при 30°C"]
    ],
    sizes: ["S", "M", "L", "XL"]
  },

  pants: {
    category: "02 / BOTTOMS",
    name: "VOLT Pants",
    price: 5900,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1100&q=85",
    description: "Свободные брюки с широким силуэтом и минималистичным дизайном.",
    details: [
      ["Материал", "Хлопок / смесовая ткань"],
      ["Посадка", "Relaxed fit"],
      ["Силуэт", "Wide leg"],
      ["Цвет", "Black"],
      ["Уход", "По инструкции на ярлыке"]
    ],
    sizes: ["S", "M", "L", "XL"]
  },

  hoodie: {
    category: "03 / LAYERS",
    name: "VOLT Hoodie",
    price: 6900,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1100&q=85",
    description: "Объёмное худи для многослойных образов со свободной посадкой.",
    details: [
      ["Материал", "Хлопок / полиэстер"],
      ["Плотность", "400 г/м² — концепт"],
      ["Посадка", "Oversized"],
      ["Цвет", "Black"],
      ["Уход", "Стирка при 30°C"]
    ],
    sizes: ["S", "M", "L", "XL"]
  },

  jacket: {
    category: "04 / OUTERWEAR",
    name: "VOLT Jacket",
    price: 11900,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1100&q=85",
    description: "Минималистичная куртка с чётким силуэтом и универсальным тёмным цветом.",
    details: [
      ["Материал", "Синтетическая ткань — концепт"],
      ["Подкладка", "Зависит от модели"],
      ["Посадка", "Relaxed fit"],
      ["Цвет", "Black"],
      ["Уход", "По инструкции на ярлыке"]
    ],
    sizes: ["S", "M", "L", "XL"]
  },

  beanie: {
    category: "05 / ACCESSORIES",
    name: "VOLT Beanie",
    price: 1900,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1100&q=85",
    description: "Минималистичная вязаная шапка на каждый день.",
    details: [
      ["Материал", "Трикотаж — концепт"],
      ["Посадка", "Универсальная"],
      ["Форма", "Beanie"],
      ["Цвет", "Black"],
      ["Уход", "По инструкции на ярлыке"]
    ],
    sizes: ["ONE SIZE"]
  }
};

// Определяем товар по адресу страницы
const params = new URLSearchParams(window.location.search);
const productId = params.get("id") || "tshirt";
const product = products[productId] || products.tshirt;

// Находим элементы страницы
const categoryEl = document.getElementById("product-category");
const nameEl = document.getElementById("product-name");
const priceEl = document.getElementById("product-price");
const descriptionEl = document.getElementById("product-description");
const detailsEl = document.getElementById("product-details");
const sizesEl = document.getElementById("product-sizes");
const sizeError = document.getElementById("size-error");
const buyButton = document.getElementById("buy-button");
const imageEl = document.getElementById("product-image");

// Заполняем страницу данными товара
document.title = `${product.name} — VOLT`;

if (categoryEl) categoryEl.textContent = product.category;
if (nameEl) nameEl.textContent = product.name;
if (priceEl) priceEl.textContent = product.price.toLocaleString("ru-RU") + " ₽";
if (descriptionEl) descriptionEl.textContent = product.description;

if (imageEl) {
  imageEl.src = product.image;
  imageEl.alt = product.name;
}

// Характеристики товара
if (detailsEl) {
  detailsEl.innerHTML = "";

  product.details.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "detail-row";

    const left = document.createElement("span");
    left.textContent = label;

    const right = document.createElement("span");
    right.textContent = value;

    row.append(left, right);
    detailsEl.appendChild(row);
  });
}

// Выбор размера
let selectedSize = null;

if (sizesEl) {
  sizesEl.innerHTML = "";

  product.sizes.forEach((size) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "size-button";
    button.textContent = size;

    button.addEventListener("click", () => {
      selectedSize = size;

      document.querySelectorAll(".size-button").forEach((item) => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");

      if (sizeError) {
        sizeError.classList.remove("visible");
      }
    });

    sizesEl.appendChild(button);
  });
}

// Добавление товара в корзину
if (buyButton) {
  buyButton.addEventListener("click", () => {
    if (!selectedSize) {
      if (sizeError) {
        sizeError.classList.add("visible");
      } else {
        alert("Сначала выбери размер.");
      }
      return;
    }

    let cart = [];

    try {
      cart = JSON.parse(localStorage.getItem("voltCart") || "[]");

      if (!Array.isArray(cart)) {
        cart = [];
      }
    } catch (error) {
      cart = [];
    }

    const existingItem = cart.find(
      (item) => item.id === productId && item.size === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        quantity: 1
      });
    }

    localStorage.setItem("voltCart", JSON.stringify(cart));

    buyButton.textContent = "ДОБАВЛЕНО ✓";

    setTimeout(() => {
      buyButton.textContent = "ДОБАВИТЬ В КОРЗИНУ ↗";
    }, 1500);
  });
}
