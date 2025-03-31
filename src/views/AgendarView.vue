<template>
    <div class="max-w-xl mx-auto p-6">
      <h2 class="text-3xl font-bold mb-6">Agendar Cita Médica</h2>
      <form @submit.prevent="agendarCita" class="space-y-4">
        <input v-model="form.nombre" type="text" placeholder="Nombre completo" class="w-full border p-2" required />
        <input v-model="form.email" type="email" placeholder="Correo electrónico" class="w-full border p-2" required />
        <input v-model="form.telefono" type="tel" placeholder="Teléfono" class="w-full border p-2" required />
        <input v-model="form.fecha" type="datetime-local" class="w-full border p-2" required />
        <textarea v-model="form.motivo" placeholder="Motivo de la cita" class="w-full border p-2" rows="3"></textarea>
        <button class="bg-black text-white px-6 py-2 rounded">Agendar</button>
      </form>
  
      <div v-if="mensaje" class="mt-4 text-green-600 font-semibold">
        {{ mensaje }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const form = ref({
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    motivo: '',
  })
  
  const mensaje = ref('')
  
  const agendarCita = async () => {
    try {
      await axios.post('http://localhost:3000/api/citas', form.value)
      mensaje.value = 'Cita agendada exitosamente'
      form.value = { nombre: '', email: '', telefono: '', fecha: '', motivo: '' }
    } catch (e) {
      mensaje.value = 'Hubo un error al agendar la cita'
    }
  }
  </script>
  