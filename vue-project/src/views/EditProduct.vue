<template>
  <div class="edit-product-page">
 <header class="navbar">
      <div class="logo">Mass<span>.</span> Admin Panel</div>
   
    </header>
    <div class="content-wrapper">
      <h1 class="page-title">Edit Product</h1>

      <!-- Input for product ID -->
      <div class="form-group">
        <label for="productId">Enter Product ID:</label>
        <input v-model="productId" id="productId" type="text" placeholder="Enter Product ID" />
        <button class="load-btn" @click="loadProduct">Load Product</button>
      </div>

      <!-- Edit form -->
      <form v-if="productLoaded" @submit.prevent="updateProduct" class="edit-product-form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input v-model="product.name" id="name" type="text" required />
        </div>
        <div class="form-group">
          <label for="price">Price (Rs):</label>
          <input v-model.number="product.price" id="price" type="number" min="0" required />
        </div>
        <div class="form-group">
          <label for="category">Category:</label>
          <input v-model="product.category" id="category" type="text" required />
        </div>
        <div class="form-group">
          <label for="image">Image File Name:</label>
          <input v-model="product.image" id="image" type="text" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea v-model="product.description" id="description" rows="3"></textarea>
        </div>

        <div class="button-group">
          <button type="button" @click="cancel" class="cancel-btn">Cancel</button>
          <button type="submit" class="save-btn">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { fsmApi } from '@/services/api'

const router = useRouter()
const route = useRoute()

const productId = ref(route.params.id || '') 
const product = ref({})
const productLoaded = ref(false)


onMounted(async () => {
  try {
    const fsmResult = await fsmApi.sendTransition('admin-flow', 'Editproduct')
    console.log('FSM Current State (EditProduct):', fsmResult.state)
  } catch (err) {
    console.error('FSM Error (EditProduct):', err.response?.data || err.message)
  }
})


const loadProduct = async () => {
  try {
    if (!productId.value) {
      alert('Please enter a product ID.')
      return
    }
    const response = await axios.get(`http://localhost:3000/products/${productId.value}`)
    product.value = response.data
    productLoaded.value = true
  } catch (err) {
    console.error('Error loading product:', err)
    alert('No product found with this ID.')
  }
}


const updateProduct = async () => {
  try {
    await axios.put(`http://localhost:3000/products/${productId.value}`, product.value)
    await fsmApi.sendTransition('admin-flow', 'Save')
    console.log('FSM transitioned back to ADMIN after Save.')
    alert('Product updated successfully!')
    router.push('/admin')
  } catch (err) {
    console.error('Error updating product:', err)
    alert('Failed to update product.')
  }
}

const cancel = async () => {
  try {
    await fsmApi.sendTransition('admin-flow', 'Cancel')
    console.log('FSM transitioned back to ADMIN after Cancel.')
  } catch (err) {
    console.error('FSM Error (Cancel EditProduct):', err)
  }
  router.push('/admin')
}
</script>


<style scoped>
.edit-product-page {
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

.edit-product-page::before {
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
  width: 900px;
  margin: 60px auto 40px;
  padding: 40px 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.25);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.form-group:first-child {
  display: flex;
  align-items: center;
  gap: 15px;
}

.load-btn {
  background-color: #f57224;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 18px rgba(245, 114, 36, 0.6);
}

.load-btn:hover {
  background-color: #d45a0e;
  box-shadow: 0 8px 24px rgba(212, 90, 14, 0.8);
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
  font-size: 32px;
  color: #f57224;
  text-shadow: 0 2px 6px rgba(245, 114, 36, 0.5);
}

.edit-product-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 6px;
}

.form-group label {
  font-weight: 700;
  margin-bottom: 10px;
  color: #f0f0f0;
  font-size: 16px;
}

.form-group input,
.form-group textarea {
  padding: 14px 18px;
  border: 1.8px solid rgba(199, 210, 254, 0.7);
  border-radius: 12px;
  font-size: 17px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-family: 'Roboto', sans-serif;
  resize: vertical;
  background-color: rgba(255, 255, 255, 0.15);
  color: #f0f0f0;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #f57224;
  box-shadow: 0 0 12px rgba(245, 114, 36, 0.7);
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 30px;
}

.cancel-btn {
  background-color: #6b7280;
  border: none;
  padding: 14px 36px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  color: #f0f0f0;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(107, 114, 128, 0.3);
}

.cancel-btn:hover {
  background-color: #4b5563;
  box-shadow: 0 6px 14px rgba(75, 85, 99, 0.5);
}

.save-btn {
  background-color: #f57224;
  color: white;
  border: none;
  padding: 14px 36px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  font-size: 17px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 18px rgba(245, 114, 36, 0.6);
}

.save-btn:hover {
  background-color: #d45a0e;
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
