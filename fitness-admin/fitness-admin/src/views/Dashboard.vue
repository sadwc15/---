<template>
  <div>
    <h2>数据概览</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="title">总订单数</div>
          <div class="num">{{ stats.orderCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="title">课消记录</div>
          <div class="num">{{ stats.courseConsumption }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="title">上座率</div>
          <div class="num" style="color: #67C23A">{{ stats.attendanceRate }}%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="title">候补转正率</div>
          <div class="num" style="color: #E6A23C">{{ stats.waitlistConversion }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增：今日上课人数卡片（第二行） -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="title">今日上课人数</div>
          <div class="num" style="color: #409EFF">{{ todayClasses }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stats = ref({
  orderCount: 0,
  courseConsumption: 0,
  attendanceRate: 0,
  waitlistConversion: 0
});

// 新增：今日上课人数单独存储
const todayClasses = ref(0);

// 原有接口不动
onMounted(async () => {
  // 原来的 admin/dashboard 接口
  const res = await axios.get('http://localhost:8081/api/admin/dashboard');
  stats.value = res.data;

  // 新增：调用新接口获取今日上课人数
  try {
    const todayRes = await axios.get('http://localhost:8081/api/session/dashboard');
    todayClasses.value = todayRes.data.todayClasses || 0;
  } catch (error) {
    console.error('获取今日上课人数失败', error);
    todayClasses.value = 0;
  }
});
</script>

<style scoped>
.data-card { text-align: center; padding: 20px 0; }
.title { color: #999; font-size: 14px; margin-bottom: 10px; }
.num { font-size: 32px; font-weight: bold; color: #333; }
</style>
