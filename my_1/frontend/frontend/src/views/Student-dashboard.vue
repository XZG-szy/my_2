<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="title">
        <img src="/favicon.ico" alt="平台图标" class="logo" />
        <span @click="menuClick('studentLayout')" style="font-size: 22px">
          电路知识学习平台
        </span>
      </div>
      <div class="header-right">
        <span class="welcome-message" style="font-size: 20px">欢迎您，{{ user.username || '加载中...' }}!</span>
        <span class="user-score">得分: {{ user.score}} 分</span>
        <el-button type="danger" @click="logout">退出</el-button>
      </div>
    </el-header>

    <!-- 内容区域 -->
    <el-main>
      <div class="card-container">
        <el-row :gutter="20" justify="center">
          <!-- 闯关 -->
          <el-col :span="6">
            <el-card @click="menuClick('Student-pass')" class="card" shadow="hover">
              <img src="/p1.png" alt="闯关图标" class="card-icon" />
              <div class="card-content">闯关</div>
            </el-card>
          </el-col>

          <!-- 学习 -->
          <el-col :span="6">
            <el-card @click="menuClick('Student-learn')" class="card" shadow="hover">
              <img src="/p2.png" alt="学习图标" class="card-icon" />
              <div class="card-content">学习</div>
            </el-card>
          </el-col>

          <!-- 测试 -->
          <el-col :span="6">
            <el-card @click="menuClick('Student-test')" class="card" shadow="hover">
              <img src="/p3.png" alt="测试图标" class="card-icon" />
              <div class="card-content">测试</div>
            </el-card>
          </el-col>

          <!-- 我的 -->
          <el-col :span="6">
            <el-card @click="menuClick('Student-card')" class="card" shadow="hover">
              <img src="/p4.png" alt="我的图标" class="card-icon" />
              <div class="card-content">我的</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";
import { getToken, clearToken, getActivePath, setActivePath } from "../utils/storage.js";
import { ElMessage } from "element-plus";

export default {
  name: "User",
  data() {
    return {
      user: {
        username: "",
        score: 0,
      },
      activePath: "",
    };
  },
  methods: {
    // 导航栏点击事件
    menuClick(path) {
      this.activePath = path;
      setActivePath(path);
      if (this.$route.path !== "/" + path) this.$router.push(path);
      console.log(path);
    },
    // 退出登录
    logout() {
      this.$confirm("此操作将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            clearToken();
            this.$message({
              type: "success",
              message: "退出登录成功!",
            });
            this.$router.push("/");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
    },
    // 获取用户信息
    async fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data);

        if (response.data && response.data.user) {
          this.user = response.data.user;
          console.log('User data:', this.user);

          if ('score' in this.user) {
            this.score = this.user.score;
            console.log('User score:', this.score);
          } else {
            console.log('Score not found in user data.');
          }
        } else {
          console.log('User data not found in API response.');
        }
      } catch (error) {
        ElMessage.error('无法获取用户信息');
        console.log('Error fetching user data:', error);
      }
    },
  },
  created() {
    this.fetchUser();
  },
};
</script>

<style scoped>
.el-header {
  background-color: #409EFF;
  display: flex;
  justify-content: space-between; /* Align title on the left, user info on the right */
  align-items: center;
  border-bottom: 1px solid lightgrey;
  height: 60px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px; /* Adds space between the elements */
}

.title {
  color: white;
}

.logo {
  width: 2vw;   /* 宽度为视口宽度的2% */
  height: auto; /* 自动保持宽高比 */
  margin-right: 10px;
}

.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 250px;
}

.card {
  width:250px;
  height:auto;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  border: 5px solid #dcdfe6; /* 边框样式，颜色和宽度 */
  border-radius: 10px; /* 添加圆角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08); /* 初始阴影 */
}

.card:hover {
  transform: scale(1.05);
  border-color: #409EFF; /* 悬浮时边框颜色变化 */
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12), 0 4px 6px rgba(0, 0, 0, 0.1); /* 加强阴影 */
}

.card-icon {
  width: 4vw;  /* 图标大小 */
  height: auto;
  margin-bottom: 10px;
}

.card-content {
  font-size: 18px;
  font-weight: bold;
}

.welcome-message {
  font-size: 16px;
  color: white;
}

.user-score {
  font-size: 20px;
  color: grey;
}
</style>
