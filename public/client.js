document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products");
  const categoryFilter = document.getElementById("category-filter");
  const searchInput = document.getElementById("search-input");

  // Fetch products from backend
  const fetchProducts = async (category = "", search = "") => {
    try {
      const response = await fetch(`/api/products?category=${category}&search=${search}`);
      
      // Check if the response is successful and returns JSON
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response, but got something else.");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Clear current products
      productsContainer.innerHTML = '';

      // Render products
      data.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product");
        productCard.innerHTML = `
          <h3>${product.name}</h3>
          <p>${product.price} USD</p>
          <p>Category: ${product.category}</p>
          <input type="number" id="quantity-${product.id}" value="1" min="1" max="${product.quantity}" />
          <button data-product-id="${product.id}">Add to Basket</button>
        `;

        // Add event listener for adding to basket
        const addButton = productCard.querySelector("button");
        addButton.addEventListener("click", () => addToBasket(product.id));

        productsContainer.appendChild(productCard);
      });
    } catch (error) {
      alert("Error fetching products: " + error.message);
    }
  };

  // Fetch products when category or search changes
  categoryFilter.addEventListener("change", () => {
    fetchProducts(categoryFilter.value, searchInput.value);
  });

  searchInput.addEventListener("input", () => {
    fetchProducts(categoryFilter.value, searchInput.value);
  });

  // Add product to basket
  const addToBasket = async (productId) => {
    const quantity = document.getElementById(`quantity-${productId}`).value;

    try {
      const response = await fetch("/api/basket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId, quantity: quantity }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Product added to basket!");
      } else {
        alert("Error adding product to basket.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Initial fetch of products
  fetchProducts();
});

// Basket page functionality
document.addEventListener("DOMContentLoaded", () => {
  const basketContainer = document.getElementById("basket");

  // Fetch basket items from backend
  const fetchBasket = async () => {
    try {
      const response = await fetch("/api/basket");

      // Check if the response is successful and returns JSON
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response, but got something else.");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Clear current basket
      basketContainer.innerHTML = '';

      if (data.length === 0) {
        basketContainer.innerHTML = "<p>Your basket is empty.</p>";
      } else {
        // Render basket items
        data.forEach(item => {
          const basketItem = document.createElement("div");
          basketItem.classList.add("basket-item");
          basketItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>Price: ${item.price} USD</p>
            <p>Quantity: ${item.quantity}</p>
            <button data-basket-id="${item.id}">Remove</button>
          `;
          basketContainer.appendChild(basketItem);

          // Add event listener for removing items from basket
          const removeButton = basketItem.querySelector("button");
          removeButton.addEventListener("click", () => removeFromBasket(item.id));
        });
      }
    } catch (error) {
      alert("Error fetching basket: " + error.message);
    }
  };

  // Remove product from basket
  const removeFromBasket = async (basketId) => {
    try {
      const response = await fetch(`/api/basket/${basketId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        alert("Product removed from basket!");
        fetchBasket(); // Re-fetch the basket to update UI
      } else {
        alert("Error removing product from basket.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Initial fetch of basket
  fetchBasket();
});
