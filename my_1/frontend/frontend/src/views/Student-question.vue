<template>
  <el-card>
    <div class="question-container">
      <el-header>
        <div class="header-left">
          <span class="title">答题模式</span>
        </div>
        <div class="header-right">
          <el-button @click="goBack" class="back-button" type="danger">返回</el-button>
        </div>
      </el-header>
      <el-main>
        <div class="question-box">
          <h2>{{ currentQuestion.question }}</h2>
          <img :src="questionImagePath" alt="题目图片" class="question-image">
          <form @submit.prevent="checkAnswer">
            <div v-for="(option, index) in currentQuestion.options" :key="index" class="option">
              <el-radio v-model="selectedAnswer" :label="String.fromCharCode(65 + index)">
                {{ option }}
              </el-radio>
            </div>
            <el-button type="primary" native-type="submit" :disabled="isAnswerSubmitted">提交答案</el-button>
          </form>
          <!-- 只有当回答正确且还有下一题时才显示“下一题”按钮 -->
          <button v-if="isAnswerSubmitted && isCorrect && canShowNext" @click="nextQuestion" class="next-question-btn">下一题</button>
          <p v-if="isAnswerSubmitted" :class="{ 'correct': isCorrect, 'wrong': !isCorrect }">{{ result }}</p>
          <img v-if="isAnswerSubmitted" :src="analysisImagePath" alt="解析图片" class="analysis-image">
          <!-- 添加学习按钮 -->  
          <el-button type="info" @click="goToLearningVideo">学习视频</el-button>
        </div>
      </el-main>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Question',
  data() {
    return {
      currentQuestionIndex: 0,
      questions: [
        {
          question: "第一题",
          answer: "D",
          options: ["Y11=3/2 , Y12=-1/2 , Y21=4 ,Y22=1/2", "Y11=3/2 , Y12= 1/2 , Y21=4 ,Y22=1/2", "Y11=3/2 , Y12=-1/2 , Y21=4 ,Y22=-1/2", "Y11=3/2 , Y12=1/2 , Y21=-4 ,Y22=1/2"]
        },
        {
          question: "第二题",
          answer: "A",
          options: ["Y11=1/50 S , Y12=Y21=-1/50 S ,  Y22=(50+j100) S", "Y11=1/50 S , Y12=Y21= 1/50 S ,  Y22=(50+j100) S", "Y11=-1/50 S , Y12=Y21=1/50 S ,  Y22=(50+j100) S", "Y11=1/50 S , Y12=Y21=-1/50 S ,  Y22=1/50 +1/j100  S"]
        },
        {
          question: "第三题",
          answer: "B",
          options: ["1S  2S   0", "5S -2S 4S", "1S -2S 4S", "5S  2S 4S"]
        },
        {
          question: "第四题",
          answer: "A",
          options: ["Z=13.2+j22.6Ω", "Z=j22.6Ω", "Z=5.2+j11.6Ω", "Z=13.2Ω"]
        },{
          question: "第五题",
          answer: "D",
          options: ["5+j10 Ω", "5+j6  Ω", "5+j12 Ω", "5+j4  Ω"]
        },{
          question: "第六题",
          answer: "A",
          options: ["1+j1V", "10000-j10000V", "10000+j10000V", "1-j1V"]
        },
        {
          question: "第七题",
          answer: "C",
          options: ["10A", "-10A", "0.1A", "-0.1A"]
        },{
          question: "第八题",
          answer: "D",
          options: ["RC", "RC/2π", "1/2πRC", "1/RC"]
        },
        {
          question: "第九题",
          answer: "A",
          options: ["9", "-4", "5", "4"]
        }
        // 你可以继续添加更多的问题
      ],
      selectedAnswer: '',
      isCorrect: null,
      result: '',
      isAnswerSubmitted: false,
      answeredQuestions: [],
      questionImages: [
        "/question_images/001.jpg",
        "/question_images/002.jpg",
        "/question_images/003.jpg",
        "/question_images/004.jpg",
        "/question_images/005.jpg",
        "/question_images/006.jpg",
        "/question_images/007.jpg",
        "/question_images/008.jpg",
        "/question_images/009.jpg"
        // 继续添加更多图片路径
      ],
      analysisImages: [
        "/analysis_images/001.jpg",
        "/analysis_images/002.jpg",
        "/analysis_images/003.jpg",
        "/analysis_images/004.jpg",
        "/analysis_images/005.jpg",
        "/analysis_images/006.jpg",
        "/analysis_images/007.jpg",
        "/analysis_images/008.jpg",
        "/analysis_images/009.jpg",
        // 继续添加更多解析图片路径
      ]
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    canShowNext() {
      return this.currentQuestionIndex < this.questions.length - 1;
    },
    questionImagePath() {
      return this.questionImages[this.currentQuestionIndex];
    },
    analysisImagePath() {
      return this.analysisImages[this.currentQuestionIndex];
    }
  },
  methods: {
    async checkAnswer() {
      const correctAnswer = this.currentQuestion.answer;
      this.isCorrect = this.selectedAnswer === correctAnswer;
      this.result = this.isCorrect
          ? "回答正确！"
          : `回答错误！正确答案是：${correctAnswer}`;
      this.isAnswerSubmitted = true;

      // 获取当前用户信息
      const token = localStorage.getItem('token');
      const userResponse = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.data && userResponse.data.user) {
        const currentUser = userResponse.data.user;
        const userScore = currentUser.score;

        // 检查是否回答正确且题目序号大于用户分数
        if (this.isCorrect && this.currentQuestionIndex + 1 > userScore && !this.answeredQuestions.includes(this.currentQuestionIndex)) {
          try {
            const response = await axios.post('/api/auth/update-score', { scoreIncrease: 1 }, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (response.data.message === '分数更新成功') {
              this.answeredQuestions.push(this.currentQuestionIndex);
            } else {
              console.error('分数更新失败');
            }
          } catch (error) {
            console.error('更新分数时发生错误:', error);
          }
        }
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.selectedAnswer = '';
        this.result = '';
        this.isCorrect = null;
        this.isAnswerSubmitted = false;
      } else {
        alert("已经没有更多问题了！");
        this.currentQuestionIndex = 0;
        this.isAnswerSubmitted = false;
      }
    },
    goBack() {
      this.$router.push({ path: '/home' });
    },
  },
  created() {
    // 假设从路由参数中获取关卡ID
    const levelId = this.$route.params.levelId;
    if (levelId) {
      this.currentQuestionIndex = Number(levelId) - 1;
    }
  }
};
methods: {  
  goToLearningVideo() {  
    window.open('【《电路分析基础》 北京邮电大学 李巍海】https://www.bilibili.com/video/BV1cp4y1P7uA?p=29&vd_source=4c56a3b2a9892d2cb345c9b25ad2c755', '_blank');  
  },  
  // 其他方法...  
} 
</script>

<style scoped>
.question-container {
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

.header-left .title {
  font-size: 22px;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.question-box {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px; /* 圆角边框 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* 盒子阴影 */
  width: 90%; /* 限制宽度 */
  max-width: 600px; /* 最大宽度 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-image {
  width: 100%; /* 使图片宽度适应容器 */
  max-width: 600px; /* 最大宽度 */
  margin-bottom: 20px; /* 增加底部间距 */
}

.analysis-image {
  width: 100%; /* 使图片宽度适应容器 */
  max-width: 600px; /* 最大宽度 */
  margin-top: 20px; /* 增加顶部间距 */
}

h2 {
  color: #333;
  font-size: 24px; /* 增加字体大小 */
  margin-bottom: 20px; /* 增加底部间距 */
}

.option {
  margin: 15px 0;
}

.el-radio__label {
  font-size: 18px; /* 增加选项的字体大小 */
}

.next-question-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 20px; /* 圆角边框 */
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* 过渡效果 */
}

.next-question-btn:hover {
  background-color: #4cae4c; /* 悬停效果 */
}

.correct {
  color: green;
  margin-top: 10px; /* 增加顶部间距 */
}

.wrong {
  color: red;
  margin-top: 10px; /* 增加顶部间距 */
}
</style>
