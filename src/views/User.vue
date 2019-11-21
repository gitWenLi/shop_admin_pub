<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select search">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="primary" plain @click="showAdd">添加用户</el-button>
    </div>
    <!-- 表格主体内容 -->
    <template>
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="用户状态">
        <template  v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEdit(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="del(row.id,$event)"></el-button>
          <el-button type="warning" icon="el-icon-star-off" round size="mini" plain @click="showSet(row)">分配角色</el-button>
        </template>
      </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <div class="block">
       <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentSize"
         :current-page="pagenum"
         :page-sizes="[5,10,15,20]"
         :page-size="pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
       </el-pagination>
    </div>
<!-- 编辑信息模态框 -->
<el-dialog
  title="编辑信息"
  :visible.sync="editVisible"
  width="40%"
  :before-close="handleEditClose">
  <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm" >
     <el-form-item label="用户名">
       <el-tag type="info">{{editForm.username}}</el-tag>
     </el-form-item>
     <el-form-item label="邮箱" prop="email">
       <el-input v-model="editForm.email" autocomplete="off"></el-input>
     </el-form-item>
     <el-form-item label="电话" prop="mobile">
       <el-input v-model="editForm.mobile"></el-input>
     </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="edit">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色模态框 -->
<el-dialog
  title="分配角色"
  :visible.sync="setVisible"
  width="40%">
  <el-form :model="setForm" status-icon :rules="rules" ref="setForm" label-width="100px" class="demo-ruleForm" >
     <el-form-item label="用户名">
       <el-tag type="info">{{setForm.username}}</el-tag>
     </el-form-item>
     <el-form-item label="角色列表" prop="rid">
      <el-select v-model="setForm.rid" placeholder="请选择">
        <el-option
        v-for="item in roleData"
        :key="item.id"
        :label="item.roleName"
        :value="item.id"
        ></el-option>
      </el-select>
     </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setVisible = false">取 消</el-button>
    <el-button type="primary" @click="set">确 定</el-button>
  </span>
</el-dialog>
<!-- 添加用户模态框 -->
<el-dialog
  title="添加用户"
  :visible.sync="addVisible"
  width="40%"
  >
  <template>
    <el-form :model="addForm" status-icon :rules="rules" label-width="80px" ref="addForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="addForm.mobile" placeholder="请输入电话"></el-input>
      </el-form-item>
    </el-form>
  </template>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="add">确 定</el-button>
    <el-button @click="addVisible = false">取 消</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      roleData: [],
      query: null,
      pagenum: 1,
      pagesize: 5,
      total: 0,
      editVisible: false,
      setVisible: false,
      addVisible: false,
      editForm: {
        id: '',
        username: '',
        emial: '',
        mobile: ''
      },
      setForm: {
        username: '',
        id: '',
        rid: ''
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
          { min: 3, max: 10, message: '用户名三到十位', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '密码为6到十二位', trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ],
        rid: [
          { required: true, message: '角色不能为空', trigger: ['blur', 'change'] }

        ]
      }
    }
  },
  created () {
    this.getTable()
  },
  methods: {
    async getTable () { // 表格内容渲染
      const { data, meta } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(data, meta)
      if (meta.status === 200) {
        this.tableData = data.users
        this.total = data.total
        // console.log(this.tableData)
      }
    },
    async changeStatus (row) { // 更改用户状态
      const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getTable()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async del (id, e) { // 删除用户
      // console.log(id)
      try {
        await this.$confirm('确定删除此用户？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        // console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getTable()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        this.$message.info('已取消删除')
      } finally {
        e.target.blur()
        e.target.parentNode.blur()
      }
    },
    showEdit (row) { // 显示修改模态框
      this.editVisible = true
      this.editForm = { ...row }
    },
    async handleEditClose () { // 确定是否关闭
      try {
        await this.$confirm('确认关闭？')
        this.editVisible = false
      } catch {
        return false
      }
    },
    async edit () { // 修改信息功能
      try {
        await this.$refs.editForm.validate()
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        // console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.getTable()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },
    async showSet (row) { // 显示分配角色模态框
      this.setVisible = true
      this.setForm.id = row.id
      this.setForm.username = row.username
      const { data, meta } = await this.$axios.get(`users/${row.id}`)
      if (meta.status === 200) {
        this.setForm.rid = data.rid
      } else {
        this.setForm.rid = ''
      }
      const res = await this.$axios.get('roles')
      this.roleData = res.data
    },
    async set () { // 分配角色
      try {
        const { id, rid } = this.setForm
        await this.$refs.setForm.validate()
        const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
        // console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.setVisible = false
          this.getTable()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },
    showAdd () { // 显示添加用户模态框
      this.addVisible = true
    },
    async add () { // 添加用户
      try {
        await this.$refs.addForm.validate()
        const { meta } = await this.$axios.post('users', this.addForm)
        console.log(meta)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addVisible = false
          this.$refs.addForm.resetFields()
          this.pagenum = Math.ceil((this.total + 1) / this.pagesize)
          this.getTable()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },
    search () { // 搜索
      this.getTable()
    },
    handleSizeChange (val) { // 页码改变
      this.pagenum = 1
      this.pagesize = val
      this.getTable()
    },
    handleCurrentSize (val) { // 当前页面
      this.pagenum = val
      this.getTable()
    }
  }
}
</script>

<style lang="less">
  .user {
    .el-table .cell {
      text-align:center;
    }
    .el-breadcrumb {
      background-color: #eeffff;
      margin-bottom: 15px;
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
    }
    .search {
      margin-bottom: 15px;
      width: 40%;
      margin-right: 7%;
    }
  }
</style>
