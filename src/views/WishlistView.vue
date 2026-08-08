<template>
  <main class="page-shell"><Sidebar/><section class="content"><div class="top"><h1>Мој Wishlist</h1><button class="btn btn-red" @click="openAdd">+ Додај желба</button></div>
    <p v-if="loading">Се вчитува...</p><div v-else class="items"><article v-for="item in items" :key="item.id" class="card wish"><span>{{ iconFor(item.category) }}</span><div><h3>{{item.name}}</h3><p>{{item.category||'Друго'}}</p><b v-if="item.price">{{item.price}} ден</b><a v-if="item.link" :href="item.link" target="_blank" rel="noopener">Отвори линк ↗</a></div><button @click="openEdit(item)">✏️</button><button @click="remove(item)">🗑️</button></article><section v-if="!items.length" class="card empty">Немате додадено желби.</section></div>
    <div class="note">❤️ Споделете ги вашите желби со вашиот таен пријател.</div>
    <div v-if="showModal" class="overlay" @click.self="showModal=false"><form class="card modal" @submit.prevent="save"><h2>{{editingId?'Уреди желба':'Нова желба'}}</h2><label>Име</label><input v-model.trim="form.name" class="form-input" required/><label>Категорија</label><input v-model.trim="form.category" class="form-input" placeholder="Книги, електроника..."/><label>Цена (ден.)</label><input v-model.number="form.price" class="form-input" type="number" min="0"/><label>Линк</label><input v-model.trim="form.link" class="form-input" type="url" placeholder="https://..."/><div class="modal-actions"><button type="button" class="btn btn-outline" @click="showModal=false">Откажи</button><button class="btn btn-red">Зачувај</button></div></form></div>
  </section></main>
</template>
<script setup>
import { onMounted,reactive,ref } from 'vue'; import Sidebar from '../components/Sidebar.vue'; import { useAuthStore } from '../stores/authStore'; import { addWishlistItem,deleteWishlistItem,getWishlist,updateWishlistItem } from '../services/wishlistService';
const authStore=useAuthStore(),items=ref([]),loading=ref(true),showModal=ref(false),editingId=ref(null),form=reactive({name:'',category:'',price:0,link:''});
function iconFor(c=''){const s=c.toLowerCase();if(s.includes('книг'))return'📚';if(s.includes('елект'))return'🎧';if(s.includes('облек'))return'👕';return'🎁'}
async function load(){loading.value=true;try{items.value=await getWishlist(authStore.user.uid)}finally{loading.value=false}}
function reset(){Object.assign(form,{name:'',category:'',price:0,link:''});editingId.value=null}
function openAdd(){reset();showModal.value=true}
function openEdit(item){editingId.value=item.id;Object.assign(form,{name:item.name,category:item.category||'',price:item.price||0,link:item.link||''});showModal.value=true}
async function save(){if(editingId.value)await updateWishlistItem(authStore.user.uid,editingId.value,form);else await addWishlistItem(authStore.user.uid,form);showModal.value=false;reset();await load()}
async function remove(item){if(confirm(`Да се избрише „${item.name}“?`)){await deleteWishlistItem(authStore.user.uid,item.id);await load()}}
onMounted(load)
</script>
<style scoped>.top{display:flex;justify-content:space-between;align-items:center}h1{color:var(--dark-green)}.items{display:grid;gap:18px}.wish{display:grid;grid-template-columns:80px 1fr 44px 44px;align-items:center;gap:16px;padding:20px}.wish>span{font-size:46px}h3{margin:0}.wish p{color:var(--muted);margin:6px 0}.wish a{display:block;color:var(--green);font-weight:700;margin-top:6px}.wish button{border:0;background:white;font-size:20px;cursor:pointer}.note{margin-top:24px;border:1px solid #f0cfa7;background:#fff3df;padding:20px;border-radius:18px}.empty{padding:28px}.overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);display:grid;place-items:center;padding:20px;z-index:20}.modal{width:min(520px,100%);padding:28px;display:grid;gap:12px}.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:10px}label{font-weight:700;font-size:14px}@media(max-width:700px){.wish{grid-template-columns:1fr}.top{flex-direction:column;align-items:flex-start}}</style>
