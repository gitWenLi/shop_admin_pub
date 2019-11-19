<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo"></div>
        <h1>电商后台管理系统</h1>
        <div class="login-out">
          欢迎~ <a @click="loginOut" href="javascript:;">登出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-row class="tac">
            <el-col>
              <el-menu
                router
                :default-active="getPath"
                class="el-menu-vertical-demo"
                unique-opened>
                <el-submenu :index="items.authName" v-for="items in menusData" :key="items.authName">
                  <template slot="title">
                    <i class="el-icon-cherry"></i>
                    <span>{{items.authName}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item :index="item.path" v-for="item in items.children" :key="item.authName">
                      <i class="el-icon-lollipop"></i>
                      <span slot="title">{{item.authName}}</span>
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
</el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menusData: []
    }
  },
  async created () {
    const { data, meta } = await this.$axios.get('menus')
    // console.log(data)
    if (meta.status === 200) {
      this.menusData = data
    }
  },
  methods: {
    async loginOut () {
      try {
        await this.$confirm('确定退出当前用户？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
        this.$message.success('退出成功')
      } catch {
        this.$message.info('已取消')
      }
    }
  },
  computed: {
    getPath () {
      return this.$route.path.slice(1)
    }
  }
}
</script>

<style lang="less" secoped>
  .home {
    height: 100%;
    >.el-container {
      height: 100%;
    }
    .el-header {
      background-color: steelblue;
      text-align: center;
      position: relative;
      line-height: 60px;
      .logo {
        position: absolute;
        width: 200px;
        height: 100%;
        left: 0;
        top: 0;
        background: url("../assets/蓝胖子2.jpg") no-repeat center center/cover;
      }
      h1 {
        margin: 0 200px;
        height: 100%;
        color: #fff;
      }
      .login-out {
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        width: 200px;
        font-size: 14px;
        a {
          color: orange;
          text-decoration: none;
        }
      }
    }
    .el-aside {
      background-color: #fff;
    }
    .el-main {
      background-color: orange;
    }
  }
</style>
