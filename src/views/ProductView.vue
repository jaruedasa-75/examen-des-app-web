<template>
  <div class="vstack gap-4">
    <div v-if="alert.message" class="alert shadow-soft border-0" :class="'alert-' + alert.type">
      {{ alert.message }}
    </div>

    <div class="card shadow-soft border-0">
      <div class="card-header bg-white border-0 pt-4 px-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 class="mb-1">Inventario</h5>
            <p class="text-muted mb-0">Tabla principal para administrar el catálogo.</p>
          </div>
          <button class="btn btn-primary btn-sm" @click="openCreateModal">
            <i class="bi bi-plus-circle me-1"></i>Nuevo producto
          </button>
        </div>
      </div>

      <div class="card-body border-top">
        <div v-if="loading" class="text-center text-muted py-5">
          <div class="spinner-border text-primary mb-2" role="status"></div>
          <div>Cargando productos...</div>
        </div>

        <div v-else-if="loadError" class="alert alert-danger border-0">
          <i class="bi bi-exclamation-triangle me-1"></i>{{ loadError }}
        </div>

        <template v-else>
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
                <option v-for="categoria in categories" :key="categoria" :value="categoria">{{ categoria }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="sortBy" class="form-select">
                <option value="destacado">Destacados primero</option>
                <option value="precioAsc">Precio: menor a mayor</option>
                <option value="precioDesc">Precio: mayor a menor</option>
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
                      <img :src="product.imagen" :alt="product.nombre" width="56" height="56" class="rounded-4 object-cover border">
                      <div>
                        <div class="fw-semibold">{{ product.nombre }}</div>
                        <div class="small text-muted">{{ product.tallas }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ product.categoria }}</td>
                  <td>${{ formatPrice(product.precio) }}</td>
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
                      <button class="btn btn-outline-primary" @click="openEditModal(product)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-outline-danger" @click="openDeleteModal(product)">
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
        </template>
      </div>
    </div>

    <!-- Modal Ver detalle -->
    <div v-if="selectedProduct" class="modal fade show d-block" tabindex="-1" style="background: rgba(15,23,42,.55);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-soft">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedProduct.nombre }}</h5>
            <button type="button" class="btn-close" @click="selectedProduct = null"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3 align-items-center">
              <div class="col-md-5">
                <img :src="selectedProduct.imagen" :alt="selectedProduct.nombre" class="img-fluid rounded-4 object-cover" style="width: 100%; height: 280px;">
              </div>
              <div class="col-md-7">
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge text-bg-dark">{{ selectedProduct.categoria }}</span>
                  <span class="badge text-bg-light text-dark">Stock {{ selectedProduct.stock }}</span>
                  <span class="badge text-bg-light text-dark">Tallas {{ selectedProduct.tallas }}</span>
                </div>
                <p class="text-muted">{{ selectedProduct.descripcion }}</p>
                <div class="fw-bold fs-3">${{ formatPrice(selectedProduct.precio) }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="selectedProduct = null">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear / Editar producto -->
    <div v-if="showFormModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(15,23,42,.55);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-soft">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi me-1" :class="isEditing ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
              {{ isEditing ? 'Editar producto' : 'Nuevo producto' }}
            </h5>
            <button type="button" class="btn-close" @click="closeFormModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-warning border-0 py-2 small">{{ formError }}</div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre</label>
                <input v-model.trim="form.nombre" type="text" class="form-control" placeholder="Ej. Chaqueta Denim Urbana">
              </div>
              <div class="col-md-6">
                <label class="form-label">Categoría</label>
                <input v-model.trim="form.categoria" type="text" class="form-control" placeholder="Ej. Chaquetas">
              </div>
              <div class="col-md-4">
                <label class="form-label">Precio</label>
                <input v-model.number="form.precio" type="number" min="0" class="form-control" placeholder="189900">
              </div>
              <div class="col-md-4">
                <label class="form-label">Stock</label>
                <input v-model.number="form.stock" type="number" min="0" class="form-control" placeholder="10">
              </div>
              <div class="col-md-4">
                <label class="form-label">Color</label>
                <input v-model.trim="form.color" type="text" class="form-control" placeholder="Azul oscuro">
              </div>
              <div class="col-md-6">
                <label class="form-label">Imagen (URL)</label>
                <input v-model.trim="form.imagen" type="url" class="form-control" placeholder="https://...">
              </div>
              <div class="col-md-6">
                <label class="form-label">Tallas</label>
                <input v-model.trim="form.tallas" type="text" class="form-control" placeholder="S, M, L, XL">
              </div>
              <div class="col-12">
                <label class="form-label">Descripción</label>
                <textarea v-model.trim="form.descripcion" rows="3" class="form-control" placeholder="Describe la prenda"></textarea>
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input v-model="form.destacado" class="form-check-input" type="checkbox" id="destacadoCheck">
                  <label class="form-check-label" for="destacadoCheck">Destacar en el catálogo</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="closeFormModal">Cancelar</button>
            <button type="button" class="btn btn-primary" :disabled="saving" @click="submitForm">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEditing ? 'Guardar cambios' : 'Crear producto' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmar eliminación -->
    <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(15,23,42,.55);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-soft">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-exclamation-triangle text-danger me-1"></i>Eliminar producto</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              ¿Deseas eliminar <strong>{{ productToDelete && productToDelete.nombre }}</strong> del inventario?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="closeDeleteModal">Cancelar</button>
            <button type="button" class="btn btn-danger" :disabled="deleting" @click="confirmDelete">
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-trash me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'

export default {
  name: 'ProductView',
  data() {
    return {
      products: [],
      loading: false,
      loadError: '',
      search: '',
      categoryFilter: 'Todos',
      sortBy: 'destacado',
      selectedProduct: null,
      showFormModal: false,
      showDeleteModal: false,
      isEditing: false,
      editingId: null,
      saving: false,
      deleting: false,
      formError: '',
      form: this.emptyProduct(),
      productToDelete: null,
      alert: { type: '', message: '' }
    }
  },
  computed: {
    categories() {
      return [...new Set(this.products.map((item) => item.categoria).filter(Boolean))]
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

      if (this.sortBy === 'precioAsc') {
        list = [...list].sort((a, b) => Number(a.precio) - Number(b.precio))
      } else if (this.sortBy === 'precioDesc') {
        list = [...list].sort((a, b) => Number(b.precio) - Number(a.precio))
      } else if (this.sortBy === 'stockDesc') {
        list = [...list].sort((a, b) => Number(b.stock) - Number(a.stock))
      } else {
        list = [...list].sort((a, b) => Number(b.destacado) - Number(a.destacado))
      }

      return list
    }
  },
  mounted() {
    this.loadProducts()
  },
  methods: {
    emptyProduct() {
      return {
        nombre: '',
        categoria: '',
        precio: null,
        stock: 0,
        descripcion: '',
        imagen: '',
        tallas: '',
        color: '',
        destacado: false
      }
    },
    async loadProducts() {
      this.loading = true
      this.loadError = ''
      try {
        const { data } = await getProducts()
        this.products = data
      } catch (err) {
        this.loadError = 'No se pudo cargar el inventario. Verifica la conexión a MockAPI.'
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.isEditing = false
      this.editingId = null
      this.form = this.emptyProduct()
      this.formError = ''
      this.showFormModal = true
    },
    openEditModal(product) {
      this.isEditing = true
      this.editingId = product.id
      this.form = { ...this.emptyProduct(), ...product }
      this.formError = ''
      this.showFormModal = true
    },
    closeFormModal() {
      this.showFormModal = false
    },
    async submitForm() {
      if (!this.form.nombre || !this.form.categoria || !this.form.descripcion || !this.form.imagen || !this.form.precio) {
        this.formError = 'Completa todos los campos obligatorios.'
        return
      }

      const payload = {
        ...this.form,
        precio: Number(this.form.precio),
        stock: Number(this.form.stock),
        destacado: Boolean(this.form.destacado)
      }

      this.saving = true
      this.formError = ''

      try {
        if (this.isEditing) {
          await updateProduct(this.editingId, payload)
          this.setAlert('success', 'Producto actualizado correctamente.')
        } else {
          await createProduct(payload)
          this.setAlert('success', 'Producto agregado correctamente.')
        }
        this.showFormModal = false
        await this.loadProducts()
      } catch (err) {
        this.formError = 'No se pudo guardar el producto. Intenta de nuevo.'
      } finally {
        this.saving = false
      }
    },
    openDeleteModal(product) {
      this.productToDelete = product
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.productToDelete = null
    },
    async confirmDelete() {
      if (!this.productToDelete) return
      this.deleting = true
      try {
        await deleteProduct(this.productToDelete.id)
        this.setAlert('success', 'Producto eliminado correctamente.')
        this.closeDeleteModal()
        await this.loadProducts()
      } catch (err) {
        this.setAlert('danger', 'No se pudo eliminar el producto.')
      } finally {
        this.deleting = false
      }
    },
    openDetails(product) {
      this.selectedProduct = product
    },
    setAlert(type, message) {
      this.alert = { type, message }
      window.clearTimeout(this._alertTimer)
      this._alertTimer = window.setTimeout(() => {
        this.alert = { type: '', message: '' }
      }, 2800)
    },
    formatPrice(value) {
      return Number(value).toLocaleString('es-CO')
    }
  }
}
</script>
