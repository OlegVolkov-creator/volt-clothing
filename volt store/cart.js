
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  const clearButton = document.getElementById("clear-cart");

  function getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem("voltCart")) || [];
      return Array.isArray(cart) ? cart : [];
    } catch {
      return [];
    }
  }

  function formatPrice(price) {
    return Number(price || 0).toLocaleString("ru-RU") + " ₽";
  }

  function renderCart() {
    const cart = getCart();

    if (!cartContainer || !totalElement) {
      console.error("Не найдены элементы корзины в cart.html");
      return;
    }

    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Корзина пока пуста.</p>";
      totalElement.textContent = formatPrice(0);
      return;
    }

    cart.forEach((item, index) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      const itemTotal = price * quantity;

      total += itemTotal;

      const card = document.createElement("article");
      card.className = "cart-item";

      const image = document.createElement("img");
      image.src = item.image || "";
      image.alt = item.name || "Товар VOLT";

      const info = document.createElement("div");
      info.className = "cart-item-info";

      const name = document.createElement("h3");
      name.textContent = item.name || "Товар VOLT";

      const size = document.createElement("p");
      size.textContent = "Размер: " + (item.size || "—");

      const unitPrice = document.createElement("p");
      unitPrice.textContent = "Цена: " + formatPrice(price);

      const quantityText = document.createElement("p");
      quantityText.textContent = "Количество: " + quantity;

      const subtotal = document.createElement("strong");
      subtotal.textContent = "Сумма: " + formatPrice(itemTotal);

      const removeButton = document.createElement("button");
      removeButton.textContent = "УДАЛИТЬ";
      removeButton.className = "remove-item";
      removeButton.addEventListener("click", () => {
        const updatedCart = getCart();
        updatedCart.splice(index, 1);
        localStorage.setItem("voltCart", JSON.stringify(updatedCart));
        renderCart();
      });

      info.append(name, size, unitPrice, quantityText, subtotal, removeButton);
      card.append(image, info);
      cartContainer.append(card);
    });

    totalElement.textContent = formatPrice(total);
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      localStorage.setItem("voltCart", JSON.stringify([]));
      renderCart();
    });
  }

  renderCart();
});
