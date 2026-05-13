<template>
  <aside class="sidebar-sticky">
    <div class="card shadow-soft border-0 mb-3">
      <div class="card-body">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-4 bg-dark text-white d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
            <i class="bi bi-shop"></i>
          </div>
          <div>
            <h5 class="mb-0">{{ brandTitle }}</h5>
            <small class="text-muted">{{ brandSubtitle }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="list-group shadow-soft rounded-4 overflow-hidden">
      <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to" class="list-group-item list-group-item-action d-flex align-items-center gap-2" active-class="active">
        <i :class="item.icon"></i>
        {{ item.label }}
      </RouterLink>
    </div>

    <div class="card shadow-soft border-0 mt-3">
      <div class="card-body">
        <div class="small text-muted mb-1">Sesión activa</div>
        <div class="fw-semibold">{{ userName }}</div>
        <div class="text-muted small">{{ userRole }}</div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'SidebarComponent',
  props: {
    brandTitle: { type: String, default: 'Moda Luma' },
    brandSubtitle: { type: String, default: 'Panel de gestión' },
    userName: { type: String, default: 'Usuario' },
    userRole: { type: String, default: 'Cliente' }
  },
  computed: {
    menuItems() {
      const base = [
        { to: '/dashboard/catalogo', label: 'Catálogo', icon: 'bi bi-grid' },
        { to: '/dashboard/carrito', label: 'Carrito', icon: 'bi bi-cart3' },
        { to: '/dashboard/pedidos', label: 'Pedidos', icon: 'bi bi-receipt' }
      ]

      if (this.userRole === 'Admin') {
        return [
          { to: '/dashboard/inicio', label: 'Inicio', icon: 'bi bi-house-door' },
          { to: '/dashboard/catalogo', label: 'Catálogo', icon: 'bi bi-grid' },
          { to: '/dashboard/productos', label: 'Productos', icon: 'bi bi-bag' },
          { to: '/dashboard/clientes', label: 'Clientes', icon: 'bi bi-people' },
          { to: '/dashboard/pedidos', label: 'Pedidos', icon: 'bi bi-receipt' }
        ]
      }

      return base
    }
  }
}
</script>
