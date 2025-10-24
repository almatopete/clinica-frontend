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
const requireRole = roles => (to, from, next) => {
  const raw = localStorage.getItem('user')
  const user = raw ? JSON.parse(raw) : null
  if (!user || !roles.includes(user.role)) return next('/login')
  next()
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
  
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/reagendar/:id', name: 'reagendar', component: () => import('@/views/ReagendarView.vue'), beforeEnter: requireAuth }, 
  { path: '/doctor/agenda', name: 'doctor-agenda', component: () => import('@/views/DoctorAgendaView.vue'), beforeEnter: requireRole(['DOCTOR']) },
  { path: '/admin/horarios', name: 'admin-horarios', component: () => import('@/views/AdminHorariosView.vue'), beforeEnter: requireRole(['ADMIN']) },
  { path: '/admin/citas', name: 'admin-citas', component: () => import('@/views/AdminCitasView.vue'), beforeEnter: requireRole(['ADMIN']) }, 
  { path: '/admin/doctores', name: 'admin-doctores', component: () => import('@/views/AdminDoctoresView.vue'), beforeEnter: requireRole(['ADMIN']) },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router

