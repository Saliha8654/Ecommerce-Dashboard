
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'

import Admin from '@/views/Admin.vue'
import store from '@/store'
const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Signup },
 { path: '/admin', component: Admin },
 { path: '/admin/add', component: () => import('../views/AddProduct.vue') },
{
  path: '/admin/edit/:id?',
  component: () => import('../views/EditProduct.vue')
},
{
  path: '/admin/delete',
  component: () => import('../views/DeleteProduct.vue')
},
{
  path: '/admin/display',
  component: () => import('../views/DisplayProduct.vue')
}

]

export default createRouter({
  history: createWebHistory(),
  routes
})


