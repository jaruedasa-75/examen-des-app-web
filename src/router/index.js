import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from '../utils/storage'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import DashboardHomeView from '../views/DashboardHomeView.vue'
import CatalogView from '../views/CatalogView.vue'
import CartView from '../views/CartView.vue'
import ProductView from '../views/ProductView.vue'
import UsersView from '../views/UsersView.vue'
import OrdersView from '../views/OrdersView.vue'

function dashboardTarget() {
  const auth = getAuth()
  return auth && auth.rol === 'Admin' ? '/dashboard/inicio' : '/dashboard/catalogo'
}

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    redirect: dashboardTarget,
    children: [
      {
        path: 'inicio',
        name: 'dashboard-home',
        component: DashboardHomeView,
        meta: { requiresAuth: true, roles: ['Admin'] }
      },
      {
        path: 'catalogo',
        name: 'dashboard-catalog',
        component: CatalogView,
        meta: { requiresAuth: true, roles: ['Admin', 'Cliente'] }
      },
      {
        path: 'carrito',
        name: 'dashboard-cart',
        component: CartView,
        meta: { requiresAuth: true, roles: ['Admin', 'Cliente'] }
      },
      {
        path: 'productos',
        name: 'dashboard-products',
        component: ProductView,
        meta: { requiresAuth: true, roles: ['Admin'] }
      },
      {
        path: 'usuarios',
        name: 'dashboard-users',
        component: UsersView,
        meta: { requiresAuth: true, roles: ['Admin'] }
      },
      {
        path: 'pedidos',
        name: 'dashboard-orders',
        component: OrdersView,
        meta: { requiresAuth: true, roles: ['Admin', 'Cliente'] }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const isLoggedIn = Boolean(auth)

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
    return
  }

  if (to.meta.guestOnly && isLoggedIn) {
    next(dashboardTarget())
    return
  }

  if (to.meta.roles && isLoggedIn && !to.meta.roles.includes(auth.rol)) {
    next(dashboardTarget())
    return
  }

  next()
})

export default router
