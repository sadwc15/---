import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import Layout from '../views/Layout.vue'         // 新建：整体布局
import Dashboard from '../views/Dashboard.vue'   // 修改：仪表盘数据
import ProductManage from '../views/ProductManage.vue' // 新建：商品管理
import UserManage from '../views/UserManage.vue'       // 新建：用户管理
import Coaches from '../views/Coaches.vue'       // 新建：教练管理
import Courses from "@/views/Courses.vue"
import CoachCourseChart from "@/components/CoachCourseChart.vue"
import CourseAttendanceChart from "@/components/CourseAttendanceChart.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      // 登录后的主框架
      path: '/admin',
      component: Layout,
      children: [
        { path: 'dashboard', component: Dashboard }, // /admin/dashboard
        { path: 'products', component: ProductManage }, // /admin/products
        { path: 'users', component: UserManage },     // /admin/users
        { path: 'coaches', component: Coaches },   // /admin/coaches
        { path: 'courses', component:Courses },
        { path: 'coachCourseChart', component: CoachCourseChart },
        { path: 'courseAttendanceChart', component: CourseAttendanceChart }
      ]
    }
  ]
})

export default router
