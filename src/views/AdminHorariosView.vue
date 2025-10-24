<!-- src/views/AdminHorariosView.vue -->
<template>
  <div class="max-w-5xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">Gestión de horarios</h1>

    <label class="block mb-2 font-medium">Doctor</label>
    <select v-model="doctorId" @change="cargar" class="border p-2 rounded mb-6">
      <option value="">-- Selecciona --</option>
      <option v-for="d in doctores" :key="d.id" :value="d.id">{{ d.nombre }} — {{ d.especialidad }}</option>
    </select>

    <form @submit.prevent="crear" class="flex gap-2 mb-6">
      <input type="datetime-local" v-model="form.inicio" class="border p-2 rounded" required />
      <input type="number" v-model.number="form.duracion" class="border p-2 rounded w-28" placeholder="Min" required />
      <button class="bg-black text-white px-4 py-2 rounded">Agregar slot</button>
    </form>

    <ul class="space-y-2">
      <li v-for="h in horarios" :key="h.id" class="p-3 border rounded flex justify-between">
        <div>{{ fmt(h.start) }} — {{ fmt(h.end) }} <span v-if="!h.disponible" class="text-xs text-red-600">(ocupado)</span></div>
        <button class="text-red-600" @click="eliminar(h.id)">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const doctores = ref([])
const doctorId = ref('')
const horarios = ref([])
const form = ref({ inicio: '', duracion: 60 })
const fmt = d => new Date(d).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })

onMounted(async () => {
  const { data } = await axios.get('/api/doctores')
  doctores.value = data
})

const cargar = async () => {
  horarios.value = []
  if (!doctorId.value) return
  const { data } = await axios.get(`/api/horarios/${doctorId.value}`)
  horarios.value = data
}

const crear = async () => {
  const start = new Date(form.value.inicio)
  const end = new Date(start.getTime() + form.value.duracion * 60000)
  await axios.post('/api/horarios', { doctorId: doctorId.value, start, end })
  await cargar()
  form.value.inicio = ''
}

const eliminar = async (id) => {
  await axios.delete(`/api/horarios/${id}`)
  await cargar()
}
</script>
