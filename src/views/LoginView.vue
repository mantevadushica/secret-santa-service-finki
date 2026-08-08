<template>
  <main class="auth-page"><section class="card auth-card"><div class="logo">🎅</div><h1>Најава</h1><p>Најавете се за да продолжите.</p>
    <form @submit.prevent="login"><label>Е-пошта</label><input v-model.trim="email" class="form-input" type="email" required placeholder="vnesete@finki.ukim.mk" /><label>Лозинка</label><input v-model="password" class="form-input" type="password" required placeholder="Внесете лозинка" /><p v-if="error" class="error">{{ error }}</p><button class="btn btn-primary full" :disabled="loading">{{ loading ? 'Се најавува...' : 'Најави се' }}</button></form>
    <p>Немате профил? <RouterLink to="/register">Регистрирајте се</RouterLink></p></section></main>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { useAuthStore } from '../stores/authStore'
const router=useRouter(), route=useRoute(), authStore=useAuthStore(); const email=ref(''),password=ref(''),error=ref(''),loading=ref(false)
async function login(){error.value='';loading.value=true;try{const c=await signInWithEmailAndPassword(auth,email.value,password.value);await authStore.hydrate(c.user);router.push(route.query.redirect||'/dashboard')}catch(e){error.value='Погрешна е-пошта или лозинка.'}finally{loading.value=false}}
</script>
<style scoped>.auth-page{min-height:100vh;display:grid;place-items:center;padding:20px}.auth-card{width:min(460px,100%);padding:42px}.logo{font-size:52px;text-align:center}h1{text-align:center;color:var(--dark-green)}p{text-align:center;color:var(--muted)}form{display:grid;gap:12px;margin-top:24px}label{font-weight:700;font-size:14px}.full{width:100%;margin-top:10px}a{color:var(--red);font-weight:700}.error{color:var(--red);font-weight:700;margin:0}</style>
