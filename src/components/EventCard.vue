<template>
  <RouterLink :to="`/groups/${id}`" class="event-card card">
    <div class="icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ members }} членови</p>
    <span>{{ status }}</span>
  </RouterLink>
</template>

<script setup>
defineProps({
  id: String,
  icon: String,
  title: String,
  members: Number,
  status: String
})
</script>

<style scoped>
.event-card { padding: 26px; min-height: 180px; display: block; transition: .2s; }
.event-card:hover { transform: translateY(-4px); }
.icon { font-size: 46px; margin-bottom: 18px; }
h3 { margin: 0 0 8px; color: var(--dark-green); }
p { color: var(--muted); }
span { background: #e4f5ec; color: var(--green); padding: 6px 10px; border-radius: 999px; font-size: 13px; }
</style>
