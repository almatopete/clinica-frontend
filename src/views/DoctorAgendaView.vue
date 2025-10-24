<!-- src/views/DoctorAgendaView.vue -->
<template>
  <div class="max-w-5xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">Mi agenda</h1>

    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <h2 class="font-semibold mb-2">Hoy</h2>
        <ul class="space-y-3">
          <li v-for="c in hoy" :key="c.id" class="p-4 border rounded flex justify-between">
            <div>
              <div class="font-medium">{{ f(c.fecha) }}</div>
              <div class="text-sm text-gray-600">{{ c.paciente?.nombre }} — {{ c.motivo }}</div>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-1 rounded border" @click="setEstado(c, 'CONFIRMADA')">Confirmar</button>
              <button class="px-3 py-1 rounded border" @click="setEstado(c, 'ATENDIDA')">Atendida</button>
              <button class="px-3 py-1 rounded border text-red-600" @click="setEstado(c, 'CANCELADA')">Cancelar</button>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="font-semibold mb-2">Próximos 7 días</h2>
        <ul class="space-y-3">
          <li v-for="c in semana" :key="c.id" class="p-4 border rounded">
            <div class="font-medium">{{ f(c.fecha) }}</div>
            <div class="text-sm text-gray-600">{{ c.paciente?.nombre }} — {{ c.motivo }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const citas = ref([])
const f = d => new Date(d).toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' })

onMounted(async () => {
  // ajusta a tu endpoint real de “mis citas como doctor”
  const { data } = await axios.get('/api/doctor/agenda')
  citas.value = data
})

const hoy = computed(() => {
  const t = new Date()
  return citas.value.filter(c => new Date(c.fecha).toDateString() === t.toDateString())
})
const semana = computed(() => {
  const now = new Date(), lim = new Date(now.getTime() + 7*86400000)
  return citas.value.filter(c => new Date(c.fecha) > now && new Date(c.fecha) <= lim)
})

const setEstado = async (cita, estado) => {
  await axios.patch(`/api/citas/${cita.id}`, { estado })
  const { data } = await axios.get('/api/doctor/agenda')
  citas.value = data
}
</script>
