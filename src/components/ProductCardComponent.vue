<template>
  <div class="card h-100 shadow-soft border-0 overflow-hidden">
    <div class="position-relative">
      <img :src="product.image" :alt="product.name" class="card-img-top object-cover" style="height: 230px;" />
      <span class="badge text-bg-dark position-absolute top-0 start-0 m-3">{{ product.category }}</span>
      <span v-if="product.featured" class="badge text-bg-warning text-dark position-absolute top-0 end-0 m-3">
        Destacado
      </span>
    </div>

    <div class="card-body d-flex flex-column">
      <h6 class="card-title mb-2">{{ product.name }}</h6>
      <p class="card-text text-muted small mb-3 text-truncate-2">{{ product.description }}</p>

      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong class="fs-5">${{ formatPrice(product.price) }}</strong>
        <span class="badge text-bg-light text-dark">Stock {{ product.stock }}</span>
      </div>

      <div class="small text-muted mb-3">
        <div><i class="bi bi-palette me-1"></i>{{ product.color }}</div>
        <div><i class="bi bi-aspect-ratio me-1"></i>{{ product.sizes }}</div>
      </div>

      <div class="mt-auto d-grid gap-2">
        <button class="btn btn-outline-primary btn-sm" @click="$emit('details', product)">
          <i class="bi bi-eye me-1"></i>Ver detalles
        </button>
        <button class="btn btn-primary btn-sm" @click="$emit('add-to-cart', product)">
          <i class="bi bi-cart-plus me-1"></i>Agregar al carrito
        </button>

        <div v-if="editable" class="btn-group btn-group-sm">
          <button class="btn btn-outline-secondary" @click="$emit('edit', product)">
            <i class="bi bi-pencil-square me-1"></i>Editar
          </button>
          <button class="btn btn-outline-danger" @click="$emit('delete', product)">
            <i class="bi bi-trash me-1"></i>Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCardComponent',
  props: {
    product: { type: Object, required: true },
    editable: { type: Boolean, default: false }
  },
  methods: {
    formatPrice(value) {
      return Number(value).toLocaleString('es-CO')
    }
  }
}
</script>
