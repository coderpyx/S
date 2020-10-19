<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../../assets/img/login/logo.jpg" alt="" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFromRef"
        label-width="0px"
        class="login_form"
        :model="loginform"
        :rules="loginFromRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginform.username"
            prefix-icon="iconfont icon-yonghu"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginform.password"
            prefix-icon="iconfont icon-suo"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// 网络请求
import { getLogin } from "../../network/login";
export default {
  name: "login",
  data() {
    return {
      // 登录表单对象数据
      loginform: {
        username: "admin",
        password: "123456",
      },
      // 表单验证规则对象
      loginFromRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
        // 验证密码是否符合规则
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resetLoginFrom() {
      // 重置表单
      this.$refs.loginFromRef.resetFields();
    },
    // 点击登录，验证
    login() {
      this.$refs.loginFromRef.validate((value) => {
        getLogin(this.loginform).then((res) => {
          // console.log(res.data);
          const status = res.data.meta.status;
          if (status != 200) return this.$message.error("登录失败");
          this.$message.success("登录成功");

          // 将登录成功的token,保存到sessionStorage中
          //   项目中除了登录之外其他api接口，必须重新登录
          window.sessionStorage.setItem("token", res.data.data.token);
          // 登录成功后，跳转页面
          this.$router.push("/home");
        });
      });
    },
  },
};
</script>

<style lang='less' scoped>
.login_container {
  height: 100%;
  background-color: pink;
  position: relative;
  .login_box {
    position: absolute;
    width: 500px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 10px;

    .avatar_box {
      position: relative;
      width: 120px;
      height: 120px;
      padding: 5px;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      background-color: rgba(235, 41, 73, 0.404);

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  top: 35%;
  left: 50%;
  width: 80%;
  transform: translateX(-50%);
}
</style>