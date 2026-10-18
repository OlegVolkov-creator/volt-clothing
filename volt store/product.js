
document.addEventListener("DOMContentLoaded", () => {
  const buyButton = document.getElementById("buy-button");
  const sizeButtons = document.querySelectorAll(".size-option");
  const sizeMessage = document.getElementById("size-message");

  const quantityValue = document.getElementById("quantity-value");
  const quantityMinus = document.getElementById("quantity-minus");
  const quantityPlus = document.getElementById("quantity-plus");

  // Данные всех товаров
  const products = {
    tshirt: {
      id: "tshirt",
      name: "ФУТБОЛКА CORE",
      price: 4990,
      image: "imagess/футболка.jpg",
      description: "Чёрная футболка свободного кроя из мягкого хлопка. Минималистичный дизайн на каждый день.",
      details: "Материал: хлопок\nПосадка: Oversize"
    },

    pants: {
      id: "pants",
      name: "БРЮКИ CARGO",
      price: 12990,
      image: "imagess/штаны.jpeg",
      description: "Чёрные брюки с расслабленной посадкой и выразительным силуэтом.",
      details: "Материал: хлопок и смесовые волокна\nПосадка: Relaxed fit"
    },

    hoodie: {
      id: "hoodie",
      name: "ХУДИ V1",
      price: 8990,
      image: "imagess/худи.jpeg",
      description: "Чёрное худи свободного кроя с капюшоном и минималистичным дизайном.",
      details: "Материал: хлопок и полиэстер\nПосадка: Oversize"
    },

    jacket: {
      id: "jacket",
      name: "КУРТКА SHELL",
      price: 16990,
      image: "imagess/куртка.jpeg",
      description: "Чёрная куртка с чётким силуэтом и универсальным дизайном.",
      details: "Материал: смесовая ткань\nПосадка: Relaxed fit"
    },

    hat: {
      id: "hat",
      name: "ШАПКА V",
      price: 3990,
      image: "imagess/шапка.jpg",
      description: "Минималистичная чёрная шапка, которая дополнит повседневный образ.",
      details: "Материал: трикотаж\nРазмер: One size"
    }
  };

  // Определяем товар по ссылке
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || "tshirt";
  const product = products[productId] || products.tshirt;

  // Подставляем данные товара в HTML
  const nameElement = document.getElementById("product-name");
  const priceElement = document.getElementById("product-price");
  const imageElement = document.getElementById("product-image");
  const descriptionElement = document.getElementById("product-description");
  const detailsElement = document.getElementById("product-details");

  document.title = product.name + " — VOLT";

  if (nameElement) {
    nameElement.textContent = product.name;
  }

  if (priceElement) {
    priceElement.textContent =
      product.price.toLocaleString("ru-RU") + " ₽";
  }

  if (imageElement) {
    imageElement.src = product.image;
    imageElement.alt = product.name;
  }

  if (descriptionElement) {
    descriptionElement.textContent = product.description;
  }

  if (detailsElement) {
    detailsElement.textContent = product.details;
  }

  // Шапка — One size. Остальные товары — M, L, XL
  if (product.id === "hat") {
    const sizesContainer = document.getElementById("sizes");

    if (sizesContainer) {
      sizesContainer.innerHTML = `
        <button class="size-option" type="button" data-size="One size">
          ONE SIZE
        </button>
      `;
    }
  }

  // Выбор размера
  let selectedSize = null;

  function setupSizeButtons() {
    const buttons = document.querySelectorAll(".size-option");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedSize = button.dataset.size;

        buttons.forEach((item) => {
          item.classList.remove("selected");
        });

        button.classList.add("selected");

        if (sizeMessage) {
          sizeMessage.textContent = "Выбран размер: " + selectedSize;
          sizeMessage.style.color = "#d7ff64";
        }
      });
    });
  }

  setupSizeButtons();

  // Количество товара
  let quantity = 1;

  if (quantityMinus) {
    quantityMinus.addEventListener("click", () => {
      quantity = Math.max(1, quantity - 1);

      if (quantityValue) {
        quantityValue.textContent = quantity;
      }
    });
  }

  if (quantityPlus) {
    quantityPlus.addEventListener("click", () => {
      quantity = Math.min(99, quantity + 1);

      if (quantityValue) {
        quantityValue.textContent = quantity;
      }
    });
  }

  // Добавление в корзину
  if (buyButton) {
    buyButton.addEventListener("click", () => {
      if (!selectedSize) {
        if (sizeMessage) {
          sizeMessage.textContent = "Сначала выбери размер.";
          sizeMessage.style.color = "#ff8a8a";
        }

        return;
      }

      let cart = [];

      try {
        cart = JSON.parse(localStorage.getItem("voltCart")) || [];

        if (!Array.isArray(cart)) {
          cart = [];
        }
      } catch {
        cart = [];
      }

      // Совпадают и товар, и размер
      const existingItem = cart.find((item) =>
        item.id === product.id &&
        item.size === selectedSize
      );

      if (existingItem) {
        existingItem.quantity =
          (Number(existingItem.quantity) || 1) + quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: selectedSize,
          quantity: quantity
        });
      }

      localStorage.setItem("voltCart", JSON.stringify(cart));

      buyButton.textContent = "ДОБАВЛЕНО ✓";
buyButton.classList.remove("added-animation");

// Перезапускаем анимацию при каждом добавлении
void buyButton.offsetWidth;

buyButton.classList.add("added-animation");
      if (sizeMessage) {
        sizeMessage.textContent =
          product.name + " · " + selectedSize +
          " · количество: " + quantity;

        sizeMessage.style.color = "#d7ff64";
      }

      setTimeout(() => {
        buyButton.textContent = "ДОБАВИТЬ В КОРЗИНУ ↗";
      }, 1500);
    });
  }
});
