<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音乐</el-breadcrumb-item>
      <el-breadcrumb-item>搜索</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="searchForm" :rules="searchFormRules" ref="searchFormRef" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="歌曲名" prop="name" label-width="120px">
              <el-input v-model="pageInfo.word"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
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
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      songList: [],
      pageInfo: {
        word: "",
        pageNum: 1,
        pageSize: 15,
      },
      total: 0,
    };
  },
  methods: {
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.search();
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.search();
    },

    async search() {
      const { data: res } = await this.$http.get("/song/search", {
        params: this.pageInfo,
      });
      if (res.status !== 200) {
        return this.$message.error("搜索歌曲失败");
      }
      this.total = res.data.total;
      this.songList = res.data.records;
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

    addList(data) {
      this.$store.commit("addMusic", data);
    },
  },
};
</script>

<style lang="less" scoped>
</style>