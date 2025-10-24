<template>
    <div class="max-w-2xl mx-auto py-10 px-4">
      <h1 class="text-3xl font-bold mb-6">My Profile</h1>
      <div v-if="user">
        <p><strong>Name:</strong> {{ user.nombre }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Registered:</strong> {{ formatDate(user.createdAt) }}</p>
<button @click="doLogout">Cerrar sesion</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const user = ref(null)
  
  const formatDate = (date) => new Date(date).toLocaleDateString()
  
  onMounted(async () => {
    const res = await axios.get('/api/users/me')
    user.value = res.data
  })
  </script>

  <script>
export default {
  name: "MyButton",
  methods: {
    doLogout() {
      console.log("Hello from Vue!");
      useAuth().logout();
    }
  }
};
</script>