<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>忘记密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h1 class="pageH">忘记密码</h1>
      <el-form :model="forgetForm" :rules="dataRule" ref="forgetFormRef" status-icon>
        <el-form-item prop="email" label="您的注册邮箱">
          <el-input v-model="forgetForm.email" placeholder="请输入您的注册邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendEmail()">获取验证码</el-button>
        </el-form-item>
        <el-form-item prop="changeToken" label="验证码">
          <el-input v-model="forgetForm.changeToken" placeholder="请输入邮箱中的验证码"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="forgetForm.password" type="password" placeholder="密码在6-16位之间，不能是纯数字"></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd" label="再次输入密码">
          <el-input v-model="forgetForm.checkPwd" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-button class="login-btn-submit" type="primary" @click="resetFormSubmit()">重置密码</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = async (rule, value, cb) => {
      const { data: res } = await this.$http.get("/user/email", {
        params: {
          email: value,
        },
      });
      if (res.status === 200) {
        return cb(new Error("该邮箱未注册"));
      }
      cb();
    };
    var isNum = (rule, value, cb) => {
      if (/^\d+$/.test(value)) {
        return cb(new Error("密码不能是纯数字"));
      }
      cb();
    };
    var checkPwd = (rule, value, cb) => {
      if (value !== this.forgetForm.password) {
        return cb(new Error("两次输入密码不一致"));
      }
      cb();
    };
    return {
      forgetForm: {
        email: "",
        changeToken: "",
        password: "",
        checkPwd: "",
      },
      dataRule: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        changeToken: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
        ],
        password: [
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
    async sendEmail() {
      if (this.forgetForm.email.trim() === "") {
        return this.$message.error("邮箱不合法");
      }
      const { data: res1 } = await this.$http.get("/user/email", {
        params: {
          email: this.forgetForm.email,
        },
      });
      if (res1.status !== 201) {
        return this.$message.error("邮箱不正确");
      }

      const { data: res } = await this.$http.get("/user/forgetGet", {
        params: {
          email: this.forgetForm.email,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("验证码发送失败");
      } else {
        return this.$message.sucess("验证码发送成功，请及时查收");
      }
    },

    resetFormSubmit() {
      this.$refs.forgetFormRef.validate(async valid => {
        if (!valid) return;
        // console.log(this.changeToken)
        const { data: res } = await this.$http.post("/user/forget", {
          email: this.forgetForm.email,
          newPassword: this.forgetForm.password,
          changeToken: this.forgetForm.changeToken,
        });
        if (res.status !== 200) {
          return this.$message.error("重置密码失败");
        }
        this.$message.success("重置密码成功，返回首页");
        this.$router.push("/");
      });
    }
  },
};
</script>

<style lang="less" scoped>
.pageH {
  text-align: center;
  font-size: 30px;
}
</style>