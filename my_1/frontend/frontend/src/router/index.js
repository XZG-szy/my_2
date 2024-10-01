// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Home from '../views/Student-pass.vue';
import StudentDashboard from "../views/Student-dashboard.vue";
import StudentPass from "../views/Student-pass.vue";
import StudentCard from "../views/Student-card.vue";

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/student-dashboard', // Define the path
        name: 'StudentDashboard',
        component: StudentDashboard, // The component to render when this route is matched
    },
    {
        path: '/student-pass',
        name: 'StudentPass',
        component: StudentPass,
    },
    {
        path: '/student-question/:levelId',  // 使用动态路由参数
        name: 'StudentQuestion',
        component: () => import('../views/Student-question.vue'),  // 懒加载 Question 组件
        meta: { requiresAuth: true }  // 假设我们需要用户登录后才能访问这个页面
    },
    {
        path: '/student-card',
        name: 'StudentCard',
        component: StudentCard,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 导航守卫，检查需要认证的路由
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        next('/login');
    } else {
        next();
    }
});

export default router;
