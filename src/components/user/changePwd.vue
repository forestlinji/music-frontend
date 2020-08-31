<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h1 class="pageH">修改密码</h1>
      <el-form :model="changeForm" :rules="dataRule" ref="changeFormRef" status-icon>
        <el-form-item prop="oldPassword" label="旧密码">
          <el-input v-model="changeForm.oldPassword" placeholder="请输入旧密码" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="密码">
          <el-input
            v-model="changeForm.newPassword"
            type="password"
            placeholder="密码在6-16位之间，不能是纯数字"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd" label="再次输入密码">
          <el-input v-model="changeForm.checkPwd" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-button class="login-btn-submit" type="primary" @click="resetFormSubmit()">重置密码</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var isNum = (rule, value, cb) => {
      if (/^\d+$/.test(value)) {
        return cb(new Error("密码不能是纯数字"));
      }
      cb();
    };
    var checkPwd = (rule, value, cb) => {
      if (value !== this.changeForm.newPassword) {
        return cb(new Error("两次输入密码不一致"));
      }
      cb();
    };
    return {
      changeForm: {
        oldPassword: "",
        newPassword: "",
        checkPwd: "",
      },
      dataRule: {
        oldPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "密码在6-16位之间", trigger: "blur" },
          { validator: isNum, message: "密码不能是纯数字", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "密码在6-16位之间", trigger: "blur" },
          { validator: isNum, message: "密码不能是纯数字", trigger: "blur" },
        ],
        checkPwd: [
          { required: true, message: "重复密码不能为空", trigger: "blur" },
          {
            validator: checkPwd,
            message: "两次输入密码不一致",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetFormSubmit() {
      this.$refs.changeFormRef.validate(async (valid) => {
        if (!valid) return;
        // console.log(this.changeToken)
        const { data: res } = await this.$http.post("/user/change", {
          oldPassword: this.changeForm.oldPassword,
          newPassword: this.changeForm.newPassword,
        });
        if (res.status !== 200) {
          return this.$message.error("修改密码失败,请检查旧密码是否正确");
        }
          this.$message.success("修改密码成功，请重新登录");
          window.localStorage.removeItem("token");
          window.sessionStorage.removeItem("user");
          this.$router.go(0);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.pageH {
  text-align: center;
  font-size: 30px;
}
</style>