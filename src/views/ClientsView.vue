<template>
  <div class="card shadow-soft border-0">
    <div class="card-header bg-white border-0 pt-4 px-4">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h5 class="mb-1">Clientes</h5>
          <p class="text-muted mb-0">Vista auxiliar del dashboard.</p>
        </div>
        <span class="badge text-bg-light text-dark">
          <i class="bi bi-people me-1"></i>Registro interno
        </span>
      </div>
    </div>

    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Ciudad</th>
              <th>Compras</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients" :key="client.id">
              <td class="fw-semibold">{{ client.name }}</td>
              <td>{{ client.email }}</td>
              <td>{{ client.city }}</td>
              <td>{{ client.purchases }}</td>
              <td>
                <span class="badge" :class="client.active ? 'text-bg-success' : 'text-bg-secondary'">
                  {{ client.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientsView',
  data() {
    return {
      clients: [
        { id: 1, name: 'Laura Gómez', email: 'laura@mail.com', city: 'Bogotá', purchases: 4, active: true },
        { id: 2, name: 'Daniel Pérez', email: 'daniel@mail.com', city: 'Medellín', purchases: 2, active: true },
        { id: 3, name: 'María Torres', email: 'maria@mail.com', city: 'Cali', purchases: 1, active: false }
      ]
    }
  }
}
</script>
