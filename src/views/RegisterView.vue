<template>
  <main class="auth-page">
    <section class="card auth-card">
      <div class="logo">🎁</div>
      <h1>Регистрација</h1>
      <p>Креирајте профил за Secret Santa FINKI.</p>
      <form @submit.prevent="register">
        <label>Име и презиме</label>
        <input v-model.trim="name" class="form-input" placeholder="Јована Стојанова" required />
        <label>Е-пошта</label>
        <input v-model.trim="email" class="form-input" type="email" placeholder="ime.prezime@finki.ukim.mk" required />
        <label>Оддел</label>
        <input v-model.trim="department" class="form-input" placeholder="Софтверско инженерство" />
        <label>Лозинка</label>
        <input v-model="password" class="form-input" type="password" minlength="6" placeholder="Најмалку 6 знаци" required />
        <p v-if="error" class="error">{{ error }}</p>
        <button class="btn btn-red full" :disabled="loading">{{ loading ? 'Се креира...' : 'Регистрирај се' }}</button>
      </form>
      <p>Веќе имате профил? <RouterLink to="/login">Најава</RouterLink></p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { createUserProfile } from '../services/userService'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const name = ref('')
const email = ref('')
const department = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function register() {
  error.value = ''
  loading.value = true
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await createUserProfile(credential.user.uid, { name: name.value, email: email.value, department: department.value })
    await authStore.hydrate(credential.user)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.code === 'auth/email-already-in-use' ? 'Оваа е-пошта веќе е регистрирана.' : 'Регистрацијата не успеа. Проверете ги податоците.'
  } finally { loading.value = false }
}
</script>

<style scoped>
.auth-page { min-height:100vh; display:grid; place-items:center; padding:20px; }
.auth-card { width:min(480px,100%); padding:42px; }.logo,h1,p{text-align:center}.logo{font-size:50px}h1{color:var(--dark-green)}p{color:var(--muted)}form{display:grid;gap:12px;margin-top:24px}.full{width:100%;margin-top:10px}a{color:var(--red);font-weight:700}.error{color:var(--red);font-weight:700;text-align:left;margin:0}
</style>
