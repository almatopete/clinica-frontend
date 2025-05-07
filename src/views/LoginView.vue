<template>
    <div class="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div class="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-3xl font-bold text-center mb-6">Iniciar sesión</h2>
        <form @submit.prevent="login" class="space-y-4">
          <input v-model="form.email" type="email" placeholder="Correo electrónico" class="w-full border p-2 rounded" required />
          <input v-model="form.password" type="password" placeholder="Contraseña" class="w-full border p-2 rounded" required />
          <button class="bg-black text-white px-6 py-2 rounded w-full" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
        <p class="mt-4 text-sm text-center">¿No tienes cuenta?
          <router-link to="/register" class="text-blue-600 underline">Regístrate</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const form = ref({ email: '', password: '' })
  const loading = ref(false)
  
  const login = async () => {
    loading.value = true
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, form.value)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      router.push('/')
    } catch (err) {
      alert('Error al iniciar sesión')
    } finally {
      loading.value = false
    }
  }
  </script>
  