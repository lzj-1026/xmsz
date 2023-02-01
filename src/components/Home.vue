<template>
  <el-container class="box">
    <!-- 头部区域 -->
    <el-header class="top">
      <div>
        <img src="@/assets/jingling_logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="removeToken">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!--侧边栏  -->
      <el-aside class="aside" :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="tog_button">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 开启路由模式   没有/  手动添加 -->

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main class="main">
        <!-- 路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      icons: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false,
      //   被激活的链接地址
      activePath: "",
    };
  },
  components: {},
  mounted() {},
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    removeToken() {
      // 清空token
      window.sessionStorage.clear();
      //重定向
      this.$router.push("/login");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    async getMenuList() {
      let { data: res } = await this.axios.get("menus");
      if (res.meta.status !== 200) return this.$$message.error(res.meta.msg);
      this.menuList = res.data;
      console.log(res);
    },
    // 点击按钮切换菜单折叠展开
    tog_button() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>
<style scoped lang='less'>
.box {
  height: 100%;
  //   头部
  .top {
    background-color: rgb(47, 52, 51);
    display: flex;
    padding-left: 0;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 20px;
      }
    }
    img {
      width: 50px;
      height: 50px;
    }
  }
  //   侧边栏
  .aside {
    background-color: rgb(47, 52, 51);
    .el-menu {
      border-right: 0;
    }
  }
  //   主体
  .main {
    background-color: rgb(230, 232, 231);
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button {
    background-color: rgb(77, 84, 99);
    font-size: 10px;
    line-height: 24px;
    color: white;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
</style>