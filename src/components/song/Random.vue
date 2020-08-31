<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音乐</el-breadcrumb-item>
      <el-breadcrumb-item>随便听听</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <span style="font-size: 20px">随机推荐</span>
        <el-link
          style="margin-left: 15px; font-size: 8px"
          type="info"
          @click="changeRandom()"
        >点击更换一批</el-link>
      </el-row>
      <el-divider></el-divider>
      <el-col
        :span="8"
        v-for="music in songList"
        :key="music.id"
        style="margin-top: 10px; margin-bottom: 10px"
      >
        <el-row>
          <el-image
            :src="'http://forestj.oss-cn-beijing.aliyuncs.com'+music.image"
            :key="'http://forestj.oss-cn-beijing.aliyuncs.com'+music.image"
            style="width: 250px; height: 250px"
            :fit="fit"
             @click="toSongPage(music.id)"
          ></el-image>
        </el-row>
        <el-row>
          <el-link type="primary" @click="toSongPage(music.id)">{{music.name}}</el-link>
        </el-row>
      </el-col>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      songList: [],
    };
  },
  methods: {
    play(data) {
      this.$store.commit("changeMusic", data);
    },

    toSongPage(id) {
      this.$router.push("/songInfo?id=" + id);
    },

    changeRandom() {
      this.getRandom();
    },

    async getRandom() {
      const { data: res } = await this.$http.get("/song/random", {
        params: {
          num: 6,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("获取随机推荐失败");
      }
      this.songList = res.data;
    },

    toSongPage(id) {
      this.$router.push("/songInfo?id=" + id);
    },
  },

  created() {
    this.getRandom();
  },
};
</script>

<style lang="less" scoped>
</style>