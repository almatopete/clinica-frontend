<!-- src/views/ReagendarView.vue -->
<template>
  <div class="max-w-2xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Reagendar cita</h1>

    <div v-if="cargando">Cargando…</div>
    <div v-else>
      <p class="mb-2"><b>Doctor:</b> {{ cita?.doctor?.nombre }}</p>
      <p class="mb-6"><b>Fecha actual:</b> {{ format(cita?.fecha) }}</p>

      <label class="block mb-2 font-medium">Selecciona nuevo horario</label>
      <select v-model="seleccion" class="border p-2 rounded w-full mb-4">
        <option :value="null">-- Selecciona --</option>
        <option v-for="h in horariosDisponibles" :key="h.id" :value="h">
          {{ format(h.start) }}
        </option>
      </select>

      <button :disabled="!seleccion || guardando" @click="guardar"
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
const seleccion = ref(null)
const cargando = ref(true)
const guardando = ref(false)

const format = d => new Date(d).toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' })
const horariosDisponibles = computed(() => horarios.value.filter(h => h.disponible))

onMounted(async () => {
  const { data } = await axios.get(`/api/citas/${id}`)
  cita.value = data
  const docId = data?.doctor?.id || data?.doctorId
  if (docId) {
    const res = await axios.get(`/api/horarios/${docId}`)
    horarios.value = res.data
  }
  cargando.value = false
})

const guardar = async () => {
  guardando.value = true
  try {
    await axios.put(`/api/citas/${id}`, {
      horarioId: seleccion.value.id,
      fecha: seleccion.value.start
    })
    router.push('/my-appointments')
  } finally {
    guardando.value = false
  }
}
</script>
