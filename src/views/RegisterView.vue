<template>
    <div class="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div class="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-3xl font-bold text-center mb-6">Registro</h2>
        <form @submit.prevent="register" class="space-y-4">
          <input v-model="form.nombre" type="text" placeholder="Nombre completo" class="w-full border p-2 rounded" required />
          <input v-model="form.email" type="email" placeholder="Correo electrónico" class="w-full border p-2 rounded" required />
          <input v-model="form.password" type="password" placeholder="Contraseña" class="w-full border p-2 rounded" required />
          <button class="bg-black text-white px-6 py-2 rounded w-full" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>
        <p class="mt-4 text-sm text-center">¿Ya tienes cuenta?
          <router-link to="/login" class="text-blue-600 underline">Inicia sesión</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const form = ref({ nombre: '', email: '', password: '' })
  const loading = ref(false)
  
  const register = async () => {
    loading.value = true
    try {
      const res = await axios.post('/api/register', form.value)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      router.push('/')
    } catch (err) {
      alert('Error al registrarse')
    } finally {
      loading.value = false
    }
  }
  </script>
  