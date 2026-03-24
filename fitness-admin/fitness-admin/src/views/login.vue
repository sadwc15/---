<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h2>健身系统后台</h2>
      <div class="form-item">
        <input type="text" v-model="form.username" placeholder="请输入管理员账号" />
      </div>
      <div class="form-item">
        <input type="password" v-model="form.password" placeholder="请输入密码" />
      </div>
      <button @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const handleLogin = async () => {
  try {
    // 注意：这里请求的是你 SpringBoot 的接口
    const res = await axios.post('http://localhost:8081/api/admin/login', form);
    // 登录成功，存 Token，跳页面
    localStorage.setItem('token', res.data.token);
    router.push('/admin/dashboard');
  } catch (e) {
    alert('登录失败：账号或密码错误');
  }
};
</script>

<style scoped>
.login-wrapper { height: 100vh; display: flex; justify-content: center; align-items: center; background: #2c3e50; }
.login-box { width: 300px; padding: 30px; background: white; border-radius: 8px; text-align: center; }
.form-item { margin-bottom: 15px; }
input { width: 100%; padding: 10px; box-sizing: border-box; }
button { width: 100%; padding: 10px; background: #42b983; color: white; border: none; cursor: pointer; }
</style>