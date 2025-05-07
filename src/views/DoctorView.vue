<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-10">
      <div class="max-w-5xl w-full bg-white rounded-lg shadow-md flex flex-col md:flex-row overflow-hidden">
        
        <!-- Imagen del doctor -->
        <div class="md:w-1/3 bg-gray-100 flex items-center justify-center p-6">
          <img
            :src="doctor.foto"
            alt="Foto del doctor"
            class="w-full h-auto rounded-md object-cover"
          />
        </div>
  
        <!-- Información -->
        <div class="md:w-2/3 p-8 space-y-4">
          <h1 class="text-3xl font-bold text-gray-800">{{ doctor.nombre }}</h1>
          <h2 class="text-xl text-gray-500">{{ doctor.especialidad }}</h2>
          <p class="text-gray-600 font-semibold">{{ doctor.subespecialidad }}</p>
          <p class="text-gray-700 leading-relaxed">{{ doctor.descripcion }}</p>
  
          <router-link to="/" class="text-green-600 hover:underline inline-block mt-4">
            ← Volver al inicio
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const doctor = ref({})
  
  onMounted(async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctores/${route.params.id}`)
    doctor.value = data
  })
  </script>
  