<template>
  <div class="min-vh-100 d-flex align-items-center py-5 bg-brand-soft">
    <div class="container">
      <div class="row justify-content-center align-items-center g-4">
        <div class="col-lg-6">
          <div class="pe-lg-5">
            <span class="badge text-bg-dark mb-3 px-3 py-2">Moda Luma</span>
            <h1 class="display-5 fw-bold mb-3">Gestiona tu tienda de ropa desde un panel limpio y rápido.</h1>
            <p class="lead text-muted mb-4">
              Controla tu inventario, administra el catálogo y registra ventas con carrito y almacenamiento local.
            </p>

            <div class="row g-3">
              <div class="col-sm-4">
                <div class="card border-0 shadow-soft h-100">
                  <div class="card-body">
                    <i class="bi bi-bag-heart fs-3 text-primary"></i>
                    <h6 class="mt-3 mb-1">Catálogo</h6>
                    <small class="text-muted">Productos destacados y stock.</small>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="card border-0 shadow-soft h-100">
                  <div class="card-body">
                    <i class="bi bi-cart3 fs-3 text-success"></i>
                    <h6 class="mt-3 mb-1">Carrito</h6>
                    <small class="text-muted">Agrega y confirma compras.</small>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="card border-0 shadow-soft h-100">
                  <div class="card-body">
                    <i class="bi bi-shield-check fs-3 text-warning"></i>
                    <h6 class="mt-3 mb-1">Acceso</h6>
                    <small class="text-muted">Ingreso con usuarios locales.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card border-0 shadow-soft glass-card">
            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-dark text-white" style="width: 60px; height: 60px;">
                  <i class="bi bi-person-lock fs-4"></i>
                </div>
                <h3 class="mt-3 mb-1">Iniciar sesión</h3>
                <p class="text-muted mb-0">Acceso al panel</p>
              </div>

              <div v-if="error" class="alert alert-danger">{{ error }}</div>

              <form @submit.prevent="login" class="vstack gap-3">
                <div>
                  <label class="form-label">Usuario</label>
                  <input v-model.trim="usuario" type="text" class="form-control form-control-lg" placeholder="admin">
                </div>

                <div>
                  <label class="form-label">Contraseña</label>
                  <input v-model.trim="password" type="password" class="form-control form-control-lg" placeholder="1234">
                </div>

                <button class="btn btn-primary btn-lg w-100" type="submit" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Entrar
                </button>
              </form>

              <div class="mt-4 p-3 rounded-4 bg-light">
                <div class="fw-semibold mb-1">Acceso</div>
                <div class="small text-muted">Ingresa con un usuario registrado en el panel de Usuarios.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers } from '../services/userService'
import { getAuth, setAuth, generateToken } from '../utils/storage'

export default {
  name: 'LoginView',
  data() {
    return {
      usuario: '',
      password: '',
      error: '',
      loading: false
    }
  },
  mounted() {
    if (getAuth()) {
      this.$router.replace('/dashboard')
    }
  },
  methods: {
    async login() {
      this.error = ''

      if (!this.usuario || !this.password) {
        this.error = 'Completa usuario y contraseña.'
        return
      }

      this.loading = true

      try {
        const { data } = await getUsers()
        const match = data.find(
          (item) => item.usuario === this.usuario && item.password === this.password
        )

        if (match) {
          setAuth({
            id: match.id,
            usuario: match.usuario,
            nombre: match.nombre,
            rol: match.rol,
            token: generateToken(match.usuario)
          })
          this.$router.push('/dashboard')
        } else {
          this.error = 'Usuario o contraseña incorrectos.'
        }
      } catch (err) {
        this.error = 'No se pudo conectar con el servidor. Verifica tu conexión.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
