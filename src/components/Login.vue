<template>
  <div class="lg">
    <div class="lg_box">
      <!-- 头像 -->
      <div class="top">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <!-- 用户名与密码 -->
      <el-form
        :label-position="labelPosition"
        :model="formLabelAlign"
        class="bd"
        :rules="LoginRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="user">
          <el-input
            v-model="formLabelAlign.user"
            clearable
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon=" el-icon-lock "
            v-model="formLabelAlign.password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 登录与重置 -->
        <el-form-item class="an">
          <el-button type="primary" @click="submitLoginForm()">登录</el-button>
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        user: "admin",
        password: "123456",
      },
      LoginRules: {
        user: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度为在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  components: {},
  mounted() {},
  methods: {
    // 点击重置  登陆表单
    resetLoginForm() {
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    // 登录预验证
    submitLoginForm() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", {
          username: this.formLabelAlign.user,
          password: this.formLabelAlign.password,
        });
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登陆失败");
        this.$message.success("登陆成功");
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>
<style scoped lang='less'>
.lg {
  width: 100%;
  height: 100%;
  background-color: rgb(40, 74, 102);
  .lg_box {
    width: 450px;
    height: 300px;
    background-color: aliceblue;
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    .top {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 1px solid #eee;
      box-shadow: 0 0 10px rgb(236, 238, 235);
      padding: 10px;
      background-color: rgba(98, 98, 89, 0.126);
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgb(236, 238, 235);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgb(236, 238, 235);
      }
    }
    .bd {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 10%;
    }
  }
  .an {
    display: flex;
    justify-content: flex-end;
  }
}
</style>