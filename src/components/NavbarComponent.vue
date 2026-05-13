<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-brand shadow-soft px-3 px-lg-4 py-3 rounded-bottom-4">
    <div class="d-flex align-items-center gap-3">
      <div class="rounded-circle bg-white text-dark d-flex align-items-center justify-content-center fw-bold" style="width: 44px; height: 44px;">
        <i class="bi bi-bag-check"></i>
      </div>
      <div>
        <span class="navbar-brand fw-semibold mb-0">{{ brandTitle }}</span>
        <div class="text-white-50 small">{{ brandSubtitle }}</div>
      </div>
    </div>

    <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#topNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div id="topNavbar" class="collapse navbar-collapse">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3 mt-3 mt-lg-0">
        <li class="nav-item">
          <span class="badge text-bg-light text-dark px-3 py-2">
            <i class="bi bi-person-circle me-1"></i>{{ userName }}
          </span>
        </li>
        <li class="nav-item">
          <span class="badge text-bg-warning px-3 py-2 text-dark">
            <i class="bi bi-cart3 me-1"></i>{{ cartCount }} en carrito
          </span>
        </li>
        <li class="nav-item">
          <button class="btn btn-outline-light btn-sm px-3" @click="$emit('logout')">
            <i class="bi bi-box-arrow-right me-1"></i>Salir
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavbarComponent',
  props: {
    brandTitle: { type: String, default: 'Moda Luma' },
    brandSubtitle: { type: String, default: 'Tienda de ropa' },
    userName: { type: String, default: 'Usuario' },
    cartCount: { type: Number, default: 0 }
  }
}
</script>
