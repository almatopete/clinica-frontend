<template>
  <nav class="w-full bg-white shadow-md">
    <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
      <!-- Izquierda: navegación principal -->
      <div class="flex gap-6 items-center">
        <router-link to="/" class="text-gray-800 font-semibold hover:text-black">Inicio</router-link>
        <router-link to="/about" class="text-gray-800 font-semibold hover:text-black">Acerca</router-link>
        <router-link to="/agendar" class="text-gray-800 font-semibold hover:text-black">Agendar</router-link>

        <!-- Doctor -->
        <router-link
          v-if="role === 'DOCTOR'"
          to="/doctor/agenda"
          class="text-gray-800 font-semibold hover:text-black"
        >
          Mi agenda
        </router-link>

        <!-- Admin: agrupado simple -->
        <div v-if="role === 'ADMIN'" class="flex gap-4 items-center">
          <router-link to="/admin/doctores" class="text-gray-800 font-semibold hover:text-black">
            Doctores (Admin)
          </router-link>
          <router-link to="/admin/horarios" class="text-gray-800 font-semibold hover:text-black">
            Horarios (Admin)
          </router-link>
          <router-link to="/admin/citas" class="text-gray-800 font-semibold hover:text-black">
            Citas (Admin)
          </router-link>
        </div>
      </div>

      <!-- Derecha: sesión / usuario -->
      <div class="flex gap-4 items-center">
        <template v-if="isLoggedIn">
          <!-- Paciente -->
          <router-link
            v-if="role === 'PATIENT'"
            to="/my-appointments"
            class="text-gray-700 hover:underline"
          >
            Mis citas
          </router-link>

          <!-- Perfil visible para cualquier rol autenticado -->
          <router-link to="/profile" class="text-gray-700 hover:underline">
            Mi perfil
          </router-link>

          <!-- Saludo opcional -->
          <span class="hidden sm:inline text-gray-500">Hola, {{ user?.nombre || 'Usuario' }}</span>

          <button @click="handleLogout" class="text-red-600 font-semibold hover:underline">
            Cerrar sesión
          </button>
        </template>

        <template v-else>
          <router-link to="/login" class="text-blue-600 hover:underline">Iniciar sesión</router-link>
          <router-link to="/register" class="text-blue-600 hover:underline">Registrarse</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const { isLoggedIn, user, logout } = useAuth()

const role = computed(() => user.value?.role || null)

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>
