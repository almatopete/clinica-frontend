<!-- src/views/AdminDoctoresView.vue -->
<template>
  <div class="max-w-5xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Doctores</h1>

    <form @submit.prevent="guardar" class="grid md:grid-cols-4 gap-3 mb-6">
      <input v-model="form.nombre" placeholder="Nombre" class="border p-2 rounded" required />
      <input v-model="form.especialidad" placeholder="Especialidad" class="border p-2 rounded" required />
      <input v-model="form.subespecialidad" placeholder="Subespecialidad" class="border p-2 rounded" />
      <input v-model="form.foto" placeholder="URL foto" class="border p-2 rounded" />
      <textarea v-model="form.descripcion" class="md:col-span-4 border p-2 rounded" placeholder="Descripción"></textarea>
      <button class="bg-black text-white px-4 py-2 rounded md:col-span-4">
        {{ form.id ? 'Actualizar' : 'Crear' }}
      </button>
    </form>

    <ul class="space-y-2">
      <li v-for="d in doctores" :key="d.id" class="p-3 border rounded flex justify-between">
        <div>
          <div class="font-medium">{{ d.nombre }} — {{ d.especialidad }}</div>
          <div class="text-sm text-gray-600">{{ d.subespecialidad }}</div>
        </div>
        <div class="flex gap-2">
          <button class="border px-3 py-1 rounded" @click="editar(d)">Editar</button>
          <button class="border px-3 py-1 rounded text-red-600" @click="eliminar(d.id)">Eliminar</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const doctores = ref([])
const form = ref({ id: null, nombre: '', especialidad: '', subespecialidad: '', foto: '', descripcion: '' })

const cargar = async () => {
  const { data } = await axios.get('/api/doctores')
  doctores.value = data
}
onMounted(cargar)

const guardar = async () => {
  if (form.value.id) {
    await axios.put(`/api/doctores/${form.value.id}`, form.value)
  } else {
    await axios.post('/api/doctores', form.value)
  }
  form.value = { id: null, nombre: '', especialidad: '', subespecialidad: '', foto: '', descripcion: '' }
  await cargar()
}
const editar = d => form.value = { ...d }
const eliminar = async id => { await axios.delete(`/api/doctores/${id}`); await cargar() }
</script>
