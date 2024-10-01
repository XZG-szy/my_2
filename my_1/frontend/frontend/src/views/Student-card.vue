<template>
  <el-card>
    <div class="info-container">
      <el-header>
        <div class="header-left">
          <span class="title">学生信息</span>
        </div>
        <div class="header-right">
          <el-button @click="goBack" class="back-button" type="danger">返回</el-button>
        </div>
      </el-header>

      <el-main>
        <el-card>
          <el-form :model="user" label-width="120px">
            <el-form-item label="用户ID">
              <el-input v-model="user.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="user.username"></el-input>
            </el-form-item>
            <el-form-item label="班级">
              <el-input v-model="user.classId"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="user.gender"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="user.telephone"></el-input>
            </el-form-item>
            <el-form-item label="当前得分">
              <el-input v-model="user.score" disabled></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" @click="showPasswordInputs">修改密码</el-button>
              <el-button type="primary" @click="updateUserInfo">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- Password Change Inputs -->
        <el-card v-if="isPasswordInputVisible" class="password-input-card">
          <el-form :model="passwordForm" label-width="120px">
            <el-form-item label="当前密码">
              <el-input type="password" v-model="passwordForm.currentPassword" placeholder="请输入当前密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="isPasswordInputVisible = false">取 消</el-button>
              <el-button type="primary" @click="updatePassword">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        username: '',
        id: '',
        classId: '',
        gender: '',
        telephone: '',
        score: 0,
      },
      isPasswordInputVisible: false,
      passwordForm: {
        currentPassword: '',
        newPassword: '',
      },
    };
  },
  methods: {
    // 获取用户信息
    async fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.user) {
          this.user = response.data.user;
        }
      } catch (error) {
        console.error('无法获取用户信息:', error);
      }
    },
    // 修改密码
    async updatePassword() {
      const token = localStorage.getItem('token');
      const { currentPassword, newPassword } = this.passwordForm; // Use passwordForm to access values

      if (!currentPassword || !newPassword) {
        this.$message.error('请填写当前密码和新密码');
        return;
      }

      try {
        await axios.put(
            '/api/auth/update-password',
            { currentPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        this.$message.success('密码修改成功');
        this.passwordForm.currentPassword = ''; // 清空输入框
        this.passwordForm.newPassword = ''; // 清空输入框
        this.isPasswordDialogVisible = false; // Close the dialog after success
      } catch (error) {
        this.$message.error('密码修改失败');
        console.error('修改密码失败:', error);
      }
    },
    // 更新用户信息
    async updateUserInfo() {
      const token = localStorage.getItem('token');
      try {
        await axios.put(
            '/api/auth/update-user-info',
            {
              username: this.user.username,
              classId: this.user.classId,
              gender: this.user.gender,
              telephone: this.user.telephone,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        this.$message.success('信息更新成功');
        await this.fetchUser(); // Fetch updated user info
      } catch (error) {
        console.error('更新用户信息失败:', error.response ? error.response.data : error.message);
        this.$message.error('信息更新失败');
      }
    },
    showPasswordInputs() {
      this.isPasswordInputVisible = true; // 显示修改密码对话框
      console.log("hello");
    },
    goBack() {
      this.$router.push('/student-dashboard'); // Navigates back to the student-dashboard.vue
    },
  },
  created() {
    this.fetchUser();
  },
};
</script>

<style scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #409EFF;
  color: white;
  height: 60px;
}

.info-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-left {
  font-size: 22px;
}

.header-right {
  display: flex;
  align-items: center;
}

/* Adjust card styles */
.password-input-card {
  margin-top: 20px; /* Adds some space above the card */
}

/* Optional: Style for button colors */
.el-button--primary {
  background-color: #409EFF; /* Primary button color */
  border-color: #409EFF; /* Primary button border color */
}
</style>

