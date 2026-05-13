<template>
  <div class="row g-4">
    <div class="col-lg-8">
      <div class="card shadow-soft border-0">
        <div class="card-header bg-white border-0 pt-4 px-4">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 class="mb-1">Carrito de compras</h4>
              <p class="text-muted mb-0">Ajusta cantidades y confirma el pedido.</p>
            </div>
            <span class="badge text-bg-light text-dark px-3 py-2">{{ cartCount }} artículos</span>
          </div>
        </div>

        <div class="card-body">
          <div v-if="!cart.length" class="text-muted py-4 text-center">
            Tu carrito está vacío.
          </div>

          <div v-else class="vstack gap-3">
            <div v-for="item in cart" :key="item.id" class="d-flex gap-3 border rounded-4 p-3">
              <img :src="item.image" :alt="item.name" width="88" height="88" class="rounded-3 object-cover">
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between gap-2 flex-wrap">
                  <div>
                    <div class="fw-semibold">{{ item.name }}</div>
                    <div class="text-muted small">{{ item.category }}</div>
                  </div>
                  <div class="fw-semibold">${{ formatPrice(item.price * item.quantity) }}</div>
                </div>

                <div class="d-flex align-items-center gap-2 mt-3 flex-wrap">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" @click="decreaseQty(item)">-</button>
                    <button class="btn btn-light" disabled>{{ item.quantity }}</button>
                    <button class="btn btn-outline-secondary" @click="increaseQty(item)">+</button>
                  </div>
                  <button class="btn btn-outline-danger btn-sm ms-auto" @click="removeItem(item.id)">
                    Quitar
                  </button>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between fw-semibold fs-5 pt-2">
              <span>Total</span>
              <span>${{ formatPrice(cartTotal) }}</span>
            </div>

            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-outline-danger" @click="clearCart">Vaciar carrito</button>
              <button class="btn btn-primary" :disabled="!cart.length" @click="checkout">Confirmar compra</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-4">
      <div class="vstack gap-4">
        <div class="card shadow-soft border-0">
          <div class="card-body">
            <h5 class="mb-3">Datos del cliente</h5>
            <div class="vstack gap-3">
              <div>
                <label class="form-label">Nombre</label>
                <input v-model.trim="buyer.name" type="text" class="form-control" placeholder="Nombre completo">
              </div>
              <div>
                <label class="form-label">Correo</label>
                <input v-model.trim="buyer.email" type="email" class="form-control" placeholder="correo@mail.com">
              </div>
              <div>
                <label class="form-label">Dirección</label>
                <input v-model.trim="buyer.address" type="text" class="form-control" placeholder="Dirección de entrega">
              </div>
              <div>
                <label class="form-label">Pago</label>
                <select v-model="buyer.payment" class="form-select">
                  <option>Efectivo</option>
                  <option>Tarjeta</option>
                  <option>Transferencia</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="card shadow-soft border-0">
          <div class="card-body">
            <h5 class="mb-3">Última compra</h5>
            <div v-if="lastOrder" class="small text-muted">
              <div class="mb-1">Pedido #{{ lastOrder.id }}</div>
              <div>Total: ${{ formatPrice(lastOrder.total) }}</div>
              <div>Estado: {{ lastOrder.status }}</div>
            </div>
            <div v-else class="text-muted">Aún no hay compras registradas.</div>
          </div>
        </div>

        <div v-if="message" class="alert shadow-soft border-0" :class="'alert-' + message.type">
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { readJSON, writeJSON, STORAGE_KEYS } from '../utils/storage'

export default {
  name: 'CartView',
  data() {
    return {
      cart: [],
      orders: [],
      buyer: {
        name: '',
        email: '',
        address: '',
        payment: 'Tarjeta'
      },
      message: {
        type: '',
        text: ''
      },
      lastOrder: null
    }
  },
  computed: {
    cartCount() {
      return this.cart.reduce((acc, item) => acc + Number(item.quantity || 0), 0)
    },
    cartTotal() {
      return this.cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0)
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
      this.cart = readJSON(localStorage, STORAGE_KEYS.cart, [])
      this.orders = readJSON(localStorage, STORAGE_KEYS.orders, [])
      this.lastOrder = this.orders[0] || null
    },
    saveCart() {
      writeJSON(localStorage, STORAGE_KEYS.cart, this.cart)
    },
    saveOrders() {
      writeJSON(localStorage, STORAGE_KEYS.orders, this.orders)
    },
    increaseQty(item) {
      const target = this.cart.find((entry) => entry.id === item.id)
      if (!target) return
      if (target.quantity >= Number(target.stock)) {
        this.showMessage('warning', 'No hay más stock disponible para este producto.')
        return
      }
      target.quantity += 1
      this.saveCart()
      this.loadState()
    },
    decreaseQty(item) {
      const target = this.cart.find((entry) => entry.id === item.id)
      if (!target) return
      target.quantity -= 1
      if (target.quantity <= 0) {
        this.cart = this.cart.filter((entry) => entry.id !== item.id)
      }
      this.saveCart()
      this.loadState()
    },
    removeItem(id) {
      this.cart = this.cart.filter((item) => item.id !== id)
      this.saveCart()
      this.loadState()
    },
    clearCart() {
      this.cart = []
      this.saveCart()
      this.loadState()
    },
    checkout() {
      if (!this.cart.length) {
        this.showMessage('warning', 'Agrega productos antes de confirmar la compra.')
        return
      }

      if (!this.buyer.name || !this.buyer.email || !this.buyer.address) {
        this.showMessage('danger', 'Completa los datos del cliente.')
        return
      }

      const order = {
        id: Date.now(),
        customer: { ...this.buyer },
        items: this.cart.map((item) => ({ ...item })),
        total: this.cartTotal,
        status: 'Confirmado',
        createdAt: new Date().toISOString()
      }

      this.orders = [order, ...this.orders]
      this.lastOrder = order
      this.saveOrders()
      this.clearCart()
      this.showMessage('success', 'Pedido confirmado correctamente.')
    },
    showMessage(type, text) {
      this.message = { type, text }
      window.clearTimeout(this._messageTimer)
      this._messageTimer = window.setTimeout(() => {
        this.message = { type: '', text: '' }
      }, 2200)
    },
    formatPrice(value) {
      return Number(value).toLocaleString('es-CO')
    }
  }
}
</script>
