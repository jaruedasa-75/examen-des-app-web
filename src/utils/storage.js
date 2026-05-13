export const STORAGE_KEYS = {
  auth: 'shop-auth',
  products: 'ropa-products',
  cart: 'ropa-cart',
  orders: 'ropa-orders'
}

export function readJSON(storage, key, fallback) {
  try {
    const raw = storage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(storage, key, value) {
  storage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event('shop:storage'))
}

export function clearJSON(storage, key) {
  storage.removeItem(key)
  window.dispatchEvent(new Event('shop:storage'))
}

export function getAuth() {
  return readJSON(sessionStorage, STORAGE_KEYS.auth, null)
}

export function setAuth(user) {
  writeJSON(sessionStorage, STORAGE_KEYS.auth, user)
}

export function clearAuth() {
  clearJSON(sessionStorage, STORAGE_KEYS.auth)
}
