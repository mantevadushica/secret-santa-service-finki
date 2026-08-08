<script setup>
import santaLogo from "../assets/santa-claus-2-svgrepo-com.svg";
</script>

<template>
  <header class="navbar">

    <div class="brand">

      <img
        :src="santaLogo"
        alt="Secret Santa Logo"
        class="logo-image"
      />

      <b>SECRET SANTA SERVICE FINKI</b>

    </div>

    <nav>

      <RouterLink to="/">
        Дома
      </RouterLink>

      <a href="#how">
        Како функционира
      </a>

      <RouterLink to="/login" class="login">
        Најава
      </RouterLink>

    </nav>

  </header>
</template>

<style scoped>

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px 8%;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}


.brand b {
   font-family: 'Rubik Dirt', cursive;
  font-size: 25px;
  font-weight: 700;
  color: #a80000;
  letter-spacing: -1px;
  line-height: 1;
  display: flex;
  align-items: center;
  margin-top: -2px;
}

.logo-image {
  width: 48px;
  height: 48px;
}

nav {
  display: flex;
  align-items: center;
  gap: 26px;
}

nav a {
  text-decoration: none;
  color: #111;
  font-weight: 500;
  transition: 0.2s;
  font-family: 'Poppins', sans-serif;
}

nav a:hover {
  color: #a80000;
}

.login {
  background: #c62828;
  color: white !important;
  padding: 12px 22px;
  border-radius: 12px;
}

@media (max-width: 700px) {

  .brand b {
    font-size: 24px;
  }

  nav a:not(.login) {
    display: none;
  }

}

</style>