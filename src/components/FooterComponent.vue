<template>
  <footer class="py-4 text-center text-muted small">
    <div class="container">
      <span>© {{ year }} {{ brandTitle }} · Todos los derechos reservados</span>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  props: {
    brandTitle: { type: String, default: 'Moda Luma' }
  },
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>
