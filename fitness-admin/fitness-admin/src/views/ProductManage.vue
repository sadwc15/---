<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <h3>🛍️ 商品库存与价格管理</h3>
        <!-- 如果你想以后做新增商品，可以在这里放个按钮，目前先不放 -->
      </div>
    </template>
    
    <el-table :data="list" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="商品名称" />
      
      <el-table-column label="价格 (元)">
        <template #default="scope">
          <el-input v-model="scope.row.price" type="number" />
        </template>
      </el-table-column>
      
      <el-table-column label="库存">
        <template #default="scope">
          <el-input-number v-model="scope.row.stock" :min="0" />
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <!-- 保存按钮 -->
          <el-button type="primary" size="small" @click="save(scope.row)">保存修改</el-button>
          
          <!-- 删除按钮 -->
          <el-popconfirm 
            title="确定要下架删除该商品吗？" 
            @confirm="del(scope.row.id)"
            confirm-button-text="删除"
            cancel-button-text="取消"
            confirm-button-type="danger"
          >
            <template #reference>
              <el-button type="danger" size="small" style="margin-left: 10px">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const list = ref([]);

// 获取商品列表
const fetch = async () => {
  try {
    const res = await axios.get('http://localhost:8081/api/public/products');
    list.value = res.data;
  } catch(e) {
    ElMessage.error('加载失败');
  }
}

onMounted(fetch);

// 保存修改
const save = async (row) => {
  try {
    await axios.post('http://localhost:8081/api/admin/product/update', {
      id: row.id,
      price: row.price,
      stock: row.stock
    });
    ElMessage.success('保存成功');
  } catch(e) {
    ElMessage.error('保存失败');
  }
}

// === 新增：删除逻辑 ===
const del = async (id) => {
  try {
    await axios.delete(`http://localhost:8081/api/admin/products/${id}`);
    ElMessage.success('删除成功');
    fetch(); // 刷新列表
  } catch(e) {
    // 如果后端返回错误信息（比如有关联数据删不掉），显示出来
    if (e.response && e.response.data) {
        ElMessage.error(e.response.data);
    } else {
        ElMessage.error('删除失败');
    }
  }
}
</script>

<style scoped>
h3 { margin: 0; }
</style>