<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名字" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入名字"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="专业" prop="expertise">
        <el-input
            v-model="queryParams.expertise"
            placeholder="请输入专业"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input
            v-model="queryParams.avatar"
            placeholder="请输入头像"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最后登陆" prop="lastLoginTime">
        <el-date-picker clearable
                        v-model="queryParams.lastLoginTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择最后登陆时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
            v-model="queryParams.password"
            placeholder="请输入密码"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input
            v-model="queryParams.phone"
            placeholder="请输入电话"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-input
            v-model="queryParams.tags"
            placeholder="请输入标签"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['fitness-backend:coaches:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['fitness-backend:coaches:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['fitness-backend:coaches:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="coachesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="名字" align="center" prop="name" />
      <el-table-column label="专业" align="center" prop="expertise" />
      <el-table-column label="过往经验" align="center" prop="bio" />
      <el-table-column label="头像" align="center" prop="avatar" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.avatar" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="最后登陆时间" align="center" prop="lastLoginTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.lastLoginTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录次数" align="center" prop="loginCount" />
      <el-table-column label="密码" align="center" prop="password" />
      <el-table-column label="电话" align="center" prop="phone" />
      <el-table-column label="标签" align="center" prop="tags" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" >修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改教练信息管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="coachesRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字" />
        </el-form-item>
        <el-form-item label="专业" prop="expertise">
          <el-input v-model="form.expertise" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="过往经验" prop="bio">
          <el-input v-model="form.bio" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入头像地址" />
        </el-form-item>
        <el-form-item label="最后时间" prop="lastLoginTime">
          <el-date-picker clearable
                          v-model="form.lastLoginTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择最后登陆时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="登录次数" prop="loginCount">
          <el-input v-model="form.loginCount" placeholder="请输入登录次数" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入标签" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Coaches">
import { listCoaches, getCoaches, delCoaches, addCoaches, updateCoaches } from "@/api/coaches"

const { proxy } = getCurrentInstance()

const coachesList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    expertise: null,
    bio: null,
    avatar: null,
    lastLoginTime: null,
    loginCount: null,
    password: null,
    phone: null,
    tags: null
  },
  rules: {
    name: [
      { required: true, message: "名字不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询教练信息管理列表 */
function getList() {
  loading.value = true
  listCoaches(queryParams.value).then(response => {
    coachesList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    name: null,
    expertise: null,
    bio: null,
    avatar: null,
    lastLoginTime: null,
    loginCount: null,
    password: null,
    phone: null,
    tags: null
  }
  proxy.resetForm("coachesRef")
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getCoaches(id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改教练信息管理"
  })
}


/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加教练信息管理"
}


/** 提交按钮 */
function submitForm() {
  proxy.$refs["coachesRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCoaches(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCoaches(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除教练信息管理编号为"' + _ids + '"的数据项？').then(function() {
    return delCoaches(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}
getList()
</script>
