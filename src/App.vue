<script setup>
import { RouterView, useRoute } from 'vue-router'

import Navbar from './components/Navbar.vue'

const route = useRoute()

</script>

<template>
  <div class="min-h-screen bg-white">
    <Navbar v-if="route.name !== 'home'" />
    <router-view />
  </div>
</template>

<style scoped>
/* Ya no necesitas estilos aquí */
</style>
