<template>
  <div>
    <el-card shadow="hover">
      <div ref="chart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

const chart = ref(null);
let chartInstance = null;

onMounted(async () => {
  await nextTick();
  const res = await axios.get('http://localhost:8081/api/stats/coach-course-stats');
  const data = res.data;

  // 按教练分组
  const coachMap = new Map();
  data.forEach(item => {
    if (!coachMap.has(item.coachName)) {
      coachMap.set(item.coachName, []);
    }
    coachMap.get(item.coachName).push({
      name: item.courseName,
      value: item.selectedCount
    });
  });

  // 生成 series
  const series = [];
  const xAxisData = [];

  // 收集所有课程名称（去重）
  const allCourses = [...new Set(data.map(item => item.courseName))];
  xAxisData.push(...allCourses);

  for (let [coachName, courses] of coachMap) {
    const courseMap = new Map(courses.map(c => [c.name, c.value]));
    const data = xAxisData.map(courseName => courseMap.get(courseName) || 0);
    series.push({
      name: coachName,
      type: 'bar',
      data: data
    });
  }

  chartInstance = echarts.init(chart.value);
  chartInstance.setOption({
    title: { text: '各教练课程选课人数统计' },
    tooltip: { trigger: 'axis' },
    legend: { data: [...coachMap.keys()] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: { rotate: 30 }
    },
    yAxis: { type: 'value' },
    series: series
  });

  window.addEventListener('resize', () => chartInstance?.resize());
});
</script>
