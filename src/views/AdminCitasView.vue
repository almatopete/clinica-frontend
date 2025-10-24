<!-- src/views/AdminCitasView.vue -->
<template>
  <div class="max-w-6xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Citas</h1>

    <div class="flex gap-3 mb-4">
      <select v-model="filtro.estado" @change="cargar" class="border p-2 rounded">
        <option value="">Todos</option>
        <option>PROGRAMADA</option><option>CONFIRMADA</option>
        <option>ATENDIDA</option><option>CANCELADA</option><option>NO_SHOW</option>
      </select>
      <input v-model="filtro.q" @keyup.enter="cargar" placeholder="Buscar paciente/motivo" class="border p-2 rounded w-64" />
      <button @click="cargar" class="px-3 py-2 border rounded">Filtrar</button>
    </div>

    <table class="w-full border">
      <thead class="bg-gray-50">
        <tr>
          <th class="p-2 text-left">Fecha</th>
          <th class="p-2 text-left">Paciente</th>
          <th class="p-2 text-left">Doctor</th>
          <th class="p-2 text-left">Estado</th>
          <th class="p-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in citas" :key="c.id" class="border-t">
          <td class="p-2">{{ f(c.fecha) }}</td>
          <td class="p-2">{{ c.nombre || c.paciente?.nombre }}</td>
          <td class="p-2">{{ c.doctor?.nombre }}</td>
          <td class="p-2">{{ c.estado }}</td>
          <td class="p-2 flex gap-2">
            <select v-model="c.nuevo" class="border p-1 rounded">
              <option disabled value="">Cambiar a…</option>
              <option>PROGRAMADA</option><option>CONFIRMADA</option>
              <option>ATENDIDA</option><option>CANCELADA</option><option>NO_SHOW</option>
            </select>
            <button @click="cambiar(c)" class="px-2 py-1 border rounded">Guardar</button>
            <button @click="eliminar(c)" class="px-2 py-1 border rounded text-red-600">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const citas = ref([])
const filtro = ref({ estado: '', q: '' })
const f = d => new Date(d).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })

const cargar = async () => {
  const params = {}
  if (filtro.value.estado) params.estado = filtro.value.estado
  if (filtro.value.q) params.q = filtro.value.q
  const { data } = await axios.get('/api/citas', { params })
  citas.value = data.map(c => ({ ...c, nuevo: '' }))
}
const cambiar = async (c) => {
  if (!c.nuevo) return
  await axios.patch(`/api/citas/${c.id}`, { estado: c.nuevo })
  await cargar()
}
const eliminar = async (c) => {
  if (!confirm('¿Eliminar cita?')) return
  await axios.delete(`/api/citas/${c.id}`)
  await cargar()
}

onMounted(cargar)
</script>
