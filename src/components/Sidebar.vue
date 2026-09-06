<template>
  <aside class="sidebar">
    <div>
      <div class="brand">
        <span class="logo">🎅</span>
        <strong>
          Secret Santa<br />
          FINKI
        </strong>
      </div>

      <nav>
        <RouterLink to="/dashboard">
          🏠 Почетна
        </RouterLink>

        <RouterLink to="/events/create">
          ➕ Создај настан
        </RouterLink>

        <RouterLink to="/wishlist">
          ❤️ Мои желби
        </RouterLink>

        <RouterLink to="/profile">
          👤 Профил
        </RouterLink>
      </nav>
    </div>

    <button class="logout" @click="logout">
      🚪 Одјава
    </button>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

async function logout() {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #064b37, #022d20);
  color: white;
  padding: 28px;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 34px;
}

nav {
  display: grid;
  gap: 12px;
}

nav a,
.logout {
  padding: 14px 16px;
  border-radius: 14px;
  opacity: 0.9;
  color: white;
  text-align: left;
  background: transparent;
  border: 0;
  font: inherit;
  cursor: pointer;
}

.router-link-active,
nav a:hover,
.logout:hover {
  background: rgba(255, 255, 255, 0.14);
}

.logout {
  width: 100%;
  margin-top: 30px;
}

@media (max-width: 850px) {
  .sidebar {
    min-height: auto;
  }
}
</style>