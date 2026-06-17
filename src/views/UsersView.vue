<template>
  <div class="vstack gap-4">
    <div v-if="alert.message" class="alert shadow-soft border-0" :class="'alert-' + alert.type">
      {{ alert.message }}
    </div>

    <div class="card shadow-soft border-0">
      <div class="card-header bg-white border-0 pt-4 px-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 class="mb-1">Usuarios</h5>
            <p class="text-muted mb-0">Administra las cuentas que pueden ingresar al panel.</p>
          </div>
          <button class="btn btn-primary btn-sm" @click="openCreateModal">
            <i class="bi bi-person-plus me-1"></i>Nuevo usuario
          </button>
        </div>
      </div>

      <div class="card-body border-top">
        <div v-if="loading" class="text-center text-muted py-5">
          <div class="spinner-border text-primary mb-2" role="status"></div>
          <div>Cargando usuarios...</div>
        </div>

        <div v-else-if="loadError" class="alert alert-danger border-0">
          <i class="bi bi-exclamation-triangle me-1"></i>{{ loadError }}
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="fw-semibold">{{ user.nombre }}</td>
                <td>{{ user.usuario }}</td>
                <td>
                  <span class="badge" :class="user.rol === 'Admin' ? 'text-bg-dark' : 'text-bg-secondary'">
                    {{ user.rol }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary" @click="openEditModal(user)">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="openDeleteModal(user)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!users.length">
                <td colspan="4" class="text-center text-muted py-5">No hay usuarios registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Crear / Editar usuario -->
    <div v-if="showFormModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(15,23,42,.55);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-soft">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi me-1" :class="isEditing ? 'bi-pencil-square' : 'bi-person-plus'"></i>
              {{ isEditing ? 'Editar usuario' : 'Nuevo usuario' }}
            </h5>
            <button type="button" class="btn-close" @click="closeFormModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-warning border-0 py-2 small">{{ formError }}</div>
            <div class="vstack gap-3">
              <div>
                <label class="form-label">Nombre completo</label>
                <input v-model.trim="form.nombre" type="text" class="form-control" placeholder="Ej. Laura Gómez">
              </div>
              <div>
                <label class="form-label">Usuario</label>
                <input v-model.trim="form.usuario" type="text" class="form-control" placeholder="Ej. laura">
              </div>
              <div>
                <label class="form-label">Contraseña</label>
                <input v-model.trim="form.password" type="text" class="form-control" placeholder="Contraseña de acceso">
              </div>
              <div>
                <label class="form-label">Rol</label>
                <select v-model="form.rol" class="form-select">
                  <option value="Admin">Admin</option>
                  <option value="Cliente">Cliente</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="closeFormModal">Cancelar</button>
            <button type="button" class="btn btn-primary" :disabled="saving" @click="submitForm">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEditing ? 'Guardar cambios' : 'Crear usuario' }}
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
            <h5 class="modal-title"><i class="bi bi-exclamation-triangle text-danger me-1"></i>Eliminar usuario</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              ¿Deseas eliminar al usuario <strong>{{ userToDelete && userToDelete.nombre }}</strong>?
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
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService'

export default {
  name: 'UsersView',
  data() {
    return {
      users: [],
      loading: false,
      loadError: '',
      showFormModal: false,
      showDeleteModal: false,
      isEditing: false,
      editingId: null,
      saving: false,
      deleting: false,
      formError: '',
      form: this.emptyForm(),
      userToDelete: null,
      alert: { type: '', message: '' }
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    emptyForm() {
      return { nombre: '', usuario: '', password: '', rol: 'Cliente' }
    },
    async loadUsers() {
      this.loading = true
      this.loadError = ''
      try {
        const { data } = await getUsers()
        this.users = data
      } catch (err) {
        this.loadError = 'No se pudo cargar la lista de usuarios. Verifica la conexión a MockAPI.'
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.isEditing = false
      this.editingId = null
      this.form = this.emptyForm()
      this.formError = ''
      this.showFormModal = true
    },
    openEditModal(user) {
      this.isEditing = true
      this.editingId = user.id
      this.form = { nombre: user.nombre, usuario: user.usuario, password: user.password, rol: user.rol }
      this.formError = ''
      this.showFormModal = true
    },
    closeFormModal() {
      this.showFormModal = false
    },
    async submitForm() {
      if (!this.form.nombre || !this.form.usuario || !this.form.password) {
        this.formError = 'Completa todos los campos obligatorios.'
        return
      }

      this.saving = true
      this.formError = ''

      try {
        if (this.isEditing) {
          await updateUser(this.editingId, this.form)
          this.setAlert('success', 'Usuario actualizado correctamente.')
        } else {
          await createUser(this.form)
          this.setAlert('success', 'Usuario creado correctamente.')
        }
        this.showFormModal = false
        await this.loadUsers()
      } catch (err) {
        this.formError = 'No se pudo guardar el usuario. Intenta de nuevo.'
      } finally {
        this.saving = false
      }
    },
    openDeleteModal(user) {
      this.userToDelete = user
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.userToDelete = null
    },
    async confirmDelete() {
      if (!this.userToDelete) return
      this.deleting = true
      try {
        await deleteUser(this.userToDelete.id)
        this.setAlert('success', 'Usuario eliminado correctamente.')
        this.closeDeleteModal()
        await this.loadUsers()
      } catch (err) {
        this.setAlert('danger', 'No se pudo eliminar el usuario.')
      } finally {
        this.deleting = false
      }
    },
    setAlert(type, message) {
      this.alert = { type, message }
      window.clearTimeout(this._alertTimer)
      this._alertTimer = window.setTimeout(() => {
        this.alert = { type: '', message: '' }
      }, 2800)
    }
  }
}
</script>
