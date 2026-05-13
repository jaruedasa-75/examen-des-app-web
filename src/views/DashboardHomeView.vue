<template>
  <div class="vstack gap-4">
    <div class="card shadow-soft border-0 overflow-hidden">
      <div class="card-body p-4 p-lg-5 bg-white">
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <span class="badge text-bg-dark mb-3 px-3 py-2">Dashboard</span>
            <h2 class="fw-bold mb-3">Bienvenido al panel de Moda Luma</h2>
            <p class="text-muted mb-0">
              Revisa el inventario, administra el catálogo y controla las compras desde un solo lugar.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <div class="d-inline-flex align-items-center justify-content-center rounded-4 bg-gradient-brand text-white shadow-soft" style="width: 96px; height: 96px;">
              <i class="bi bi-shop fs-1"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-md-4">
        <div class="card shadow-soft border-0">
          <div class="card-body">
            <div class="text-muted small">Productos</div>
            <div class="fs-2 fw-bold">{{ productsCount }}</div>
            <div class="text-success small"><i class="bi bi-arrow-up-right-circle me-1"></i>Inventario disponible</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-soft border-0">
          <div class="card-body">
            <div class="text-muted small">Carrito</div>
            <div class="fs-2 fw-bold">{{ cartCount }}</div>
            <div class="text-primary small"><i class="bi bi-cart-check me-1"></i>Artículos listos</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-soft border-0">
          <div class="card-body">
            <div class="text-muted small">Pedidos</div>
            <div class="fs-2 fw-bold">{{ ordersCount }}</div>
            <div class="text-warning small"><i class="bi bi-receipt me-1"></i>Compras registradas</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-soft border-0">
      <div class="card-header bg-white border-0 pt-4 px-4">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h5 class="mb-1">Productos destacados</h5>
            <p class="text-muted mb-0">Vista rápida del catálogo guardado.</p>
          </div>
          <RouterLink to="/dashboard/catalogo" class="btn btn-outline-primary btn-sm">
            Ir al catálogo
          </RouterLink>
        </div>
      </div>

      <div class="card-body">
        <div v-if="featuredProducts.length" class="row g-4">
          <div v-for="product in featuredProducts" :key="product.id" class="col-md-6 col-xl-3">
            <ProductCardComponent
              :product="product"
              @details="selectedProduct = $event"
              @add-to-cart="goCatalog"
            />
          </div>
        </div>
        <div v-else class="text-muted">No hay productos cargados.</div>
      </div>
    </div>

    <div v-if="selectedProduct" class="card shadow-soft border-0">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
          <div>
            <h5 class="mb-1">{{ selectedProduct.name }}</h5>
            <div class="text-muted small">{{ selectedProduct.category }} · {{ selectedProduct.color }}</div>
          </div>
          <button class="btn btn-sm btn-outline-secondary" @click="selectedProduct = null">Cerrar</button>
        </div>
        <div class="row g-3 mt-3">
          <div class="col-md-4">
            <img :src="selectedProduct.image" :alt="selectedProduct.name" class="img-fluid rounded-4 object-cover" style="width: 100%; height: 220px;">
          </div>
          <div class="col-md-8">
            <p class="text-muted">{{ selectedProduct.description }}</p>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge text-bg-light text-dark">Stock {{ selectedProduct.stock }}</span>
              <span class="badge text-bg-light text-dark">Tallas {{ selectedProduct.sizes }}</span>
              <span class="badge text-bg-light text-dark">Precio ${{ formatPrice(selectedProduct.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCardComponent from '../components/ProductCardComponent.vue'
import { readJSON, STORAGE_KEYS } from '../utils/storage'

export default {
  name: 'DashboardHomeView',
  components: {
    ProductCardComponent
  },
  data() {
    return {
      products: [],
      cartCount: 0,
      ordersCount: 0,
      selectedProduct: null
    }
  },
  computed: {
    featuredProducts() {
      return this.products.filter((item) => item.featured).slice(0, 4)
    },
    productsCount() {
      return this.products.length
    }
  },
  mounted() {
    this.loadState()
    this._onStorage = () => this.loadState()
    window.addEventListener('shop:storage', this._onStorage)
  },
  beforeUnmount() {
    window.removeEventListener('shop:storage', this._onStorage)
  },
  methods: {
    loadState() {
      this.products = readJSON(localStorage, STORAGE_KEYS.products, [])
      const cart = readJSON(localStorage, STORAGE_KEYS.cart, [])
      const orders = readJSON(localStorage, STORAGE_KEYS.orders, [])
      this.cartCount = cart.reduce((acc, item) => acc + Number(item.quantity || 0), 0)
      this.ordersCount = orders.length
    },
    goCatalog() {
      this.$router.push('/dashboard/catalogo')
    },
    formatPrice(value) {
      return Number(value).toLocaleString('es-CO')
    }
  }
}
</script>
