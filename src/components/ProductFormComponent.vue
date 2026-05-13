<template>
  <div class="card shadow-soft border-0 mb-4">
    <div class="card-header bg-white border-0 pt-4 px-4">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h5 class="mb-1">{{ isEditing ? 'Editar producto' : 'Nuevo producto' }}</h5>
          <p class="text-muted mb-0">Completa la información de la prenda para guardarla.</p>
        </div>
        <span class="badge text-bg-light text-dark">
          <i class="bi bi-bag-check me-1"></i>Inventario
        </span>
      </div>
    </div>

    <div class="card-body p-4">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Nombre</label>
          <input v-model.trim="localProduct.name" type="text" class="form-control" placeholder="Ej. Chaqueta Denim Urbana">
        </div>

        <div class="col-md-6">
          <label class="form-label">Categoría</label>
          <input v-model.trim="localProduct.category" type="text" class="form-control" placeholder="Ej. Chaquetas">
        </div>

        <div class="col-md-4">
          <label class="form-label">Precio</label>
          <input v-model.number="localProduct.price" type="number" min="0" class="form-control" placeholder="189900">
        </div>

        <div class="col-md-4">
          <label class="form-label">Stock</label>
          <input v-model.number="localProduct.stock" type="number" min="0" class="form-control" placeholder="10">
        </div>

        <div class="col-md-4">
          <label class="form-label">Color</label>
          <input v-model.trim="localProduct.color" type="text" class="form-control" placeholder="Azul oscuro">
        </div>

        <div class="col-md-6">
          <label class="form-label">Imagen</label>
          <input v-model.trim="localProduct.image" type="url" class="form-control" placeholder="https://...">
        </div>

        <div class="col-md-6">
          <label class="form-label">Tallas</label>
          <input v-model.trim="localProduct.sizes" type="text" class="form-control" placeholder="S, M, L, XL">
        </div>

        <div class="col-12">
          <label class="form-label">Descripción</label>
          <textarea v-model.trim="localProduct.description" rows="3" class="form-control" placeholder="Describe la prenda"></textarea>
        </div>

        <div class="col-12">
          <div class="form-check">
            <input v-model="localProduct.featured" class="form-check-input" type="checkbox" id="featuredCheck">
            <label class="form-check-label" for="featuredCheck">
              Destacar en el catálogo
            </label>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2 justify-content-end mt-4">
        <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">
          Limpiar
        </button>
        <button type="button" class="btn btn-primary" @click="submitForm">
          {{ isEditing ? 'Actualizar' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductFormComponent',
  props: {
    product: { type: Object, required: true },
    isEditing: { type: Boolean, default: false }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      localProduct: this.createEmptyProduct()
    }
  },
  watch: {
    product: {
      immediate: true,
      deep: true,
      handler(value) {
        this.localProduct = {
          ...this.createEmptyProduct(),
          ...value
        }
      }
    }
  },
  methods: {
    createEmptyProduct() {
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
    submitForm() {
      this.$emit('save', {
        ...this.localProduct,
        price: Number(this.localProduct.price) || 0,
        stock: Number(this.localProduct.stock) || 0
      })
    }
  }
}
</script>
