<template>
    <div class="max-w-2xl mx-auto py-10 px-4">
      <h1 class="text-3xl font-bold mb-6">My Profile</h1>
      <div v-if="user">
        <p><strong>Name:</strong> {{ user.nombre }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Registered:</strong> {{ formatDate(user.createdAt) }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const user = ref(null)
  
  const formatDate = (date) => new Date(date).toLocaleDateString()
  
  onMounted(async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`)
    user.value = res.data
  })
  </script>
  