// Base API URL (Update if needed)
const API_URL = "/api/products";

// Handle user sign-up
const signUp = async () => {
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

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    resultElement.textContent = data.message || "Sign-up successful!";
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
};

// Handle user login
const login = async () => {
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

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    resultElement.textContent = data.token ? "Login successful!" : "Login failed!";
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
};

// Fetch all products (with search and filter)
const getProducts = async () => {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Loading...";

  const searchQuery = document.getElementById("searchQuery").value;
  const category = document.getElementById("filterCategory").value;

  let url = `${API_URL}/products`;
  if (searchQuery || category) {
    url += `?search=${searchQuery}&category=${category}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    resultElement.innerHTML = data.map(product => 
      `<li>${product.name} - ${product.quantity} in stock 
        <button onclick="deleteProduct(${product.id})">Delete</button>
        <button onclick="updateProduct(${product.id})">Update Quantity</button>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </li>`
    ).join("");
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
};

// Add a new product
const addProduct = async () => {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Loading...";

  const name = document.getElementById("productName").value;
  const quantity = document.getElementById("productQuantity").value;
  const category = document.getElementById("productCategory").value;

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity, category }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    await response.json();
    getProducts(); // Refresh product list
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
};

// Delete a product
const deleteProduct = async (id) => {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Loading...";

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    await response.json();
    getProducts(); // Refresh list after deletion
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
};
