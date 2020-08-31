<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>收藏</el-breadcrumb-item>
      <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <span style="font-size: 20px">我的收藏</span>
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
            <el-button type="danger" size="mini" @click="deleteCollect(scope.row.id)">取消收藏</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      songList: [],
    };
  },
  created() {
    this.getCollect();
  },
  methods: {
    async getCollect() {
      const { data: res } = await this.$http.get("/user/collects");
      if (res.status !== 200) {
        return this.$message.error("获取收藏失败失败");
      }
      this.songList = res.data;
    },

    play(data) {
      this.$store.commit("changeMusic", data);
    },

    toSongPage(id) {
      this.$router.push("/songInfo?id=" + id);
    },

    gettime(longs) {
      let minute = parseInt(longs / 60);
      var second = longs % 60;
      return minute + ":" + second;
    },

    async deleteCollect(id) {
      const confirmResult = await this.$confirm("是否将该歌曲移除收藏", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.post("/song/deleteCollect", {
        deleteId: [id],
      });
      if (res.status !== 200) {
        return this.$message.error("删除收藏失败");
      } else {
        this.$message.warning("删除收藏成功");
        this.getCollect();
      }
    },

    addList(data){
      this.$store.commit("addMusic", data);
    }
  },
};
</script>

<style lang="less" scoped>
</style>