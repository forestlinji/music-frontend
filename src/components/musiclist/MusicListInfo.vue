<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>歌单</el-breadcrumb-item>
      <el-breadcrumb-item>歌单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row style="margin-top: 20px">
        <el-tag :size="medium" style="margin-right: 15px; font-size: 14px">歌单</el-tag>
        <span style="font-size: 25px">{{musiclist.name}}</span>
      </el-row>
      <el-row style="margin-top: 14px">
        <el-link type="primary" style="margin-right: 10px">{{musiclist.owner}}</el-link>
        <span style="color: #999;font-size: 13px;">{{formatDate(musiclist.createTime)}}创建</span>
        <el-link
          type="danger"
          style="font-size: 15px;margin-left: 50px; margin-bottom: 3px"
          @click="deleteList()"
          v-if="isMy"
        >删除歌单</el-link>
      </el-row>
      <el-row style="margin-top: 15px;">
        <span style="font-size: 14px;">歌单状态</span>
        <el-switch
          v-model="isPublic"
          active-text="公开"
          inactive-text="私密"
          style="margin-left: 30px"
          @change="changeState()"
          :disabled="!isMy"
        ></el-switch>
      </el-row>
      <el-row style="margin-top: 35px; font-size: 20px;">
        <span>歌曲列表</span>
        <span style="margin: 9px 0 0 20px;color: #666;font-size: 13px;">{{musiclist.num}}首</span>
        <el-button type="primary" style="margin-left: 30px" size="small" @click="playAll">播放全部</el-button>
      </el-row>
      <el-divider></el-divider>
      <el-table :data="songList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="歌曲名字" prop="name" width="300px">
          <template slot-scope="scope">
            <el-link type="primary" @click="toSongPage(scope.row.id)">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="歌手" prop="singer"></el-table-column>
        <el-table-column label="长度" prop="longs">
          <template slot-scope="scope">{{gettime(scope.row.longs)}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="play(scope.row)">播放</el-button>
            <el-button type="success" size="mini" @click="addList(scope.row)">加入播放列表</el-button>
            <el-button type="warning" size="mini" @click="deleteMusic(scope.row.id)" v-if="isMy">移出歌单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      musiclist: {},
      songList: [],
      isMy: false,
      isPublic: false,
    };
  },

  async created() {
    const { data: res } = await this.$http.get("/musiclist/get", {
      params: {
        id: this.$route.query.id,
      },
    });
    if (res.status !== 200) {
      return this.$message.error("获取歌单详情失败");
    }
    this.musiclist = res.data;
    this.getList();
    this.isPublic = this.musiclist.open;
    const user = JSON.parse(window.sessionStorage.getItem("user"));
    if(user && this.musiclist.ownerId === user.userId){
      this.isMy = true;
    }
  },

  methods: {
    async getList() {
      const { data: res } = await this.$http.get("/musiclist/getList", {
        params: {
          id: this.musiclist.id,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("获取歌曲失败");
      }
      this.songList = res.data;
    },

    formatDate(timestamp) {
      return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    },

    gettime(longs) {
      let minute = parseInt(longs / 60);
      var second = longs % 60;
      return minute + ":" + second;
    },

    async deleteList() {
      const confirmResult = await this.$confirm("是否删除该歌单", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.get("/musiclist/delete", {
        params: {
          id: this.musiclist.id,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("删除歌单失败");
      } else {
        this.$message.warning("删除歌单成功");
        this.$router.push("/musiclist");
      }
    },

    async deleteMusic(musicId) {
      const confirmResult = await this.$confirm("是否删除该歌曲", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.post("/musiclist/deleteSong", {
        id: this.musiclist.id,
        deleteId: [musicId],
      });
      if (res.status !== 200) {
        return this.$message.error("移除歌曲失败");
      } else {
        this.$message.warning("移除歌曲成功");
        this.getList();
      }
    },
    addList(data) {
      this.$store.commit("addMusic", data);
    },

    playAll() {
      this.$store.commit("changeList", this.songList);
    },

    toSongPage(id) {
      this.$router.push("/songInfo?id=" + id);
    },

    async changeState(value) {
      const { data: res } = await this.$http.get("/musiclist/changeState", {
        params: {
          id: this.musiclist.id,
          open: this.isPublic
        },
      });
      if (res.status !== 200) {
        return this.$message.error("更改歌单状态失败");
      }
      else{
        return this.$message.success("更改歌单状态成功");
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>