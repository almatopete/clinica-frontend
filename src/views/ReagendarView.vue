<!-- src/views/ReagendarView.vue -->
<template>
  <div class="max-w-2xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Reagendar cita</h1>

    <div v-if="cargando">Cargando…</div>
    <div v-else>
      <p class="mb-2"><b>Doctor:</b> {{ doctorNombre }}</p>
      <p class="mb-6"><b>Fecha actual:</b> {{ format(cita?.fecha) }}</p>

      <label class="block mb-2 font-medium">Selecciona nuevo horario</label>
      <select v-model="seleccionId" class="border p-2 rounded w-full mb-4">
        <option :value="null">-- Selecciona --</option>
        <option v-for="h in horariosDisponibles" :key="h.id" :value="h.id">
          {{ format(h.start) }}
        </option>
      </select>

      <button :disabled="!seleccionId || guardando" @click="guardar"
              class="bg-black text-white px-4 py-2 rounded">
        {{ guardando ? 'Guardando…' : 'Confirmar cambio' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const cita = ref(null)
const horarios = ref([])
const seleccionId = ref(null)
const cargando = ref(true)
const guardando = ref(false)

const format = (d) => {
  if (!d) return ''
  // acepta 'yyyy-MM-dd HH:mm' -> ISO
  const s = typeof d === 'string' ? d.replace(' ', 'T') : d
  return new Date(s).toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' })
}

const horariosDisponibles = computed(() => horarios.value.filter(h => h.disponible))
const doctorNombre = computed(() => cita.value?.horario?.doctor?.nombre || '—')

onMounted(async () => {
  try {
    // 1) Detalle de la cita
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/citas/${id}`)
    // data incluye: { horario: { doctor: {...} }, ... }
    cita.value = data

    // 2) Cargar horarios del doctor
    const docId = data?.horario?.doctor?.id ?? data?.horario?.doctorId
    if (docId) {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/horarios/${docId}`)
      horarios.value = res.data
    } else {
      horarios.value = []
      console.warn('No se encontró doctorId en la cita')
    }
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar la información de la cita.')
  } finally {
    cargando.value = false
  }
})

const guardar = async () => {
  if (!seleccionId.value) return
  guardando.value = true
  try {
    // Backend espera PATCH con { accion:'reprogramar', nuevoHorarioId }
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/citas/${id}`, {
      accion: 'reprogramar',
      nuevoHorarioId: Number(seleccionId.value),
    })
    router.push('/my-appointments')
  } catch (err) {
    console.error(err)
    alert('No se pudo reagendar la cita.')
  } finally {
    guardando.value = false
  }
}
</script>
