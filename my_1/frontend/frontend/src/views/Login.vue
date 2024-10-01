<!-- frontend/src/views/Login.vue -->
<template>
  <div class="login-container" :style="backgroundDiv">
    <el-card class="login-card">
      <h2>登录</h2>
      <el-form :model="loginForm" @submit.prevent="onSubmit">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="loginForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="loginForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <!-- 角色单选框 -->
        <el-form-item class="role">
          <el-radio-group v-model="role" size="small">
            <el-radio label="学生"></el-radio>
            <el-radio label="教师"></el-radio>
            <el-radio label="管理员"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="btns">
          <el-button
              type="primary"
              style="font-size: 22px"
              @click="onSubmit"
          >
            登录</el-button
          >
          <el-button
              type="info"
              style="font-size: 22px"
              @click="goToRegister"
          >
            注册新账号</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import loginImage from '../assets/login.jpg';

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      role: '学生', // Default role
      formLabelWidth: '80px',
      // 背景图片
      backgroundDiv: {
        backgroundImage:
            `url(${loginImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"

      },
    };
  },
  methods: {
    async onSubmit() {
      try {
        const response = await axios.post('/api/auth/login', this.loginForm);
        ElMessage.success(response.data.message);
        localStorage.setItem('token', response.data.token);
        this.$router.push('/');

        // Redirect based on the selected role
        if (this.role === '学生') {
          this.$router.push('/Student-dashboard');
        } else if (this.role === '教师') {
          this.$router.push('/Teacher-dashboard');
        } else if (this.role === '管理员') {
          this.$router.push('/Admin-dashboard');
        }
      } catch (error) {
        ElMessage.error(error.response?.data?.error || '登录失败');
      }
    },
    goToRegister() {
      this.$router.push('/Register');
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
  padding: 20px;
}


.role {
  margin-left: 70px;
  margin-right: 70px;
}

.btns {
  display: flex;
  justify-content: flex-end;
  height: 40px;
}
</style>
