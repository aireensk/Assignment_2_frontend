// Base API URL (Update if needed)
const API_URL = "/api/products";

// Detect the current page
const page = window.location.pathname;

// Check if user is logged in
const checkAuth = async () => {
  const token = localStorage.getItem("token");
  if (!token && page.includes("basket.html")) {
    alert("You must be logged in to access the cart.");
    window.location.href = "login.html";
  }
};

// Handle user sign-up (login.html)
if (page.includes("login.html")) {
  document.getElementById("signup").addEventListener("click", async () => {
    const resultElement = document.getElementById("result");
    resultElement.textContent = "Loading...";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      resultElement.textContent = "Sign-up successful! Please log in.";
    } catch (error) {
      resultElement.textContent = `Error: ${error.message}`;
    }
  });

  // Handle user login
  document.getElementById("login").addEventListener("click", async () => {
    const resultElement = document.getElementById("result");
    resultElement.textContent = "Loading...";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        resultElement.textContent = "Login successful! Redirecting...";
        setTimeout(() => (window.location.href = "index.html"), 1000);
      } else {
        resultElement.textContent = "Login failed!";
      }
    } catch (error) {
      resultElement.textContent = `Error: ${error.message}`;
    }
  });
}

// Fetch all products (index.html)
const getProducts = async () => {
  if (!document.getElementById("result")) return;

  const resultElement = document.getElementById("result");
  resultElement.textContent = "Loading...";

  const searchQuery = document.getElementById("searchQuery")?.value || "";
  const category = document.getElementById("filterCategory")?.value || "";

  let url = `${API_URL}/products`;
  if (searchQuery || category) {
    url += `?search=${searchQuery}&category=${category}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    resultElement.innerHTML = data
      .map(
        (product) => `
      <li>${product.name} - ${product.quantity} in stock 
        <button onclick="deleteProduct(${product.id})">Delete</button>
        <button onclick="updateProduct(${product.id})">Update Quantity</button>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </li>`
      )
      .join("");
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
};

// Add a product (index.html)
const addProduct = async () => {
  if (!document.getElementById("result")) return;

  const resultElement = document.getElementById("result");
  resultElement.textContent = "Loading...";

  const name = document.getElementById("productName")?.value;
  const quantity = document.getElementById("productQuantity")?.value;
  const category = document.getElementById("productCategory")?.value;

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity, category }),
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    await response.json();
    getProducts(); // Refresh product list
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
};

// Delete a product (index.html)
const deleteProduct = async (id) => {
  if (!document.getElementById("result")) return;

  const resultElement = document.getElementById("result");
  resultElement.textContent = "Loading...";

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    await response.json();
    getProducts(); // Refresh list after deletion
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
};

// ---------- CART FUNCTIONALITY (basket.html) ----------
if (page.includes("basket.html")) {
  checkAuth(); // Ensure user is logged in

  const loadCart = () => {
    const cartList = document.getElementById("cartList");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      cartList.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cartList.innerHTML = cart
      .map(
        (item, index) => `
      <li>${item.name} - ${item.quantity}
        <button onclick="removeFromCart(${index})">Remove</button>
      </li>`
      )
      .join("");
  };

  const addToCart = (id) => {
    fetch(`${API_URL}/products/${id}`)
      .then((res) => res.json())
      .then((product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ id: product.id, name: product.name, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart!");
      });
  };

  const removeFromCart = (index) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  };

  document.getElementById("checkout").addEventListener("click", () => {
    alert("Checkout not implemented yet!"); // Implement backend logic later
  });

  loadCart(); // Load cart on page load
}
