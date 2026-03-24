<template>
  <div class="app-layout">
    <!-- 左侧侧边栏 -->
    <div class="sidebar">
      <div class="logo">健身后台</div>
      <el-menu
        default-active="/admin/dashboard"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <span>📊 数据统计</span>
        </el-menu-item>
        <el-menu-item index="/admin/coachCourseChart">
          <span>📊教练课程统计</span>
        </el-menu-item>
        <el-menu-item index="/admin/courseAttendanceChart">
          <span>📈课程出勤统计</span>
        </el-menu-item>
        <el-menu-item index="/admin/products">
          <span>🛍️ 商品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <span>👥 用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/coaches">
          <span>📊 教练管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/courses">
          <span>🛍️ 课程管理</span>
        </el-menu-item>
        <el-menu-item index="/login" @click="logout">
          <span>🚪 退出登录</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
const logout = () => {
  localStorage.removeItem('token');
}
</script>

<style scoped>
.app-layout { display: flex; height: 100vh; }
.sidebar { width: 200px; background: #304156; height: 100%; color: white; }
.logo { height: 60px; line-height: 60px; text-align: center; font-size: 20px; font-weight: bold; border-bottom: 1px solid #1f2d3d; }
.main-content { flex: 1; padding: 20px; background: #f0f2f5; overflow-y: auto; }
</style>
