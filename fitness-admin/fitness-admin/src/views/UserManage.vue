<template>
  <el-card>
    <template #header>
      <div class="header-box">
        <h3>👥 注册用户管理</h3>
        <el-button type="primary" @click="openAddDialog">➕ 新增用户</el-button>
      </div>
    </template>

    <el-table :data="users" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      
      <el-table-column prop="name" label="姓名" width="150">
        <template #default="scope">
          {{ scope.row.name || '未命名' }}
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="手机号" width="150" />
      
      <!-- === 新增：密码列 === -->
      <el-table-column prop="password" label="密码" width="150">
        <template #default="scope">
          <el-tag type="info">{{ scope.row.password || '无密码' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="balance" label="余额 (元)" sortable />

      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          
          <el-popconfirm 
            title="确定删除吗？" 
            @confirm="del(scope.row.id)"
            confirm-button-text="是"
            cancel-button-text="否"
            confirm-button-type="danger"
          >
            <template #reference>
              <el-button type="danger" size="small" style="margin-left: 10px">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" :disabled="isEdit"></el-input>
        </el-form-item>
        
        <!-- === 新增：密码输入框 === -->
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="不填则默认123456 (修改时不填则不改)"></el-input>
        </el-form-item>

        <el-form-item label="余额">
          <el-input-number v-model="form.balance" :min="0" :precision="2"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const users = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);

const form = reactive({
  id: null,
  name: '',
  phone: '',
  password: '', // === 新增 password ===
  balance: 0
});

const fetch = async () => {
  try {
    const res = await axios.get('http://localhost:8081/api/admin/users');
    users.value = res.data;
  } catch (e) {
    ElMessage.error('加载失败');
  }
}

const del = async (id) => {
  try {
    await axios.delete(`http://localhost:8081/api/admin/users/${id}`);
    ElMessage.success('删除成功');
    fetch();
  } catch (e) {
    ElMessage.error('删除失败');
  }
}

const openAddDialog = () => {
  isEdit.value = false;
  form.id = null;
  form.name = '';
  form.phone = '';
  form.password = ''; // 重置为空
  form.balance = 0;
  dialogVisible.value = true;
}

const openEditDialog = (row) => {
  isEdit.value = true;
  form.id = row.id;
  form.name = row.name || '';
  form.phone = row.phone;
  form.password = row.password || ''; // 回显当前密码
  form.balance = row.balance;
  dialogVisible.value = true;
}

const submitForm = async () => {
  if (!form.phone) return ElMessage.warning('手机号不能为空');

  const url = isEdit.value 
    ? 'http://localhost:8081/api/admin/users/update' 
    : 'http://localhost:8081/api/admin/users/add';

  try {
    await axios.post(url, form);
    ElMessage.success(isEdit.value ? '修改成功' : '新增成功');
    dialogVisible.value = false;
    fetch();
  } catch (error) {
    if (error.response && error.response.data) {
        ElMessage.error(error.response.data);
    } else {
        ElMessage.error('操作失败');
    }
  }
}

onMounted(fetch);
</script>

<style scoped>
.header-box { display: flex; justify-content: space-between; align-items: center; }
h3 { margin: 0; }
</style>