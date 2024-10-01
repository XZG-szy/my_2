<template>
  <el-card>
    <div class="home-container">
      <!-- Top bar -->
      <el-header>
        <div class="header-left">
          <span class="title">闯关模式</span>
        </div>
        <div class="header-right">
          <el-button @click="goBack" class="back-button" type="danger">返回</el-button>
        </div>
      </el-header>
      <!-- Main content area -->
      <el-main>
        <div class="levels">
          <div
              v-for="(level, index) in generatedLevels"
              :key="index"
              class="level"
              :style="{ backgroundImage: `url(${level.image})` }"
              @click="selectLevel(level.id)"
          >
            关卡 {{ index + 1 }}
          </div>
        </div>
      </el-main>
    </div>
  </el-card>
</template>

<script>
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      totalLevels: 9, // Total number of levels
      user: {}, // User data, including score
      score: 0 // User's score
    };
  },
  computed: {
    generatedLevels() {
      return Array.from({ length: this.totalLevels }, (v, i) => {
        const levelStatus = i < this.score ? 'completed' :
            i === this.score ? 'inProgress' :
                'locked';
        let image;
        switch (levelStatus) {
          case 'completed':
            image = '/s1.png';
            break;
          case 'inProgress':
            image = '/s2.png';
            break;
          default:
            image = '/s3.png';
        }
        return {
          id: i + 1,
          image: image,
        };
      });
    }
  },
  methods: {
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
        if (response.data && response.data.user) {
          this.user = response.data.user;
          this.score = this.user.score || 0; // Update score
        } else {
          console.log('User data not found in API response.');
        }
      } catch (error) {
        ElMessage.error('无法获取用户信息');
        console.log('Error fetching user data:', error);
      }
    },
    goBack() {
      this.$router.push('/student-dashboard'); // Navigates back to the student-dashboard.vue
    },
    selectLevel(levelId) {
      if (levelId - 1 > this.score) {
        ElMessage.error('当前关卡未开启!');
      } else {
        ElMessage.success(`已选择关卡 ${levelId}`);
        // 使用路由导航到对应问题页面
        this.$router.push({ path: `/Student-question/${levelId}` });
      }
    }
  },
  created() {
    this.fetchUser();
  },
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #409EFF;
  color: white;
  height: 60px;
}

.header-left{
  font-size: 22px;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.levels {
  display: grid;
  grid-template-columns: repeat(3, 120px); /* 3 columns */
  grid-gap: 20px;
}

.level {
  width: 120px; /* Level area width */
  height: 120px; /* Level area height */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  border-radius: 10px;
  cursor: pointer;
  background-size: cover; /* Ensure background image covers the element */
  background-position: center; /* Center background image */
  background-repeat: no-repeat; /* Prevent image repeat */
  color: black;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.level:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adds a subtle shadow on hover */
}
</style>
