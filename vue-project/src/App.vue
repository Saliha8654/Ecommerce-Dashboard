<template>
 

<div>



    <router-view />
  </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

onMounted(() => {
  store.dispatch('restoreSession')
})
const isLoggedIn = computed(() => store.getters.isLoggedIn)

const isLoginOrSignupPage = computed(() => {
  return route.path === '/login' || route.path === '/signup'
})

const handleLogout = () => {
  store.dispatch('logout')
  router.push('/login')
}

</script>

<style scoped>
nav {
  padding: 20px;
  background-color: #222;
}

nav a,
nav button {
  margin-right: 15px;
  color: lightgreen;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
}
</style>

