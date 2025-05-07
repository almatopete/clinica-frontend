<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const images = [
  '/images/implantes.png',
  '/images/inyeccion.png',
  '/images/imagen4.jpg',
  '/images/image_1.png',
  '/images/imagen2.png'
]

const current = ref(0)
const doctores = ref([])

const next = () => {
  current.value = (current.value + 1) % images.length
}

const prev = () => {
  current.value = (current.value - 1 + images.length) % images.length
}

onMounted(async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctores`)
  doctores.value = res.data
})
</script>


<template>
<div class="max-w-screen-xl mx-auto px-4 md:px-10">
  <!-- Header -->
    <header class="flex justify-between items-center px-10 py-5 shadow-md">
      <div class="flex items-center space-x-10">
        <a href="#" class="font-semibold">Inicio</a>
        <a href="#equipo" class="font-semibold">Equipo</a>
        <a href="#galeria" class="font-semibold">Galería</a>
      </div>
      <img src="/images/medicalcenter.png" alt="Medical Center Logo" class="h-10" />
      <router-link to="/agendar" class="bg-black text-white px-5 py-2 rounded">AGENDAR</router-link>

    </header>

    <!-- Hero Carousel -->
    <section class="relative h-[500px] bg-gray-100 flex items-center justify-center overflow-hidden">
    <img :src="images[current]" class="object-cover h-full w-full" />

    <button @click="prev" class="absolute left-4 text-white text-3xl">&#8592;</button>
    <button @click="next" class="absolute right-4 text-white text-3xl">&#8594;</button>

    <div class="absolute bottom-5 flex space-x-2">
      <span
        v-for="(img, i) in images"
        :key="i"
        class="w-4 h-4 rounded-full"
        :class="i === current ? 'bg-black' : 'bg-gray-400'"
      ></span>
    </div>
  </section>

    <!-- Servicios -->
    <section class="text-center my-16">
      <h2 class="text-3xl font-bold mb-10">Servicios</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">

        <img src="/images/image_1.png" class="rounded-full w-60 h-60 object-cover" />
        <img src="/images/imagen2.png" class="rounded-full w-60 h-60 object-cover" />
        <img src="/images/imagen3.jpg" class="rounded-full w-60 h-60 object-cover" />
      </div>
    </section>

    <!-- Valoración -->
    <section class="flex flex-col md:flex-row justify-between items-center gap-10 py-10 bg-gray-100">
      <div class="w-1/2">
        <h2 class="text-4xl font-bold mb-4">Agenda para una valoración</h2>
        <p class="mb-6 text-gray-600">Lorem ipsum dolor sit amet...</p>
        <router-link to="/agendar" class="bg-black text-white px-5 py-2 rounded">AGENDAR</router-link>

      </div>
      <img src="/images/consulta.png" class="w-1/3" />
    </section>

<!-- Nuestro equipo -->
<section id="equipo" class="text-center py-20">
      <h2 class="text-4xl font-bold mb-4">Nuestro equipo Médico</h2>
      <p class="mb-10 text-gray-600">Lorem ipsum dolor sit amet...</p>
      <div class="flex flex-wrap justify-center gap-8">
        <div v-for="doctor in doctores" :key="doctor.id" class="bg-white shadow p-5 w-80">
          <img :src="doctor.foto || '/images/default-doctor.png'" class="mb-4 w-full h-auto" />
          <h3 class="font-bold text-xl">{{ doctor.nombre }}</h3>
          <p class="text-sm text-gray-600">{{ doctor.especialidad }}</p>
          <router-link :to="`/doctor/${doctor.id}`" class="text-black mt-2 inline-block">
            Ver perfil →
          </router-link>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="py-20 bg-white text-center">
      <h2 class="text-4xl font-bold mb-10">Testimonial section</h2>
      <div class="flex justify-center gap-10">
        <div class="bg-gray-100 p-6 w-80">
          <p class="italic mb-4">"Amet minim mollit..."</p>
          <div class="flex items-center space-x-4">
            <img src="/images/autorname.jpg" class="w-10 h-10 rounded-full" />
            <div>
              <p class="font-bold">Author Name</p>
              <p class="text-sm">VP of Company</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-100 p-6 w-80">
          <p class="italic mb-4">"Amet minim mollit..."</p>
          <div class="flex items-center space-x-4">
            <img src="/images/autorname.jpg" class="w-10 h-10 rounded-full" />
            <div>
              <p class="font-bold">Author Name</p>
              <p class="text-sm">VP of Company</p>
            </div>
          </div>
        </div>
        <div class="bg-gray-100 p-6 w-80">
          <p class="italic mb-4">"Amet minim mollit..."</p>
          <div class="flex items-center space-x-4">
            <img src="/images/autorname.jpg" class="w-10 h-10 rounded-full" />
            <div>
              <p class="font-bold">Author Name</p>
              <p class="text-sm">VP of Company</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-100 py-10 text-center">
      <div class="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <input type="email" placeholder="Enter your email" class="p-2 border" />
        <button class="bg-black text-white px-4 py-2">SUBSCRIBE NOW</button>
      </div>
      <div class="flex justify-center space-x-6 mb-4">
        <a href="#">About us</a>
        <a href="#">Features</a>
        <a href="#">User Example</a>
        <a href="#">Pricing</a>
        <a href="#">Resources</a>
      </div>
      <p class="text-sm text-gray-500">© 2022 Company name. All rights reserved</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
