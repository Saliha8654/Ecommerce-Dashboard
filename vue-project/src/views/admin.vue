<template>
  <div class="admin-dashboard">
    <!-- Top Navigation Bar -->
    <header class="navbar">
      <div class="logo">Mass<span>.</span> Admin Panel</div>
      <button @click="logout" class="logout-button">Logout</button>
    </header>

    <!-- Main Action Buttons -->
    <div class="dashboard-content">
      <h1 class="dashboard-title">Admin Dashboard</h1>
      <div class="admin-buttons">
        <button class="action-btn" @click="goTo('add')">Add Product</button>
        <button class="action-btn" @click="goTo('edit')">Edit Product</button>
        <button class="action-btn" @click="goTo('delete')">Delete Product</button>
        <button class="action-btn" @click="goTo('display')">Display Products</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import axios from 'axios'

import { fsmApi } from '@/services/api'  
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const userId = ref(null)


const goTo = (page) => {
  if (!userId.value) {
    console.error('User ID is not set!')
    return
  }
  router.push(`/admin/${page}?userId=${userId.value}`)
}
const logout = async () => {
  try {
    if (userId.value) {
      console.log('logout transition initiated');
      await fsmApi.sendTransition(userId.value, 'Logout')
      
      // Get current state after logout
      const fsmResult = await fsmApi.getCurrentState(userId.value)
      console.log('Current state after logout:', fsmResult.state)
      
      // Verify state is LOGIN
      if (fsmResult.state === 'LOGIN') {
        console.log('State successfully changed to LOGIN');
      }
    }
    router.push('/login')
  } catch (err) {
    console.error('FSM Logout Error:', err)
  }
}




onMounted(async () => {
  try {
    // Read userId from URL query
    userId.value = route.query.userId;
    console.log("Admin User ID:", userId.value);

    // Get current FSM state for this userId
    const fsmResult = await fsmApi.getCurrentState(userId.value);
    console.log('FSM Current State (AdminDashboard):', fsmResult.state);
  } catch (err) {
    console.error('FSM Error (AdminDashboard):', err);
  }
});

</script>

<style scoped>

.admin-dashboard {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: url('/src/assets/images/covers/cover-1.jpg') no-repeat center center fixed;
  background-size: cover;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.admin-dashboard::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(31, 41, 55, 0.6); /* dark overlay for readability */
  pointer-events: none;
  z-index: 0;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1) translate(0, 0);
    opacity: 0.15;
  }
  50% {
    transform: scale(1.2) translate(10%, 10%);
    opacity: 0.25;
  }
}

/* NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1f2937;
  padding: 16px 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-bottom: 2px solid #f57224;
  font-weight: 600;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #f57224;
  letter-spacing: 1.2px;
  user-select: none;
}

.logo span {
  color: #f9a826;
}

.logout-button {
  background: transparent;
  border: 2px solid #f57224;
  color: #f57224;
  font-weight: 700;
  padding: 8px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(245, 114, 36, 0.4);
}

.logout-button:hover {
  background: #f57224;
  color: #fff;
  box-shadow: 0 4px 12px rgba(245, 114, 36, 0.7);
  transform: translateY(-2px);
}

/* CONTENT */
.dashboard-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 60px 30px;
  text-align: center;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 40px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* BUTTONS */
.admin-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.action-btn {
  background-color: #f57224;
  border: none;
  color: white;
  font-weight: 700;
  padding: 16px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.25s ease, box-shadow 0.3s ease;
  font-size: 18px;
  box-shadow: 0 4px 8px rgba(245, 114, 36, 0.4);
  width: 100%;
  user-select: none;
  text-transform: uppercase;
  letter-spacing: 1.1px;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

.action-btn:hover {
  background-color: #d45a0e;
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(212, 90, 14, 0.6);
}
</style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
</style>
