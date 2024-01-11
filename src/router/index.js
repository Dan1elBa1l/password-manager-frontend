import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreditCardView from '../views/CreditCardView.vue'
import PasswordView from "../views/PasswordView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    { path: '/passwords',
      name: 'passwords',
      component: PasswordView
    },
    {
      path: '/credit-card',
      name: 'creditCard',
      component: CreditCardView
    },
    {
      path: '/passwordGenerator',
      name: 'passwordGenerator',
      component: () => import('../views/PasswortGenerator.vue')
    }
  ]
})

export default router