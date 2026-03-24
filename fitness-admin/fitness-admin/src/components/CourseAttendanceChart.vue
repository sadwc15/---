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
  const res = await axios.get('http://localhost:8081/api/stats/course-attendance-stats');
  const data = res.data;

  const courseNames = data.map(item => item.courseName);
  const attendedData = data.map(item => item.attendedCount);
  const notAttendedData = data.map(item => item.notAttendedCount);

  chartInstance = echarts.init(chart.value);
  chartInstance.setOption({
    title: { text: '课程上课情况统计' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['已上课', '未上课'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: courseNames,
      axisLabel: { rotate: 30 }
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '已上课',
        type: 'bar',
        stack: 'total',
        data: attendedData,
        itemStyle: { color: '#67C23A' }
      },
      {
        name: '未上课',
        type: 'bar',
        stack: 'total',
        data: notAttendedData,
        itemStyle: { color: '#F56C6C' }
      }
    ]
  });

  window.addEventListener('resize', () => chartInstance?.resize());
});
</script>
