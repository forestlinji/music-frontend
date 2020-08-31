<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>music</span>
      </div>
      <div class="unlogin" v-if="unLogin">
        <el-link type="primary" @click="toSignupPage">注册</el-link>
        <el-link type="primary" @click="toLoginPage">登录</el-link>
      </div>
      <div v-else>
        <span style="margin-right:20px">{{currentUser.username}}</span>
        <el-badge :value="0" class="message" hidden>
          <el-link type="primary" @click="changePwd" class="logout">修改密码</el-link>

          <el-link type="primary" @click="logout" class="logout">退出</el-link>
        </el-badge>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu index="1">
            <template slot="title">
              <span>音乐</span>
            </template>

            <el-menu-item index="/random" @click="saveNavState('/random')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>随机推荐</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/search" @click="saveNavState('/search')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>搜索歌曲</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/song" @click="saveNavState('/song')" v-if="hasRole('ROLE_ADMIN')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>音乐管理</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2" v-if="hasRole('ROLE_USER')">
            <template slot="title">
              <span>歌单</span>
            </template>

            <el-menu-item index="/musiclist" @click="saveNavState('/musiclist')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>我的歌单</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3" v-if="hasRole('ROLE_USER')">
            <template slot="title">
              <span>收藏</span>
            </template>

            <el-menu-item index="/collect" @click="saveNavState('/collect')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>我的收藏</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view @changeMessageState="changeMessageState"></router-view>
      </el-main>
    </el-container>
    <el-footer class="myfooter" style="background-color: #333;">
      <!-- <el-col :span="3">
        <el-row>
          <el-tag size="medium">当前正在播放</el-tag>
        </el-row>
        <el-row>
          <el-tag size="medium" type="warning">{{musics.name}}</el-tag>
        </el-row>
      </el-col>
      <el-col :span="21">
        <audio
          :src="this.$store.state.fileUrl+musics.link"
          controls="controls"
          style="width:100%"
          autoplay
        >1</audio>
      </el-col>-->

      <el-col :span="2">
        <el-image
          :src="this.$store.state.fileUrl+musics.image"
          :key="this.$store.state.fileUrl+musics.image"
          style="width: 50px; height: 50px; margin-top: 3px; margin-left: 40px"
          :fit="fit"
        >
          <div slot="error" class="image-slot">
            <el-image
              :src="require('../assets/img/音符01.png')"
              :key="require('../assets/img/音符01.png')"
              style="width: 50px; height: 50px; margin-left: 15px;cursor:pointer"
              :fit="fit"
            ></el-image>
          </div>
        </el-image>
      </el-col>
      <el-col :span="18">
        <el-row>
          <el-link
            style="color: #e8e8e8; font-size: 12px"
            @click="toSongPages(musics.id)"
          >{{musics?musics.name:"暂无歌曲"}}</el-link>
        </el-row>
        <audio
          :src="this.$store.state.fileUrl+musics.link"
          controls="controls"
          style="width:100%; height: 23px; margin-top: 5px"
          autoplay
          @ended="ends"
          :loop="isLoop"
        >1</audio>
      </el-col>
      <el-col :span="1">
        <!-- <el-button>上一首</el-button> -->
        <el-image
          :src="require('../assets/img/上一首.png')"
          :key="require('../assets/img/上一首.png')"
          style="width: 50px; height: 50px; margin-left: 15px;cursor:pointer"
          :fit="fit"
          @click="prevMusic"
        ></el-image>
      </el-col>
      <el-col :span="1">
        <!-- <el-button>下一首</el-button> -->
        <el-image
          :src="require('../assets/img/下一首.png')"
          :key="require('../assets/img/下一首.png')"
          style="width: 50px; height: 50px; margin-left: 5px;cursor:pointer"
          :fit="fit"
          @click="nextMusic"
        ></el-image>
      </el-col>
      <el-col :span="1">
        <!-- <el-button>播放模式</el-button> -->
        <el-image
          :src="require('../assets/img/循环02.png')"
          :key="require('../assets/img/循环02.png')"
          style="width: 50px; height: 50px; margin-left: 5px;cursor:pointer"
          :fit="fit"
          v-if="isLoop"
          @click="changeMethod"
        ></el-image>
        <el-image
          :src="require('../assets/img/循环08.png')"
          :key="require('../assets/img/循环08.png')"
          style="width: 50px; height: 50px; margin-left: 5px;cursor:pointer"
          :fit="fit"
          v-else
          @click="changeMethod"
        ></el-image>
      </el-col>
      <el-col :span="1">
        <!-- <el-button>播放列表</el-button> -->

        <el-popover placement="top-end" width="500" trigger="click" @show="getPlayList">
          <el-row>
            <span style="font-size: 14px;font-weight: bold;">播放列表</span>
            <el-link
              style="margin-left: 18px; color: #999;font-size: 12px; "
              @click="clearList"
            >清空列表</el-link>
          </el-row>
          <!-- <el-divider></el-divider> -->
          <el-table :data="playList">
            <el-table-column width="400" property="name" label="歌曲名">
              <template slot-scope="scope">
                <el-link @click="play(scope.row)">{{scope.row.name}}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="长度" prop="longs">
              <template slot-scope="scope">{{gettime(scope.row.longs)}}</template>
            </el-table-column>
          </el-table>
          <!-- <el-button>click 激活</el-button> -->
          <el-image
            :src="require('../assets/img/音频列表.png')"
            :key="require('../assets/img/音频列表.png')"
            style="width: 50px; height: 50px; margin-left: 5px;cursor:pointer"
            :fit="fit"
            slot="reference"
          ></el-image>
        </el-popover>
      </el-col>
    </el-footer>
  </el-container>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  data() {
    return {
      unLogin: true,
      userId: "",
      isCollapse: false,
      activePath: "",
      role_user: false,
      role_admin: false,
      role_root: false,
      currentUser: {},
      messageNum: 0,
      musics: {
      },
      isLoop: false,
      playList: [],
    };
  },
  created() {
    this.tryLogin();
  },

  mounted() {
    this.tryPlay();
  },

  methods: {
    async tryLogin() {
      console.log("try login");
      const token = window.localStorage.getItem("token");
      if (!token) this.unLogin = true;
      else {
        this.unLogin = false;
        const { data: res } = await this.$http.get("/user/getRole");
        if (res.status !== 200) {
          window.localStorage.removeItem("token");
          return this.$message.error("登录失效，请重新登录");
        }
        // console.log(res.data)
        window.sessionStorage.setItem("user", JSON.stringify(res.data));
        const roles = res.data.roles;
        this.userId = res.data.userId;
        switch (roles.length) {
          case 3:
            this.role_root = true;
          case 2:
            this.role_admin = true;
          case 1:
            this.role_user = true;
        }
        this.currentUser = res.data;
      }
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    hasRole(roleName) {
      const user = JSON.parse(window.sessionStorage.getItem("user"));
      // console.log(user)
      if (!user) return false;
      return user.roles.indexOf(roleName) > -1;
    },
    logout() {
      this.unLogin = true;
      window.localStorage.removeItem("token");
      window.sessionStorage.removeItem("user");
      this.role_root = false;
      this.role_admin = false;
      this.role_user = false;
      // location.href = "/";
      this.$router.push("/");
      this.$message.warning("退出成功");
      this.tryPlay();
    },
    toLoginPage() {
      this.$router.push("/login");
    },
    toSignupPage() {
      this.$router.push("/signup");
    },
    changePwd() {
      this.$router.push("/changePwd");
    },

    toSongPages(id) {
      this.$router.push("/songInfo?id=" + id);
    },

    changeMethod() {
      this.isLoop = !this.isLoop;
    },

    ends() {
      if (!this.isLoop) {
        this.$store.commit("nextMusic");
      }
    },

    getPlayList() {
      this.playList = this.$store.state.playList;
    },

    gettime(longs) {
      let minute = parseInt(longs / 60);
      var second = longs % 60;
      return minute + ":" + second;
    },

    prevMusic() {
      this.$store.commit("preMusic");
    },

    nextMusic() {
      this.$store.commit("nextMusic");
    },

    async clearList() {
      const confirmResult = await this.$confirm("是否清空播放列表", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult !== "confirm") {
        return;
      }
      (this.playList = []), (this.musics = {}), this.$store.commit("clearList");
      this.$message.warning("清空播放列表成功");
    },

    play(data) {
      this.$store.commit("changeMusic", data);
    },

    tryPlay() {
      this.$store.commit("tryPlay1");
      this.$store.commit("tryPlay2");
    },
  },

  computed: {
    musicChanges() {
      return this.$store.state.music;
    },
  },

  watch: {
    // 监视todoListModule.todos，当发生变化时将todos重新写入本地存储
    musicChanges: {
      deep: true,
      handler(value) {
        this.musics = value;
      },
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.unlogin {
  float: right;
}
.el-avatar {
  margin-right: 15px;
}
.el-link {
  margin-right: 20px;
}
.message {
  margin-right: 0px;
}
.logout {
  margin-left: 20px;
}
</style>
