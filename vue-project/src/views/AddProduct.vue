<template>
  <div class="add-product-page">
    <header class="navbar">
      <div class="logo">Mass<span>.</span> Admin Panel</div>
     
    </header>
    <div class="content-wrapper">
      <h1 class="page-title">Add New Product</h1>
      <form @submit.prevent="saveProduct" class="add-product-form" novalidate>
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
import { useRouter } from 'vue-router'
import { fsmApi } from '@/services/api' // Make sure the path is correct

const router = useRouter()

const product = ref({
  name: '',
  price: 0,
  category: '',
  image: '',
  description: ''
})


onMounted(async () => {
  try {
    const transitionResult = await fsmApi.sendTransition('admin-flow', 'Addproduct')
    console.log('FSM Current State (AddProduct):', transitionResult.state)
  } catch (err) {
    console.error('FSM Error (AddProduct):', err.response?.data || err.message)
  }
})

const saveProduct = async () => {
  try {
    if (!product.value.name || !product.value.category || !product.value.image || product.value.price <= 0) {
      alert('Please fill in all required fields with valid values.')
      return
    }
    const response = await axios.get('http://localhost:3000/products')
    const products = response.data
    const maxId = products.reduce((max, p) => {
      const idNum = parseInt(p.id)
      return idNum > max ? idNum : max
    }, 0)
    product.value.id = (maxId + 1).toString()

    const basePath = '/src/assets/images/products/'
    if (!product.value.image.startsWith(basePath)) {
      product.value.image = basePath + product.value.image
    }

    await axios.post('http://localhost:3000/products', product.value)

   
    await fsmApi.sendTransition('admin-flow', 'Save')
    console.log('FSM transitioned back to ADMIN after Save.')

    alert('Product added successfully!')
    router.push('/admin')
  } catch (err) {
    console.error('Error adding product:', err)
    alert('Failed to add product. Please try again.')
  }
}

const cancel = async () => {
  try {
    await fsmApi.sendTransition('admin-flow', 'Cancel')
    console.log('FSM transitioned back to ADMIN after Cancel.')
  } catch (err) {
    console.error('FSM Error (Cancel AddProduct):', err)
  }
  router.push('/admin')
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.add-product-page {
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

.add-product-page::before {
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
  width: 700px;
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

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
  font-size: 32px;
  color: #f57224;
  text-shadow: 0 2px 6px rgba(245, 114, 36, 0.5);
}

.add-product-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  position: relative;
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

.has-error input,
.has-error textarea {
  border-color: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

.error-message {
  color: #f87171;
  font-size: 13px;
  margin-top: 6px;
  position: absolute;
  bottom: -20px;
  left: 0;
}

.image-preview {
  margin-top: 12px;
  max-width: 150px;
  max-height: 150px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(245, 114, 36, 0.4);
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: 12px;
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

.save-btn:disabled {
  background-color: #fbbf93;
  cursor: not-allowed;
  box-shadow: none;
}

.save-btn:hover:not(:disabled) {
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
