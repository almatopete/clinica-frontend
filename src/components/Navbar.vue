<template>
    <nav class="w-full bg-white shadow-md">
      <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <div class="flex gap-6 items-center">
          <router-link to="/" class="text-gray-800 font-semibold hover:text-black">Inicio</router-link>
          <router-link to="/about" class="text-gray-800 font-semibold hover:text-black">Acerca</router-link>
          <router-link to="/agendar" class="text-gray-800 font-semibold hover:text-black">Agendar</router-link>
        </div>
  
        <div class="flex gap-4 items-center">
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="text-gray-700 hover:underline">Mi perfil</router-link>
            <router-link to="/my-appointments" class="text-gray-700 hover:underline">Mis citas</router-link>
            <button @click="logout" class="text-red-600 font-semibold hover:underline">Cerrar sesión</button>
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
  import { useAuth } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const { isLoggedIn, logout } = useAuth()
  </script>