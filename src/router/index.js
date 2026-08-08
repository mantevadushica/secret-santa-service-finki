import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import GroupDetailsView from '../views/GroupDetailsView.vue'
import WishlistView from '../views/WishlistView.vue'
import ProfileView from '../views/ProfileView.vue'
import CreateEventView from '../views/CreateEventView.vue'
import SecretSantaView from '../views/SecretSantaView.vue'
import { auth } from '../firebase/firebase'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/events/create', name: 'create-event', component: CreateEventView, meta: { requiresAuth: true } },
  { path: '/groups/:id', name: 'group-details', component: GroupDetailsView, meta: { requiresAuth: true } },
  { path: '/groups/:id/secret-santa', name: 'secret-santa', component: SecretSantaView, meta: { requiresAuth: true } },
  { path: '/wishlist', name: 'wishlist', component: WishlistView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !auth.currentUser) return { name: 'login', query: { redirect: to.fullPath } }
  if ((to.name === 'login' || to.name === 'register') && auth.currentUser) return { name: 'dashboard' }
})

export default router
