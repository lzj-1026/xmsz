<template>
  <div>
    <el-button type="info" @click="removeToken">退出登录</el-button>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  components: {},
  mounted() {},
  methods: {
    removeToken() {
      // 清空token
      window.sessionStorage.clear();
      //重定向
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped lang='less'>
</style>