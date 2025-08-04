<template>
  <div class="login-wrapper">
    <div class="left-panel">
      <img :src="logo" alt="Mass Fashion Logo" class="logo-image" />
    </div>

    <div class="right-panel">
      <div class="login-card">
        <h2 class="title">Sign In</h2>
        <p class="subtitle">Hi! Welcome back, you’ve been missed</p>

        <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="form">
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" placeholder="saliha@gmail.com" />
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="***********"
              show-password
            />
          </el-form-item>

          <div class="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>

          <el-button
            type="warning"
            round
            block
            class="login-btn"
            @click="handleLogin"
          >
            Sign In
          </el-button>

          <div class="divider">_____ Or sign in with _____</div>

          <div class="social-icons">
            <img src="https://img.icons8.com/ios-filled/50/mac-os.png" alt="Apple" />
            <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" />
            <img src="https://img.icons8.com/fluency/48/facebook-new.png" alt="Facebook" />
          </div>

          <p class="signup-link">
            Don’t have an account?
            <router-link to="/">Sign Up</router-link>
          </p>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import logo from '@/assets/logo mass.png'
import axios from 'axios'
import { fsmApi } from '@/services/api.js'

const router = useRouter()
const formRef = ref(null)

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [{ required: true, message: 'Password is required', trigger: 'blur' }]
}


onMounted(async () => {
  try {
    const current = await fsmApi.getCurrentState()
   

    if (current.state === 'SIGNUP') {
      const moved = await fsmApi.sendTransition('auth-flow', 'Signin', { page: 'login' })
      console.log('FSM moved to:', moved.state) // should be LOGIN
    }
  } catch (e) {
    console.error('FSM error on login page load:', e.response?.data || e.message)
  }
})

async function handleLogin() {
  try {
    await formRef.value.validate()
  } catch {
    ElMessage.error('Please fill the form correctly')
    return
  }

  try {
    const { data: users } = await axios.get('http://localhost:3000/users')
   const user = users.find(u => u.email === form.email && u.password === form.password)

if (!user) {
  ElMessage.error('Invalid Email or Password')
  return
}


try {
  const fsmResult = await fsmApi.sendTransition(user.id, 'Login', { userId: user.id })
  console.log('FSM Current State (Login):', fsmResult.state)
} catch (err) {
  console.error('FSM Transition Error (Login):', err)
}

ElMessage.success('Login successful!')
router.push(`/admin?userId=${user.id}`)

  } catch (err) {
    console.error('Login Error:', err)
    ElMessage.error('Login failed. Please try again.')
  }
}
</script>


<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* WRAPPER */
.login-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  
}

/* LEFT LOGO PANEL */
.left-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  overflow: hidden;
}

.logo-image {
  max-width: 300px;
  width: 100%;
  height: auto;
}

/* RIGHT FORM PANEL */
.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
}

/* LOGIN CARD */
.login-card {
  width: 100%;
  max-width: 420px;
  padding: 35px;
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  text-align: center;
}

/* TITLE & SUBTITLE */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 6px;
  color: rgb(0, 0, 0);
}

.subtitle {
  font-size: 13px;
  color: #777;
  margin-bottom: 24px;
}

/* FORM */
.form {
  text-align: left;
  width: 100%;
}

.el-form-item {
  margin-bottom: 18px;
}

/* FORGOT PASSWORD LINK */
.forgot-link {
  text-align: right;
  margin-bottom: 16px;
  font-size: 13px;
}

.forgot-link a {
  color: #f57224;
  text-decoration: none;
}

/* LOGIN BUTTON */
.login-btn {
  background-color: #f57224;
  border: none;
  color: white;
  font-weight: bold;
  margin-top: 8px;
}

/* DIVIDER */
.divider {
  margin: 24px 0 16px;
  font-size: 13px;
  color: #aaa;
  text-align: center;
}

/* SOCIAL ICONS */
.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
}

.social-icons img {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

/* SIGNUP LINK */
.signup-link {
  font-size: 13px;
  color: #333;
  text-align: center;
}

.signup-link a {
  color: #f57224;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}
</style>
