<template>
  <div class="card shadow-soft border-0">
    <div class="card-header bg-white border-0 pt-4 px-4">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h5 class="mb-1">Pedidos</h5>
          <p class="text-muted mb-0">Historial de compras realizadas.</p>
        </div>
        <button class="btn btn-outline-danger btn-sm" @click="clearOrders" :disabled="!orders.length">
          Limpiar historial
        </button>
      </div>
    </div>

    <div class="card-body">
      <div v-if="!orders.length" class="text-muted text-center py-5">
        No hay pedidos registrados.
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td class="fw-semibold">{{ order.id }}</td>
              <td>{{ order.customer.name }}</td>
              <td>{{ order.items.length }}</td>
              <td>${{ formatPrice(order.total) }}</td>
              <td><span class="badge text-bg-success">{{ order.status }}</span></td>
              <td>{{ formatDate(order.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { readJSON, writeJSON, STORAGE_KEYS } from '../utils/storage'

export default {
  name: 'OrdersView',
  data() {
    return {
      orders: []
    }
  },
  mounted() {
    this.loadOrders()
    this._onStorage = () => this.loadOrders()
    window.addEventListener('shop:storage', this._onStorage)
  },
  beforeUnmount() {
    window.removeEventListener('shop:storage', this._onStorage)
  },
  methods: {
    loadOrders() {
      this.orders = readJSON(localStorage, STORAGE_KEYS.orders, [])
    },
    clearOrders() {
      if (!window.confirm('¿Deseas borrar todo el historial de pedidos?')) return
      this.orders = []
      writeJSON(localStorage, STORAGE_KEYS.orders, this.orders)
    },
    formatPrice(value) {
      return Number(value).toLocaleString('es-CO')
    },
    formatDate(value) {
      return new Date(value).toLocaleString('es-CO')
    }
  }
}
</script>
