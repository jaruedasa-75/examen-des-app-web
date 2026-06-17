<template>
  <div class="vstack gap-4">
    <div v-if="alert.message" class="alert shadow-soft border-0" :class="'alert-' + alert.type">
      {{ alert.message }}
    </div>

    <div class="card shadow-soft border-0">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <span class="badge text-bg-dark mb-2 px-3 py-2">Catálogo</span>
            <h3 class="mb-2">Ropa disponible</h3>
            <p class="text-muted mb-0">Explora productos, mira detalles y agrégalos al carrito.</p>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <span class="badge text-bg-light text-dark px-3 py-2">Productos {{ products.length }}</span>
            <span class="badge text-bg-light text-dark px-3 py-2">Carrito {{ cartCount }}</span>
          </div>
        </div>

        <div class="row g-3 mt-3">
          <div class="col-md-5">
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
              <input v-model.trim="search" type="text" class="form-control" placeholder="Buscar prenda">
            </div>
          </div>
          <div class="col-md-4">
            <select v-model="categoryFilter" class="form-select">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="sortBy" class="form-select">
              <option value="featured">Destacados primero</option>
              <option value="priceAsc">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
              <option value="stockDesc">Más stock</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12">
        <div v-if="loading" class="text-center text-muted py-5">
          <div class="spinner-border text-primary mb-2" role="status"></div>
          <div>Cargando catálogo...</div>
        </div>

        <div v-else-if="loadError" class="alert alert-danger border-0">
          <i class="bi bi-exclamation-triangle me-1"></i>{{ loadError }}
        </div>

        <div v-else class="row g-4">
          <div v-for="product in filteredProducts" :key="product.id" class="col-md-6 col-xl-4">
            <ProductCardComponent
              :product="product"
              @details="openDetails"
              @add-to-cart="addToCart"
            />
          </div>
        </div>

        <div v-if="!loading && !loadError && !filteredProducts.length" class="card shadow-soft border-0 mt-4">
          <div class="card-body text-center text-muted py-5">
            No hay productos que coincidan con el filtro.
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(15,23,42,.55);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-soft">
          <div class="modal-header">
            <h5 class="modal-title">{{ detailProduct.nombre }}</h5>
            <button type="button" class="btn-close" @click="closeDetails"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3 align-items-center">
              <div class="col-md-5">
                <img :src="detailProduct.imagen" :alt="detailProduct.nombre" class="img-fluid rounded-4 object-cover" style="width: 100%; height: 280px;">
              </div>
              <div class="col-md-7">
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge text-bg-dark">{{ detailProduct.categoria }}</span>
                  <span class="badge text-bg-light text-dark">Stock {{ detailProduct.stock }}</span>
                  <span class="badge text-bg-light text-dark">Tallas {{ detailProduct.tallas }}</span>
                </div>
                <p class="text-muted">{{ detailProduct.descripcion }}</p>
                <div class="fw-bold fs-3">${{ formatPrice(detailProduct.precio) }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="closeDetails">Cerrar</button>
            <button class="btn btn-primary" @click="addToCart(detailProduct)">Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCardComponent from '../components/ProductCardComponent.vue'
import { getProducts } from '../services/productService'
import { readJSON, writeJSON, STORAGE_KEYS } from '../utils/storage'

export default {
  name: 'CatalogView',
  components: {
    ProductCardComponent
  },
  data() {
    return {
      products: [],
      cart: [],
      loading: false,
      loadError: '',
      search: '',
      categoryFilter: 'Todos',
      sortBy: 'featured',
      detailProduct: null,
      alert: {
        type: '',
        message: ''
      }
    }
  },
  computed: {
    categories() {
      return ['Todos', ...new Set(this.products.map((item) => item.categoria).filter(Boolean))]
    },
    filteredProducts() {
      const term = this.search.toLowerCase().trim()
      let list = this.products.filter((product) => {
        const matchesSearch =
          !term ||
          (product.nombre || '').toLowerCase().includes(term) ||
          (product.categoria || '').toLowerCase().includes(term) ||
          (product.descripcion || '').toLowerCase().includes(term)

        const matchesCategory =
          this.categoryFilter === 'Todos' || product.categoria === this.categoryFilter

        return matchesSearch && matchesCategory
      })

      if (this.sortBy === 'priceAsc') {
        list = [...list].sort((a, b) => Number(a.precio) - Number(b.precio))
      } else if (this.sortBy === 'priceDesc') {
        list = [...list].sort((a, b) => Number(b.precio) - Number(a.precio))
      } else if (this.sortBy === 'stockDesc') {
        list = [...list].sort((a, b) => Number(b.stock) - Number(a.stock))
      } else {
        list = [...list].sort((a, b) => Number(b.destacado) - Number(a.destacado))
      }

      return list
    },
    cartCount() {
      return this.cart.reduce((acc, item) => acc + Number(item.quantity || 0), 0)
    },
    showDetailModal() {
      return Boolean(this.detailProduct)
    }
  },
  mounted() {
    this.loadProducts()
    this.loadCart()
    this._onStorage = () => this.loadCart()
    window.addEventListener('shop:storage', this._onStorage)
  },
  beforeUnmount() {
    window.removeEventListener('shop:storage', this._onStorage)
  },
  methods: {
    async loadProducts() {
      this.loading = true
      this.loadError = ''
      try {
        const { data } = await getProducts()
        this.products = data
      } catch (err) {
        this.loadError = 'No se pudo cargar el catálogo. Verifica la conexión a MockAPI.'
      } finally {
        this.loading = false
      }
    },
    loadCart() {
      this.cart = readJSON(localStorage, STORAGE_KEYS.cart, [])
    },
    openDetails(product) {
      this.detailProduct = product
    },
    closeDetails() {
      this.detailProduct = null
    },
    addToCart(product) {
      if (!product) return

      const cart = readJSON(localStorage, STORAGE_KEYS.cart, [])
      const existing = cart.find((item) => item.id === product.id)

      if (existing) {
        if (existing.quantity >= Number(product.stock)) {
          this.setAlert('warning', 'No hay más stock disponible.')
          return
        }
        existing.quantity += 1
      } else {
        cart.push({
          id: product.id,
          name: product.nombre,
          category: product.categoria,
          price: Number(product.precio),
          image: product.imagen,
          stock: Number(product.stock),
          quantity: 1
        })
      }

      writeJSON(localStorage, STORAGE_KEYS.cart, cart)
      this.cart = cart
      this.setAlert('success', 'Producto agregado al carrito.')
      this.closeDetails()
    },
    setAlert(type, message) {
      this.alert = { type, message }
      window.clearTimeout(this._alertTimer)
      this._alertTimer = window.setTimeout(() => {
        this.alert = { type: '', message: '' }
      }, 2200)
    },
    formatPrice(value) {
      return Number(value).toLocaleString('es-CO')
    }
  }
}
</script>
