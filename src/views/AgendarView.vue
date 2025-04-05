<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
    <div class="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-3xl font-bold text-center mb-6">Agendar Cita Médica</h2>

      <!-- Selección de doctor -->
      <div class="mb-6">
        <label for="doctor" class="block font-medium mb-2">Selecciona un doctor:</label>
        <select id="doctor" v-model="selectedDoctor" @change="fetchHorarios" class="w-full border p-2 rounded">
          <option value="">-- Selecciona --</option>
          <option v-for="doctor in doctores" :key="doctor.id" :value="doctor.id">
            {{ doctor.nombre }} - {{ doctor.especialidad }}
          </option>
        </select>
      </div>

      <!-- Calendario -->
      <div v-if="eventos.length && !selectedHorario" class="mb-10">
        <vue-cal
          style="height: 800px"
          :events="eventos"
          :disable-views="['years', 'month']"
          default-view="week"
          :time-from="540"  
          :time-to="1080"  
          hide-title
          hide-weekends
          hide-view-selector
          :selected-date="new Date()"
          :on-event-click="handleHoraSeleccionada"
        />
      </div>

      <!-- Formulario -->
      <form v-if="selectedHorario" @submit.prevent="agendarCita" class="space-y-4">
        <div class="bg-gray-100 p-4 rounded">
          <p><strong>Doctor:</strong> {{ getDoctorNombre(selectedDoctor) }}</p>
          <p><strong>Fecha:</strong> {{ formatFecha(selectedHorario.start) }}</p>
        </div>
        <input v-model="form.nombre" type="text" placeholder="Nombre completo" class="w-full border p-2" required />
        <input v-model="form.email" type="email" placeholder="Correo electrónico" class="w-full border p-2" required />
        <input v-model="form.telefono" type="tel" placeholder="Teléfono" class="w-full border p-2" required />
        <textarea v-model="form.motivo" placeholder="Motivo de la cita" class="w-full border p-2" rows="3"></textarea>
        <button class="bg-black text-white px-6 py-2 rounded w-full" :disabled="loading">
          {{ loading ? "Agendando..." : "Confirmar Cita" }}
        </button>
      </form>

      <!-- Mensaje de confirmación -->
      <div v-if="mensaje" class="mt-6 p-4 bg-green-100 text-green-800 rounded-md border border-green-300">
        <p class="font-semibold mb-1">¡Cita agendada exitosamente!</p>
        <p><strong>Nombre:</strong> {{ confirmacion.nombre }}</p>
        <p><strong>Fecha:</strong> {{ formatFecha(confirmacion.fecha) }}</p>
        <p><strong>Motivo:</strong> {{ confirmacion.motivo }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import vuecal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const VueCal = vuecal

const doctores = ref([])
const horarios = ref([])
const selectedDoctor = ref('')
const selectedHorario = ref(null)
const showDialog = ref(false)
const selectedEvent = ref({})

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  motivo: ''
})

const confirmacion = ref({})
const mensaje = ref('')
const loading = ref(false)

const getDoctorNombre = (id) => {
  const doctor = doctores.value.find(d => d.id === id)
  return doctor ? doctor.nombre : ''
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const eventos = computed(() => {
  return horarios.value
    .filter(h => h.disponible)
    .map(h => ({
      ...h,
      start: h.start, 
      end: h.end,
      title: h.title,
      class: h.class
    }))
})

const handleHoraSeleccionada = (eventData) => {
  const event = eventData?.event || eventData
  if (event?.disponible) {
    selectedHorario.value = event
  } else {
    console.warn('Horario no disponible')
  }
}

const fetchDoctores = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctores`)
    doctores.value = res.data
  } catch (err) {
    console.error('Error cargando doctores:', err)
  }
}

const fetchHorarios = async () => {
  try {
    horarios.value = []
    selectedHorario.value = null
    if (!selectedDoctor.value) return
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/horarios/${selectedDoctor.value}`)
    horarios.value = res.data
  } catch (err) {
    console.error('Error cargando horarios:', err)
  }
}

const agendarCita = async () => {
  loading.value = true
  mensaje.value = ''
  try {
    const horarioId = selectedHorario.value?.id
    const fechaRaw = selectedHorario.value?.start
    const fecha = new Date(typeof fechaRaw === 'string' ? fechaRaw.replace(' ', 'T') : fechaRaw)

    const citaData = {
      ...form.value,
      horarioId,
      fecha
    }
    
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/citas`, citaData)
    confirmacion.value = res.data
    mensaje.value = 'Cita agendada exitosamente.'
    form.value = { nombre: '', email: '', telefono: '', motivo: '' }
    selectedDoctor.value = ''
    selectedHorario.value = null
    horarios.value = []
  } catch (error) {
    mensaje.value = 'Hubo un error al agendar la cita.'
    console.error(error)
  } finally {
    loading.value = false
  }
}

fetchDoctores()
</script>

<style>
.vuecal__weekdays-headings {
  font-size: 1rem;
}
.vuecal__week-view {
  padding-top: 10px;
}
.vuecal__cell {
  min-height: 60px;
}
</style>
