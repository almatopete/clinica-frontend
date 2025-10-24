<template>
  <DefaultLayout>
    <div>
      <div>
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
            class="vuecal--white-theme"
            :events="eventos"
            :available-views="['week']"
            default-view="week"
            :time-from="540"
            :time-to="1100"
            hide-weekends
            :selected-date="new Date()"
            @event-click="handleHoraSeleccionada"
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

          <!-- Acciones adicionales -->
          <div v-if="confirmacion?.fecha" class="mt-4 flex flex-col md:flex-row gap-4">
            <a
              :href="googleCalendarUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
            >
              Añadir a Google Calendar
            </a>
            <button
              @click="downloadICS"
              class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Descargar para iPhone / Outlook (.ics)
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ref, computed } from 'vue'
import axios from 'axios'
import { VueCal } from 'vue-cal'
import 'vue-cal/style'
import { format } from 'date-fns'

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
    const res = await axios.get('/api/doctores')
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
    const res = await axios.get(`/api/horarios/${selectedDoctor.value}`)
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

    const res = await axios.post('/api/citas', citaData)
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

const googleCalendarUrl = computed(() => {
  if (!confirmacion.value?.fecha) return '#'

  const start = new Date(confirmacion.value.fecha)
  const end = new Date(start.getTime() + 59 * 60 * 1000)

  const formatForGCal = (d) =>
    d.toISOString().replace(/[-:]|\.\d{3}/g, '').slice(0, -1)

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=Cita+M%C3%A9dica&dates=${formatForGCal(start)}/${formatForGCal(end)}&details=${encodeURIComponent(confirmacion.value.motivo)}&location=Medical+Center`
})

const downloadICS = () => {
  const start = new Date(confirmacion.value.fecha)
  const end = new Date(start.getTime() + 59 * 60 * 1000)

  const formatICS = (date) => date.toISOString().replace(/[-:]|\.\d{3}/g, '')

  const icsContent = `\nBEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Cita Médica\nDESCRIPTION:${confirmacion.value.motivo}\nDTSTART:${formatICS(start)}\nDTEND:${formatICS(end)}\nLOCATION:Medical Center\nEND:VEVENT\nEND:VCALENDAR`.trim()

  const blob = new Blob([icsContent], { type: 'text/calendar' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'cita-medica.ics'
  link.click()
}

fetchDoctores()
</script>

<style>
.vuecal__event {
  border-radius: 0.375rem !important; /* rounded-md */
  font-weight: 500;
  font-size: 0.875rem;
}
.vuecal__title-bar {
  background-color: transparent !important;
  border-bottom: 1px solid #e5e7eb; /* Tailwind gray-200 */
}
</style>
