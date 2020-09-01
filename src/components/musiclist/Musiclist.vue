<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>歌单</el-breadcrumb-item>
      <el-breadcrumb-item>我的歌单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <span style="font-size: 20px">我的歌单</span>
        <el-button
          type="primary"
          size="small"
          style="margin-left: 15px"
          @click="addDialogVisibleChange()"
        >新建歌单</el-button>
      </el-row>
      <el-divider></el-divider>
      <el-table :data="songList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="歌单名字" prop="name" width="300px">
          <template slot-scope="scope">
            <el-link type="primary" @click="toInfoPage(scope.row.id)">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="歌曲数量" prop="num"></el-table-column>
        <el-table-column label="创建时间" prop="createTime">
          <template slot-scope="scope">{{formatDate(scope.row.createtime)}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="playAll(scope.row.id)">播放全部</el-button>
            <el-button type="danger" size="mini" @click="deleteList(scope.row.id)">删除歌单</el-button>
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
    <!-- 创建歌单对话框 -->
    <el-dialog
      title="新建歌单"
      :visible.sync="addDialogVisible"
      @close="closeAddForm"
      :close-on-click-modal="false"
    >
      <el-form :model="addListForm" ref="addListFormRef" :rules="addListRule">
        <el-form-item label="歌单名" prop="name">
          <el-input v-model="addListForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddForm()">取 消</el-button>
        <el-button type="primary" @click="addListSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    var checkName = async (rule, value, cb) => {
      const { data: res } = await this.$http.get("/musiclist/name", {
        params: {
          name: value,
        },
      });
      if (res.status !== 200) {
        return cb(new Error("歌单名不能重复"));
      }
      cb();
    };
    return {
      songList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      addDialogVisible: false,
      addListForm: {
        name: "",
      },
      addListRule: {
        name: [
          { required: true, message: "歌单名不能为空", trigger: "blur" },
          {
            validator: checkName,
            message: "歌单名字不能重复",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getMusicList();
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

    async getMusicList() {
      const { data: res } = await this.$http.get("/musiclist/query", {
        params: this.pageInfo,
      });
      if (res.status !== 200) {
        return this.$message.error("获取歌单失败");
      }
      this.total = res.data.total;
      this.songList = res.data.records;
    },

    play(data) {
      this.$store.commit("changeMusic", data);
    },

    toInfoPage(id) {
      this.$router.push("/musiclistInfo?id=" + id);
    },

    formatDate(timestamp) {
      return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    },

    closeAddForm() {
      this.addDialogVisible = false;
      this.$refs.addListFormRef.resetFields();
    },

    addDialogVisibleChange() {
      this.addDialogVisible = true;
    },

    addListSubmit() {
      this.$refs.addListFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.get("/musiclist/create", {
          params: {
            name: this.addListForm.name,
          },
        });
        if (res.status !== 200) {
          return this.$message.error("创建歌单失败");
        }
        this.$message.success("创建歌单成功");
        this.closeAddForm();
        this.getMusicList();
      });
    },

    async deleteList(id) {
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
          id: id,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("删除歌单失败");
      } else {
        this.$message.warning("删除歌单成功");
        this.getMusicList();
      }
    },

    async playAll(id) {
      const { data: res } = await this.$http.get("/musiclist/getList", {
        params: {
          id: id,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("获取歌曲失败");
      }

      this.$store.commit("changeList", res.data);

    },
  },
};
</script>

<style lang="less" scoped>
</style>