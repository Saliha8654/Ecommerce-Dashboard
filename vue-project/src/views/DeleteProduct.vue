<template>
  <div class="admin-dashboard">
    <!-- Top Navigation Bar -->
    <header class="navbar">
      <div class="logo">Mass<span>.</span> Admin Panel</div>
   
    </header>

    <div class="dashboard-content">
      <h1 class="dashboard-title">Delete Products</h1>

      <div class="product-list">
        <div v-for="product in products" :key="product.id" class="product-item">
          <div class="product-info">
            <p class="product-name">{{ product.name }}</p>
            <p class="product-price">Rs {{ product.price }}</p>
          </div>
          <button @click="deleteProduct(product.id)" class="delete-btn">Delete</button>
        </div>
      </div>

      <button @click="goBack" class="cancel-btn">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { fsmApi } from '@/services/api'

const products = ref([])
const router = useRouter()
const userId = ref(null)

const logout = async () => {
  try {
    if (userId.value) {
      await fsmApi.sendTransition(userId.value, 'Logout')
    }
    router.push('/login')
  } catch (err) {
    console.error('FSM Logout Error:', err)
  }
}

onMounted(async () => {
  try {
    // Fetch current logged-in admin (assuming first admin for now)
    const res = await axios.get('http://localhost:3000/users?role=admin')
    if (res.data.length > 0) {
      userId.value = res.data[0].id
      console.log("Admin User ID:", userId.value)
    }

    // Trigger FSM to go to DELETEPRODUCT state
    const fsmResult = await fsmApi.sendTransition('admin-flow', 'Deleteproduct')
    console.log('FSM Current State (DeleteProduct):', fsmResult.state)
  } catch (err) {
    console.error('FSM Error (DeleteProduct):', err.response?.data || err.message)
  }

  await loadProducts()
})

const loadProducts = async () => {
  try {
    const res = await axios.get('http://localhost:3000/products')
    products.value = res.data
  } catch (err) {
    console.error('Error fetching products:', err)
  }
}

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`)
      products.value = products.value.filter(p => p.id !== id)
      alert('Product deleted successfully!')
    } catch (err) {
      console.error('Error deleting product:', err)
      alert('Failed to delete product. Try again.')
    }
  }
}

const goBack = async () => {
  try {
    await fsmApi.sendTransition('admin-flow', 'Cancel')
    console.log('FSM transitioned back to ADMIN after Cancel.')
  } catch (err) {
    console.error('FSM Error (Cancel DeleteProduct):', err)
  }
  router.push('/admin')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

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
  position: relative;
  z-index: 1;
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


/* CONTENT */
.dashboard-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 60px 30px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #f57224;
  margin-bottom: 40px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Product List */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  width: 100%;
  max-width: 400px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(245, 114, 36, 0.15);
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid #f57224;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: #1f2937;
  font-weight: 600;
  font-size: 16px;
}

.product-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(245, 114, 36, 0.4);
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #1f2937;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #1f2937;
}

.product-price {
  font-size: 16px;
  color: #444;
}

/* Buttons */
.delete-btn {
  background-color: #f57224;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: 700;
  font-size: 16px;
  user-select: none;
}

.delete-btn:hover {
  background-color: #d45a0e;
}

.cancel-btn {
  background-color: #f57224;
  border: none;
  padding: 14px 40px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 18px;
  user-select: none;
  margin-top: 10px;
  width: 200px;
  text-transform: uppercase;
  letter-spacing: 1.1px;
  box-shadow: 0 4px 8px rgba(245, 114, 36, 0.4);
  transition: background-color 0.3s ease, transform 0.25s ease, box-shadow 0.3s ease;
}

.cancel-btn:hover {
  background-color: #d45a0e;
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(212, 90, 14, 0.6);
}
</style>
