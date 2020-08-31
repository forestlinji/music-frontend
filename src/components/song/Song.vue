<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音乐管理</el-breadcrumb-item>
      <el-breadcrumb-item>音乐管理</el-breadcrumb-item>
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
          <el-col :span="2">
            <el-button type="primary" @click="getAll">显示全部</el-button>
          </el-col>
          <el-col :span="2" style="margin-left: 30px">
            <el-button type="primary" @click="addDialogVisibleChange">添加</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="songList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="歌曲名字" prop="name" width="200px">
          <template slot-scope="scope">
            <el-link type="primary" @click="toSongPage(scope.row.id)">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="歌手" prop="singer"></el-table-column>
        <el-table-column label="长度" prop="longs"></el-table-column>
        <el-table-column label="歌曲链接" prop="link"></el-table-column>
        <el-table-column label="封面图" prop="image"></el-table-column>
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="play(scope.row)">播放</el-button>
            <el-button type="success" size="mini" @click="addList(scope.row)">加入播放列表</el-button>

            <el-button type="danger" size="mini" @click="deletes(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加歌曲对话框 -->
    <el-dialog
      title="添加歌曲"
      :visible.sync="addDialogVisible"
      @close="closeAddForm"
      :close-on-click-modal="false"
    >
      <el-form :model="addSongForm" ref="addSongFormRef" :rules="addSongRule">
        <!-- <el-form-item label="问题描述" prop="question">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="问题描述"
            v-model="addQuestionForm.question"
            :autosize="inputSize"
          ></el-input>
        </el-form-item>-->
        <el-form-item label="歌曲名" prop="name">
          <el-input v-model="addSongForm.name"></el-input>
        </el-form-item>
        <el-form-item label="歌手" prop="singer">
          <el-input v-model="addSongForm.singer"></el-input>
        </el-form-item>
        <el-form-item label="上传歌曲" prop="music">
          <el-upload
            ref="upload"
            name="music"
            action
            :auto-upload="false"
            :limit="1"
            accept=".mp3"
            :http-request="musicRequest"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">&nbsp;&nbsp;&nbsp;只能上传mp3文件</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传封面图" prop="image">
          <el-upload
            ref="upload2"
            name="image"
            action
            :auto-upload="false"
            :limit="1"
            accept=".jpg"
            :http-request="imageRequest"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">&nbsp;&nbsp;&nbsp;只能上传jpg文件</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddForm()">取 消</el-button>
        <el-button type="primary" @click="addSongSubmit()">确 定</el-button>
      </div>
    </el-dialog>
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
      addDialogVisible: false,
      addSongForm: {
        name: "",
        singer: "",
      },
      addSongRule: {
        name: [{ required: true, message: "歌曲名不能为空", trigger: "blur" }],
        singer: [{ required: true, message: "歌手不能为空", trigger: "blur" }],
      },
      music: {},
      image: {},
    };
  },
  methods: {
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      if (this.pageInfo.word !== "") {
        this.search();
      } else {
        this.getAll();
      }
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      if (this.pageInfo.word != "") {
        this.search();
      } else {
        this.getAll();
      }
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

    async getAll() {
      this.pageInfo.word = "";
      const { data: res } = await this.$http.get("/song/search", {
        params: this.pageInfo,
      });
      if (res.status !== 200) {
        return this.$message.error("搜索歌曲失败");
      }
      this.total = res.data.total;
      this.songList = res.data.records;
    },

    closeAddForm() {
      this.addDialogVisible = false;
      this.$refs.addSongFormRef.resetFields();
      this.music = {};
      this.image = {};
    },

    addDialogVisibleChange() {
      this.addDialogVisible = true;
    },

    async deletes(id) {
      const confirmResult = await this.$confirm("是否删除该歌曲", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.get("/song/delete?id=" + id);
      if (res.status !== 200) {
        return this.$message.error("删除歌曲失败");
      }
      this.getAll();
    },

    musicRequest(param) {
      this.music = param.file;
    },

    imageRequest(param) {
      this.image = param.file;
    },

    async addSongSubmit() {
      console.log("111");
      var upData = new FormData();
      this.$refs.upload.submit();
      this.$refs.upload2.submit();
      upData.append("music", this.music, this.music.name);
      upData.append("image", this.image, this.image.name);
      upData.append("name", this.addSongForm.name);
      upData.append("singer", this.addSongForm.singer);
      console.log(upData);
      console.log("test");
      //通过POST方式发送FormData格式的参数 的写法
      // let data = await this.$http({
      //   //这里的 this.$http 就是axios 因为 我在vue原型上，挂载axios的时候，把axios改名为$http 了。
      //   url: "/song/add", //请求路径（接口）
      //   method: "POST", //请求方式
      //   // headers: { 'content-type': 'application/x-www-form-urlencoded' }, // 请求头，发送FormData格式的数据，必须是 这种请求头。
      //   // data: qs.stringify({
      //   //   name: this.addSongForm.name,
      //   //   singer: this.addSongForm.singer,
      //   //   music: this.music,
      //   //   image: this.image
      //   //   }),  //发送请求要传的FormData参数。必须用 qs.stringify（）序列化一下。
      //   data: upData,
      // });
      let data = await this.$http.post("/song/add", upData, {
        headers: {
          "Content-Type": "multipart/form-data", //设置post文件的请求头
        },
      });
      if (data.status !== 200) {
        this.$message.error("上传歌曲失败");
      } else {
        this.$message.success("上传歌曲成功");
      }
      this.closeAddForm();
    },

    play(data) {
      this.$store.commit("changeMusic", data);
    },

    toSongPage(id) {
      this.$router.push("/songInfo?id=" + id);
    },
    addList(data) {
      this.$store.commit("addMusic", data);
    },
  },
};
</script>

<style lang="less" scoped>
</style>