<template>
  <div class="display-products-page">
    <header class="navbar">
      <div class="logo">Mass<span>.</span> Admin Panel</div>
     
    </header>
    <div class="content-wrapper">
      <h2 class="page-title">Product List</h2>

      <!-- Products Grid -->
      <div class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <img :src="product.image" :alt="product.name" class="product-image" />
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">Rs {{ product.price }}</p>
          </div>
        </div>
      </div>

      <button @click="goBack" class="back-btn">Back</button>
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

// Fetch products & FSM state
onMounted(async () => {
  try {
    const fsmResult = await fsmApi.sendTransition('admin-flow', 'Displayproduct')
    console.log('FSM Current State (DisplayProducts):', fsmResult.state)
  } catch (err) {
    console.error('FSM Error (DisplayProducts):', err.response?.data || err.message)
  }

  try {
    const res = await axios.get('http://localhost:3000/products')
    products.value = res.data
  } catch (err) {
    console.error('Error loading products:', err)
  }
})

const goBack = async () => {
  try {
    await fsmApi.sendTransition('admin-flow', 'Back')
    console.log('FSM transitioned back to ADMIN after Back.')
  } catch (err) {
    console.error('FSM Error (Back DisplayProducts):', err)
  }
  router.push('/admin')
}
</script>

<style scoped>
.display-products-page {
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

.display-products-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(31, 41, 55, 0.6);
  pointer-events: none;
  z-index: 0;
}

.content-wrapper {
  max-width: 900px;
  margin: 60px auto 40px;
  padding: 40px 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.25);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-align: center;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #f57224;
  text-shadow: 0 2px 6px rgba(245, 114, 36, 0.5);
}

/* Grid Layout */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  margin-bottom: 30px;
}

/* Product Card */
.product-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 15px 20px;
  border: 1px solid rgba(199, 210, 254, 0.7);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 18px rgba(245, 114, 36, 0.6);
}

.product-image {
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 10px;
}

.product-info {
  text-align: center;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  color: #f0f0f0;
}

.product-price {
  font-size: 16px;
  color: #d1d5db;
  margin-top: 6px;
}

/* Back Button */
.back-btn {
  background-color: #f57224;
  color: white;
  border: none;
  padding: 14px 36px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 18px rgba(245, 114, 36, 0.6);
}

.back-btn:hover {
  background-color: #d45a0e;
  box-shadow: 0 8px 24px rgba(212, 90, 14, 0.8);
}

/* Navbar styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1f2937;
  padding: 16px 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-bottom: 2px solid #f57224;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
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

</style>
