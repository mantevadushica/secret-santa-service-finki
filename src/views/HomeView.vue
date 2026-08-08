<template>
  <main class="home">
    <Navbar />
    <section class="hero">
      <div>
        <h1>Secret Santa Service<br />за сите вработени<br />на <span>ФИНКИ</span></h1>
        <p>Модерна веб апликација за организирање празнични Secret Santa настани, wishlist желби и анонимно извлекување.</p>
        <div class="actions">
          <RouterLink to="/register" class="btn btn-primary">Создај профил</RouterLink>
          <RouterLink to="/login" class="btn btn-outline">Најави се</RouterLink>
        </div>
      </div>
      <div class="gift card">
  <img src="/src/assets/secretSanta2.png" alt="gift" />
  
</div>
    </section>
    <section id="how" class="features card">
      <article>
  <div class="feature-title">
    
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="feature-icon"
    >
      <path
        d="M4 21V18.5C4 15.4624 6.46243 13 9.5 13H14.5C17.5376 13 20 15.4624 20 18.5V21M8 21V18M16 21V18M16 6.5C16 8.70914 14.2091 10.5 12 10.5C9.79086 10.5 8 8.70914 8 6.5C8 4.29086 9.79086 2.5 12 2.5C14.2091 2.5 16 4.29086 16 6.5Z"
        stroke="#b80000"
        stroke-linecap="round"
        stroke-width="1.4"
      />
    </svg>

    <b>За вработени</b>
  </div>

  <p>Само за вработените на ФИНКИ.</p>
</article>
      <article><b>🛡️ Анонимно</b><p>Тајниот пријател останува скриен.</p></article>
      <article><b>⭐ Брзо</b><p>Автоматско извлекување со еден клик.</p></article>
    </section>
  </main>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
</script>

<style scoped>
.home { 
  min-height: 100vh;
 }
.hero {
  display:grid; 
  grid-template-columns: 1.1fr .9fr; 
  align-items:center; 
  gap:50px;
   padding: 70px 8%; }
h1 { 
  font-size: clamp(42px, 6vw, 76px); 
  line-height:1.08; 
  margin:0; 
  color:var(--dark-green); 
}
span { color: var(--red); }
p { color: var(--muted); 
  font-size:18px; 
  line-height:1.7; 
  max-width:580px; }
.actions { 
  display:flex; 
  gap:16px; 
  margin-top:30px; }
.gift {
  width: 620px;
  height: 430px;
  overflow: hidden;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
  border: none;
}

.gift img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}
.gift small
{ 
  position:absolute;
  bottom:45px;
  background:white; 
  padding:16px 22px; 
  font-size:22px; 
  transform: rotate(-8deg); 
  box-shadow:0 10px 24px rgba(0,0,0,.08);
 }
.features { 
  margin: 0 8% 40px; 
  padding:28px; 
  display:grid; 
  grid-template-columns:repeat(3,1fr); 
  gap:20px; 
  text-align:center;
 }
.features p { 
  font-size:14px; 
  margin:8px auto 0; 
}
.feature-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

.feature-icon {
  width: 22px;
  height: 22px;
}
@media (max-width: 850px){ .hero,.features{grid-template-columns:1fr;} .gift{height:280px;font-size:110px;} }
</style>
