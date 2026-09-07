<template>
  <main class="page-shell">
    <Sidebar />

    <section class="content">
      <RouterLink to="/dashboard">← Назад</RouterLink>

      <p v-if="loading">Се вчитува...</p>

      <template v-else-if="event">
        <div class="header">
          <h1>
            {{ event.name }}
            <span>{{ statusLabel }}</span>
          </h1>

          <p>{{ participants.length }} членови</p>
        </div>

        <div class="layout">

          <!-- INFORMATION -->
          <section class="card info">

            <label>Код за приклучување</label>

            <button
              class="code"
              @click="copyCode"
            >
              {{ event.joinCode }} 📋
            </button>

            <!-- SEND INVITATION - ONLY ORGANIZER -->
            <div
              v-if="isOwner"
              class="invite-box"
            >
              <h3>📧 Испрати покана</h3>

              <p class="invite-description">
                Внесете ја e-mail адресата на лицето што сакате
                да го поканите на настанот.
              </p>

              <form @submit.prevent="sendInvitation">
                <input
                  v-model="inviteEmail"
                  type="email"
                  placeholder="primer@gmail.com"
                  required
                />

                <button
                  type="submit"
                  class="btn btn-primary full"
                  :disabled="sendingInvite"
                >
                  {{
                    sendingInvite
                      ? 'Се испраќа...'
                      : '📧 Испрати покана'
                  }}
                </button>
              </form>
            </div>

            <p>
              <b>Буџет:</b>
              {{ event.budget }} ден
            </p>

            <p>
              <b>Датум на извлекување:</b>
              {{ event.drawDate || 'Не е зададен' }}
            </p>

            <p>{{ event.description }}</p>

            <button
              v-if="isOwner && event.status !== 'drawn'"
              class="btn btn-red full"
              @click="draw"
              :disabled="drawing"
            >
              {{
                drawing
                  ? 'Се извлекува...'
                  : 'Започни извлекување'
              }}
            </button>

            <RouterLink
              v-if="event.status === 'drawn'"
              class="btn btn-primary full linkbtn"
              :to="`/groups/${event.id}/secret-santa`"
            >
              🎁 Види кого извлече
            </RouterLink>

            <p
              v-if="message"
              class="message"
            >
              {{ message }}
            </p>

          </section>

          <!-- MEMBERS -->
          <section class="card members">

            <h2>Членови</h2>

            <ul>
              <li
                v-for="p in participants"
                :key="p.uid"
              >
                {{ p.role === 'organizer' ? '👑' : '👤' }}
                {{ p.name }}

                <small>
                  {{ p.email }}

                  <b v-if="p.role === 'organizer'">
                    • Организатор
                  </b>
                </small>
              </li>
            </ul>

          </section>

        </div>
      </template>

      <p v-else>
        Настанот не е пронајден.
      </p>
    </section>
  </main>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import { useRoute } from 'vue-router'

import Sidebar from '../components/Sidebar.vue'
import { useAuthStore } from '../stores/authStore'

import {
  drawSecretSanta,
  getEvent,
  getParticipants
} from '../services/eventService'

import {
  sendEventInvitation
} from '../services/emailService'


const route = useRoute()
const authStore = useAuthStore()

const event = ref(null)
const participants = ref([])

const loading = ref(true)
const drawing = ref(false)

const message = ref('')


// EMAIL INVITATION
const inviteEmail = ref('')
const sendingInvite = ref(false)


const isOwner = computed(() => {
  return event.value?.ownerId === authStore.user?.uid
})


const statusLabel = computed(() => {
  return event.value?.status === 'drawn'
    ? 'Извлечен'
    : 'Активен'
})


async function load() {
  loading.value = true

  try {
    event.value = await getEvent(route.params.id)

    participants.value =
      await getParticipants(route.params.id)

  } finally {
    loading.value = false
  }
}


async function copyCode() {

  if (event.value) {
    await navigator.clipboard.writeText(
      event.value.joinCode
    )

    message.value = 'Кодот е копиран.'
  }
}


// SEND EMAIL INVITATION
async function sendInvitation() {

  const email = inviteEmail.value.trim()

  if (!email) {
    message.value =
      'Внесете e-mail адреса.'

    return
  }


  if (!isOwner.value) {
    message.value =
      'Само организаторот може да испраќа покани.'

    return
  }


  sendingInvite.value = true
  message.value = ''


  try {

    const organizerName =
      authStore.profile?.name ||
      authStore.user?.displayName ||
      authStore.user?.email ||
      'Организаторот'


    const organizerEmail =
      authStore.profile?.email ||
      authStore.user?.email


    await sendEventInvitation({
      toEmail: email,
      organizerName: organizerName,
      organizerEmail: organizerEmail,
      eventName: event.value.name,
      joinCode: event.value.joinCode
    })


    inviteEmail.value = ''

    message.value =
      '📧 Поканата е успешно испратена!'


  } catch (error) {

    console.error(
      'Email invitation error:',
      error
    )

    message.value =
      'Не успеа испраќањето на поканата.'

  } finally {

    sendingInvite.value = false

  }
}


async function draw() {

  if (
    !confirm(
      'Извлекувањето е финално. Да продолжам?'
    )
  ) {
    return
  }


  drawing.value = true
  message.value = ''


  try {

    await drawSecretSanta(
      route.params.id
    )

    await load()

    message.value =
      '🎉 Извлекувањето е успешно направено!'

  } catch (e) {

    message.value = e.message

  } finally {

    drawing.value = false

  }
}


onMounted(load)
</script>

<style scoped>

h1 {
  color: var(--dark-green);
}

h1 span {
  font-size: 14px;
  background: #e4f5ec;
  color: var(--green);
  padding: 7px 12px;
  border-radius: 999px;
}

.layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
}

.info,
.members {
  padding: 26px;
}

.code {
  width: 100%;
  text-align: left;
  margin: 10px 0 24px;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: white;
  font-weight: 800;
  cursor: pointer;
}


/* EMAIL INVITATION */

.invite-box {
  margin-bottom: 24px;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: white;
}

.invite-box h3 {
  margin-top: 0;
  margin-bottom: 6px;
  color: var(--dark-green);
}

.invite-description {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 14px;
}

.invite-box input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  outline: none;
}

.invite-box input:focus {
  border-color: var(--green);
}


.full {
  width: 100%;
  margin-top: 12px;
}

.linkbtn {
  display: block;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

li {
  background: white;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
}

small {
  display: block;
  color: var(--muted);
  margin-top: 4px;
}

.message {
  font-weight: 700;
  color: var(--green);
}

@media (max-width: 950px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

</style>