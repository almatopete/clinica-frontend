<template>
    <div class="max-w-3xl mx-auto py-10 px-4">
        <h1 class="text-3xl font-bold mb-6">Mis citas</h1>  
      <div v-if="citas.length === 0" class="text-gray-600">
          No tienes citas próximas.        
      </div>
  
      <ul v-else class="space-y-4">
        <li
          v-for="cita in citas"
          :key="cita.id"
          class="border p-4 rounded shadow bg-white flex justify-between items-start"
        >
          <div>
            <p><strong>Date:</strong> {{ formatDate(cita.fecha) }}</p>
            <p><strong>Doctor:</strong> {{ cita.doctor }}</p>
            <p><strong>Reason:</strong> {{ cita.motivo }}</p>
          </div>
          <button
            @click="cancelarCita(cita.id)"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-4"
          >
            Cancelar
          </button>
          <router-link :to="`/reagendar/${cita.id}`" class="ml-2 px-3 py-2 border rounded">Reagendar</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const citas = ref([])
  
  const formatDate = (date) =>
    new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  
  const fetchCitas = async () => {
    const res = await axios.get('/api/users/my-appointments')
    citas.value = res.data
  }
  
  const cancelarCita = async (id) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await axios.delete(`/api/citas/${id}`)
        await fetchCitas() // Refresh list
      } catch (err) {
        alert('Failed to cancel the appointment.')
        console.error(err)
      }
    }
  }
  
  onMounted(fetchCitas)
  </script>
  