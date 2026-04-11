const BASE_URL = 'http://localhost:1234';

export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem('jwt_token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const mergedOptions = {
    ...options,
    headers
  };
  
  const response = await window.fetch(url, mergedOptions);
  
  if (response.status === 401 || response.status === 403) {
      if (token) {
          localStorage.removeItem('jwt_token');
          window.location.href = '/login';
      }
  }
  
  return response;
}

export async function getProducts() {
  try {
    const res = await fetch(`${BASE_URL}/viewallproducts`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find((p) => p.id.toString() === id.toString());
}

export async function addProduct(product) {
  try {
    const res = await authenticatedFetch(`${BASE_URL}/addproduct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.ok;
  } catch (err) { return false; }
}

export async function updateProduct(id, updates) {
  try {
    const productData = { id: parseInt(id, 10), ...updates };
    const res = await authenticatedFetch(`${BASE_URL}/updateproduct`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return res.ok;
  } catch (err) { return false; }
}

export async function deleteProduct(id) {
  try {
    const res = await authenticatedFetch(`${BASE_URL}/deleteproduct/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) { return false; }
}

// ---------------- AUTHENTICATION & USERS ---------------- //

export async function loginFarmer(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return await res.json();
}

export async function loginCustomer(email, password) {
  const res = await fetch(`${BASE_URL}/customer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return await res.json();
}

export async function loginAdmin(username, password) {
  const res = await fetch(`${BASE_URL}/admincontroller/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return await res.json();
}

export async function signupFarmer(data) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.ok;
}

export async function signupCustomer(data) {
  const res = await fetch(`${BASE_URL}/customer/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.ok;
}

export async function getPendingFarmers() {
  const res = await authenticatedFetch(`${BASE_URL}/admincontroller/pendingfarmers`);
  if (!res.ok) return [];
  return await res.json();
}

export async function approveFarmer(id) {
  const res = await authenticatedFetch(`${BASE_URL}/admincontroller/approvefarmer/${id}`, { method: 'PUT' });
  return res.ok;
}

export async function getAllFarmers() {
  const res = await authenticatedFetch(`${BASE_URL}/admincontroller/viewallfarmers`);
  if (!res.ok) return [];
  return await res.json();
}

export async function getAllCustomers() {
  const res = await authenticatedFetch(`${BASE_URL}/admincontroller/viewallcustomers`);
  if (!res.ok) return [];
  return await res.json();
}

export async function getAllProductsAdmin() {
  const res = await authenticatedFetch(`${BASE_URL}/admincontroller/viewallproducts`);
  if (!res.ok) return [];
  return await res.json();
}
