<template>
  <div class="min-vh-100">
    <NavbarComponent
      :brand-title="brandTitle"
      brand-subtitle="Panel administrativo"
      :user-name="userName"
      :cart-count="cartCount"
      @logout="logout"
    />

    <div class="container-fluid py-4">
      <div class="row g-4">
        <div class="col-lg-3 col-xl-2">
          <SidebarComponent
            :brand-title="brandTitle"
            brand-subtitle="Moda, pedidos y stock"
            :user-name="userName"
            :user-role="userRole"
          />
        </div>

        <div class="col-lg-9 col-xl-10">
          <router-view />
        </div>
      </div>
    </div>

    <FooterComponent :brand-title="brandTitle" />
  </div>
</template>

<script>
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import { clearAuth, getAuth, readJSON, STORAGE_KEYS } from '../utils/storage'

export default {
  name: 'DashboardView',
  components: {
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  },
  data() {
    return {
      brandTitle: 'Moda Luma',
      userName: 'Usuario',
      userRole: 'Cliente',
      cartCount: 0
    }
  },
  mounted() {
    this.refreshSession()
    this.refreshCart()
    this._onStorage = () => {
      this.refreshSession()
      this.refreshCart()
    }
    window.addEventListener('shop:storage', this._onStorage)
  },
  beforeUnmount() {
    window.removeEventListener('shop:storage', this._onStorage)
  },
  methods: {
    refreshSession() {
      const auth = getAuth()
      if (auth) {
        this.userName = auth.nombre || auth.usuario || 'Usuario'
        this.userRole = auth.rol || 'Cliente'
      }
    },
    refreshCart() {
      const cart = readJSON(localStorage, STORAGE_KEYS.cart, [])
      this.cartCount = cart.reduce((acc, item) => acc + Number(item.quantity || 0), 0)
    },
    logout() {
      clearAuth()
      this.$router.push('/login')
    }
  }
}
</script>
