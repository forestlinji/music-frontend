<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>注册</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h1 class="pageH">music注册</h1>
      <el-form
        :model="signupForm"
        :rules="dataRule"
        ref="signupFormRef"
        @keyup.enter.native="signupFormSubmit()"
        status-icon
      >
        <el-form-item prop="username" label="用户名">
          <el-input v-model="signupForm.username" placeholder="用户名在3-16位之间"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-row>
            <el-col>
              <el-input v-model="signupForm.email" placeholder="邮箱"></el-input>
            </el-col>
            <el-col>
              <el-button type="primary" @click="getCode()">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="activeCode" label="验证码">
          <el-input v-model="signupForm.activeCode" placeholder="请输入邮箱中的验证码"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="signupForm.password" type="password" placeholder="密码在6-16位之间，不能是纯数字"></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd" label="再次输入密码">
          <el-input v-model="signupForm.checkPwd" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn-submit" type="primary" @click="signupFormSubmit()">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import { getUUID, aesMinEncrypt } from "@/utils";
export default {
  data() {
    var isNum = (rule, value, cb) => {
      if (/^\d+$/.test(value)) {
        return cb(new Error("密码不能是纯数字"));
      }
      cb();
    };
    var checkUsername = async (rule, value, cb) => {
      const { data: res } = await this.$http.get("/user/username", {
        params: {
          username: value,
        },
      });
      if (res.status !== 200) {
        return cb(new Error("用户名重复"));
      }
      cb();
    };
    var checkEmail = async (rule, value, cb) => {
      const { data: res } = await this.$http.get("/user/email", {
        params: {
          email: value,
        },
      });
      if (res.status !== 200) {
        return cb(new Error("邮箱重复"));
      }
      cb();
    };
    var checkPwd = (rule, value, cb) => {
      if (value !== this.signupForm.password) {
        return cb(new Error("两次输入密码不一致"));
      }
      cb();
    };
    return {
      signupForm: {
        username: "",
        email: "",
        password: "",
        checkPwd: "",
        activeCode: "",
      },
      dataRule: {
        username: [
          { required: true, message: "帐号不能为空", trigger: "blur" },
          { min: 3, max: 16, message: "用户名在3-16位之间", trigger: "blur" },
          { validator: checkUsername, message: "用户名重复", trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
          { validator: checkEmail, message: "邮箱重复", trigger: "blur" },
        ],
        activeCode: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
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
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
      },
      captchaPath: "",
    };
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    signupFormSubmit() {
      this.$refs.signupFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("/user/signup", {
          username: this.signupForm.username,
          email: this.signupForm.email,
          password: this.signupForm.password,
          activeCode: this.signupForm.activeCode,
        });
        if (res.status === 202) {
          return this.$message.error("验证码错误");
        }
        if (res.status !== 200) {
          return this.$message.error("注册失败");
        }
        this.$router.push("/");
        return this.$message.success("注册成功");
      });
    },

    async getCode() {
      if (this.signupForm.email.trim() === "") {
        return this.$message.error("邮箱不合法");
      }
      const { data: res1 } = await this.$http.get("/user/email", {
        params: {
          email: this.signupForm.email,
        },
      });
      if (res1.status !== 200) {
        return this.$message.error("邮箱不正确");
      }

      const { data: res } = await this.$http.get("/user/activeCode", {
        params: {
          email: this.signupForm.email,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("激活码发送失败");
      }else{
        return this.$message.sucess("激活码发送成功，请及时查收");
      }
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