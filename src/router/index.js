import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AgendarView from '../views/AgendarView.vue'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

import ProfileView from '../views/ProfileView.vue'
import MyAppointmentsView from '../views/MyAppointmentsView.vue'


const requireAuth = (to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token) {
    next('/login')
  } else {
    next()
  }
}

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/agendar', name: 'agendar', component: AgendarView, beforeEnter: requireAuth },
  { path: '/doctor/:id', name: 'DoctorView', component: () => import('@/views/DoctorView.vue') },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    beforeEnter: requireAuth
  },
  {
    path: '/my-appointments',
    name: 'my-appointments',
    component: MyAppointmentsView,
    beforeEnter: requireAuth
  },  
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router

