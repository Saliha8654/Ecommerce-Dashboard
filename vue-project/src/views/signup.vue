<template>
  <div class="signup-wrapper">
    <div class="left-panel">
      <img :src="logo" alt="Mass Fashion Logo" class="logo-image" />
    </div>
    <div class="right-panel">
      <div class="signup-card">
        <h2>Create Account</h2>
        <p class="subtitle">
          Fill your information below or register<br />
          with your social account.
        </p>

        <el-form :model="signupForm" :rules="rules" ref="formRef" label-position="top" class="form">
          <el-form-item label="Name" prop="name">
            <el-input v-model="signupForm.name" placeholder="saliha" />
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input v-model="signupForm.email" placeholder="saliha12@gmail.com" />
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input
              v-model="signupForm.password"
              type="password"
              placeholder="*************"
              show-password
            />
          </el-form-item>

          <div class="checkbox">
            <el-checkbox v-model="agreed">
              Agree with <a href="#">Terms & Condition</a>
            </el-checkbox>
          </div>

          <el-button
            type="warning"
            round
            block
            class="signup-btn"
            :disabled="!agreed"
            @click="handleSignup"
          >
            Sign Up
          </el-button>

          <div class="divider">_____ Or sign up with _____</div>

          <div class="social-icons">
            <img src="https://img.icons8.com/ios-filled/50/mac-os.png" />
            <img src="https://img.icons8.com/color/48/google-logo.png" />
            <img src="https://img.icons8.com/fluency/48/facebook-new.png" />
          </div>

          <p class="login-link">
            Already have an account? <router-link to="/login">Sign in</router-link>
          </p>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'
import logo from '@/assets/logo mass.png'
import { fsmApi } from "@/services/api.js"

const router = useRouter()
const formRef = ref(null)
const agreed = ref(false)

const signupForm = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user'
})

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  password: [{ required: true, message: 'Password is required', trigger: 'blur' }]
}


onMounted(async () => {
  try {
    const fsm = await fsmApi.getCurrentState()
    console.log('FSM Current State (Signup):', fsm.state)
  } catch (err) {
    console.error('FSM Error (Signup):', err.response?.data || err.message)
  }
})

async function handleSignup() {
  try {
    await formRef.value.validate()
  } catch {
    ElMessage.error('Please fill the form correctly')
    return
  }

  try {
    const res = await axios.get(`http://localhost:3000/users?email=${signupForm.email}`)
    if (res.data.length > 0) {
      ElMessage.error('Email already exists')
      return
    }

    const { data: newUser } = await axios.post('http://localhost:3000/users', signupForm)

   
    try {
      const fsmResult = await fsmApi.sendTransition(newUser.id, "Signup", {
        userId: newUser.id,
        email: newUser.email
      })
      console.log('FSM State after Signup():', fsmResult.state)
    } catch (fsmErr) {
      console.error('FSM API error:', fsmErr.response?.data || fsmErr.message)
    }

    ElMessage.success('Signup successful! Please login')
    router.push('/login')
  } catch (err) {
    console.error('Signup Error:', err)
    ElMessage.error('Signup failed. Please try again.')
  }
}
</script>

<style scoped>

* {
 
  margin: 0;
  padding: 0;
}


.signup-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* LEFT: LOGO SIDE */
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

/* RIGHT: FORM SIDE */
.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
}

/* SIGNUP CARD */
.signup-card {
  width: 100%;
  max-width: 420px;
  padding: 35px;
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  text-align: center;
}

/* TEXT */
.signup-card h1 {
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 6px;
   color:rgb(0, 0, 0);
}

.subtitle {
  font-size: 13px;
  margin-bottom: 24px;
  color: #777;
}

/* FORM */
.form {
  text-align: left;
  width: 100%;
}

.el-form-item {
  margin-bottom: 18px;
}

.checkbox {
  font-size: 13px;
  color: #555;
  margin-bottom: 16px;
}

.checkbox a {
  color: #f57224;
  text-decoration: none;
}

/* BUTTON */
.signup-btn {
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

/* BOTTOM LINK */
.login-link {
  font-size: 13px;
  color: #333;
}

.login-link a {
  color: #f57224;
  text-decoration: none;
  font-weight: 500;
}
</style>