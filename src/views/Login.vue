<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <img src="../assets/蓝胖子1.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        usernme: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', triger: ['blur', 'change'] },
          { min: 3, max: 10, message: '用户名位数3-10', triger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不能为空', triger: ['blur', 'change'] },
          { min: 6, max: 12, message: '密码位数6-12', triger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        const { meta, data } = await this.$axios.post('login', this.form)
        console.log(data)
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$router.push('/home')
          this.$message.success('登陆成功')
        } else {
          this.$message.error(meta.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" secoped>
  .login {
    height: 100%;
    background-color: orange;
    overflow: hidden;
    .el-form {
      background-color: #fff;
      width: 400px;
      margin: 120px auto;
      padding: 70px 40px 15px;
      border-radius: 20px;
      position: relative;
      img {
        width: 150px;
        position: absolute;
        left: 50%;
        top: -70px;
        transform: translateX(-50%);
        border-radius: 30px;
        border: 10px solid #fff;
      }
      .el-button:last-child {
        margin-left: 80px;
      }
    }
  }
</style>
