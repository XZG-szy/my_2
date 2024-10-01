<!-- frontend/src/views/Register.vue -->
<template>
  <div class="register-container" :style="backgroundDiv">
    <el-card class="register-card">
      <h2>注册</h2>
      <el-form :model="registerForm" @submit.prevent="onSubmit">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="registerForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="registerForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input v-model="registerForm.confirmPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-input v-model="registerForm.classId" autocomplete="off" />
        </el-form-item>
        <!-- 性别单选框 -->
        <el-form-item class="gender">
          <el-radio-group v-model="registerForm.gender" size="small">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="registerForm.telephone" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button type="text" @click="goToLogin">取消</el-button>
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
  name: 'Register',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        classId: '',
        gender: '',
        telephone: ''
      },
      formLabelWidth: '100px',
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
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        ElMessage.error('密码与确认密码不一致');
        return;
      }
      try {
        const response = await axios.post('/api/auth/register', {
          username: this.registerForm.username,
          password: this.registerForm.password,
          classId: this.registerForm.classId,
          gender: this.registerForm.gender,
          telephone: this.registerForm.telephone
        });
        ElMessage.success(response.data.message);
        this.$router.push('/login');
      } catch (error) {
        ElMessage.error(error.response?.data?.error || '注册失败');
      }
    },
    goToLogin() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.register-card {
  width: 400px;
  padding: 20px;
}

.gender {
  margin-left: 100px;
  margin-right: 100px;
}
</style>
