<template>
  <div class="vstack gap-4">
    <div v-if="alert.message" class="alert shadow-soft border-0" :class="'alert-' + alert.type">
      {{ alert.message }}
    </div>

    <ProductFormComponent
      :product="form"
      :is-editing="editingId !== null"
      @save="saveProduct"
      @cancel="resetForm"
    />

    <div class="card shadow-soft border-0">
      <div class="card-header bg-white border-0 pt-4 px-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 class="mb-1">Inventario</h5>
            <p class="text-muted mb-0">Tabla principal para administrar el catálogo.</p>
          </div>
          <button class="btn btn-outline-secondary btn-sm" @click="resetForm">
            <i class="bi bi-arrow-counterclockwise me-1"></i>Nuevo producto
          </button>
        </div>
      </div>

      <div class="card-body border-top">
        <div class="row g-3 mb-4">
          <div class="col-md-5">
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
              <input v-model.trim="search" type="text" class="form-control" placeholder="Buscar producto">
            </div>
          </div>
          <div class="col-md-4">
            <select v-model="categoryFilter" class="form-select">
              <option value="Todos">Todos los productos</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
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

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Prenda</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Color</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id">
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <img :src="product.image" :alt="product.name" width="56" height="56" class="rounded-4 object-cover border">
                    <div>
                      <div class="fw-semibold">{{ product.name }}</div>
                      <div class="small text-muted">{{ product.sizes }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ product.category }}</td>
                <td>${{ formatPrice(product.price) }}</td>
                <td>
                  <span class="badge" :class="product.stock <= 5 ? 'text-bg-danger' : 'text-bg-success'">
                    {{ product.stock }}
                  </span>
                </td>
                <td>{{ product.color }}</td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm flex-wrap" role="group">
                    <button class="btn btn-outline-secondary" @click="openDetails(product)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-primary" @click="editProduct(product)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="deleteProduct(product.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredProducts.length">
                <td colspan="6" class="text-center text-muted py-5">No hay productos que coincidan con el filtro.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="selectedProduct" class="modal fade show d-block" tabindex="-1" style="background: rgba(15,23,42,.55);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-soft">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedProduct.name }}</h5>
            <button type="button" class="btn-close" @click="selectedProduct = null"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3 align-items-center">
              <div class="col-md-5">
                <img :src="selectedProduct.image" :alt="selectedProduct.name" class="img-fluid rounded-4 object-cover" style="width: 100%; height: 280px;">
              </div>
              <div class="col-md-7">
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge text-bg-dark">{{ selectedProduct.category }}</span>
                  <span class="badge text-bg-light text-dark">Stock {{ selectedProduct.stock }}</span>
                  <span class="badge text-bg-light text-dark">Tallas {{ selectedProduct.sizes }}</span>
                </div>
                <p class="text-muted">{{ selectedProduct.description }}</p>
                <div class="fw-bold fs-3">${{ formatPrice(selectedProduct.price) }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="selectedProduct = null">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productsSeed from '../assets/products.json'
import ProductFormComponent from '../components/ProductFormComponent.vue'
import { readJSON, writeJSON, STORAGE_KEYS } from '../utils/storage'

export default {
  name: 'ProductView',
  components: {
    ProductFormComponent
  },
  data() {
    return {
      products: [],
      form: this.emptyProduct(),
      editingId: null,
      search: '',
      categoryFilter: 'Todos',
      sortBy: 'featured',
      selectedProduct: null,
      alert: {
        type: '',
        message: ''
      }
    }
  },
  computed: {
    categories() {
      return [...new Set(this.products.map((item) => item.category).filter(Boolean))]
    },
    filteredProducts() {
      const term = this.search.toLowerCase().trim()
      let list = this.products.filter((product) => {
        const matchesSearch =
          !term ||
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)

        const matchesCategory =
          this.categoryFilter === 'Todos' || product.category === this.categoryFilter

        return matchesSearch && matchesCategory
      })

      if (this.sortBy === 'priceAsc') {
        list = [...list].sort((a, b) => Number(a.price) - Number(b.price))
      } else if (this.sortBy === 'priceDesc') {
        list = [...list].sort((a, b) => Number(b.price) - Number(a.price))
      } else if (this.sortBy === 'stockDesc') {
        list = [...list].sort((a, b) => Number(b.stock) - Number(a.stock))
      } else {
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
      }

      return list
    }
  },
  mounted() {
    this.loadProducts()
    this._onStorage = () => this.loadProducts()
    window.addEventListener('shop:storage', this._onStorage)
  },
  beforeUnmount() {
    window.removeEventListener('shop:storage', this._onStorage)
  },
  methods: {
    emptyProduct() {
      return {
        id: null,
        name: '',
        category: '',
        price: null,
        stock: 0,
        description: '',
        image: '',
        sizes: '',
        color: '',
        featured: false
      }
    },
    loadProducts() {
      const saved = readJSON(localStorage, STORAGE_KEYS.products, null)
      if (saved && Array.isArray(saved) && saved.length) {
        this.products = saved
      } else {
        this.products = productsSeed.map((item) => ({ ...item }))
        this.saveProducts()
      }
    },
    saveProducts() {
      writeJSON(localStorage, STORAGE_KEYS.products, this.products)
    },
    resetForm() {
      this.form = this.emptyProduct()
      this.editingId = null
    },
    editProduct(product) {
      this.editingId = product.id
      this.form = { ...this.emptyProduct(), ...product }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    saveProduct(payload) {
      if (!payload.name || !payload.category || !payload.description || !payload.image || !payload.price) {
        this.setAlert('danger', 'Completa todos los campos obligatorios.')
        return
      }

      const product = {
        ...payload,
        id: this.editingId ?? Date.now(),
        price: Number(payload.price),
        stock: Number(payload.stock),
        featured: Boolean(payload.featured)
      }

      if (this.editingId) {
        const index = this.products.findIndex((item) => item.id === this.editingId)
        if (index !== -1) {
          this.products.splice(index, 1, product)
        }
        this.setAlert('success', 'Producto actualizado correctamente.')
      } else {
        this.products.unshift(product)
        this.setAlert('success', 'Producto agregado correctamente.')
      }

      this.saveProducts()
      this.resetForm()
    },
    deleteProduct(id) {
      if (!window.confirm('¿Deseas eliminar este producto?')) return
      this.products = this.products.filter((item) => item.id !== id)
      this.saveProducts()
      this.setAlert('success', 'Producto eliminado correctamente.')
    },
    openDetails(product) {
      this.selectedProduct = product
    },
    setAlert(type, message) {
      this.alert = { type, message }
      window.clearTimeout(this._alertTimer)
      this._alertTimer = window.setTimeout(() => {
        this.alert = { type: '', message: '' }
      }, 2500)
    },
    formatPrice(value) {
      return Number(value).toLocaleString('es-CO')
    }
  }
}
</script>
