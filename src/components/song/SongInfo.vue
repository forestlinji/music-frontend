<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音乐</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-image
            :src="'http://forestj.oss-cn-beijing.aliyuncs.com'+music.image"
            :key="'http://forestj.oss-cn-beijing.aliyuncs.com'+music.image"
            style="width: 300px; height: 300px"
            :fit="fit"
          ></el-image>
        </el-col>
        <el-col :span="10">
          <el-row style="margin-top: 20px">
            <el-tag :size="medium" style="margin-right: 15px; font-size: 14px">歌曲</el-tag>
            <span style="font-size: 23px">{{music.name}}</span>
          </el-row>
          <el-row style="margin-top: 10px">
            <!-- <el-tag :size="mini" style="margin-right: 20px">歌手</el-tag>
            {{music.singer}}-->
            <span style="color: #999; margin-left: 10px; font-size: 12px">歌手:</span>
            <el-link type="primary" style=" margin-left: 5px; margin-bottom: 3px">{{music.singer}}</el-link>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-button type="success" @click="play()" size="small">播放</el-button>
            <el-button type="success" @click="addList()" size="small">加入播放列表</el-button>
            <el-button type="primary" @click="ListVisible()" :disabled="!isLogin" size="small">加入歌单</el-button>
            <el-button
              type="warning"
              @click="addCollect()"
              :disabled="!isLogin"
              v-if="!isCollect"
              size="small"
            >收藏</el-button>
            <el-button
              type="warning"
              @click="deleteCollect()"
              :disabled="!isLogin"
              v-if="isCollect"
              size="small"
            >取消收藏</el-button>
            <el-button type="danger" @click="commentVisible()" :disabled="!isLogin" size="small">评论</el-button>
          </el-row>
          <!-- <el-row style="margin-top: 20px">
          <el-button class="login-btn-submit" type="primary" @click="signupFormSubmit()">收藏</el-button>
          <el-button class="login-btn-submit" type="primary" @click="signupFormSubmit()">评论</el-button>
          </el-row>-->
        </el-col>
      </el-row>
      <el-row style="margin-top: 50px">
        <span style="font-size: 20px;">评论</span>
        <el-switch
          v-model="queryMy"
          active-text="只看我的"
          inactive-text="查看全部"
          style="margin-left: 50px"
          @change="queryChange()"
          v-show="isLogin"
        ></el-switch>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-card v-for="comment in commentList" :key="comment.id">
          <el-row>
            <el-link type="primary" style="font-size: 16px">{{comment.reviewerName}}</el-link>:
            <span style="font-size: 13px">{{comment.content}}</span>
            <el-row style="color: #999; font-size: 12px; margin-top: 15px">
              {{formatDate(comment.createTime)}}
              <el-link
                v-if="queryMy"
                type="danger"
                style="font-size: 10px; margin-left: 10px;margin-bottom: 3px"
                @click="deleteComment(comment.id)"
              >删除</el-link>
            </el-row>
          </el-row>
        </el-card>
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog
      title="发表评论"
      :visible.sync="addCommentDialogVisible"
      @close="closeAddForm"
      :close-on-click-modal="false"
    >
      <el-form :model="commentForm" ref="addCommentFormRef" :rules="addCommentRule">
        <el-form-item label="评论" prop="comment">
          <el-input type="textarea" v-model="commentForm.comment"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCommentForm()">取 消</el-button>
        <el-button type="primary" @click="addCommentSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="发表评论"
      :visible.sync="addListDialogVisible"
      @close="closeListForm"
      :close-on-click-modal="false"
    >
      <el-form :model="commentForm" ref="addListFormRef">
        <el-form-item label="歌单名字">
          <el-select v-model="addListForm.id" placeholder="请选择要加入的歌单">
            <el-option
              v-for="item in musicListsName"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeListForm()">取 消</el-button>
        <el-button type="primary" @click="addListSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      music: {},
      pageInfo: {
        id: -1,
        pageNum: 1,
        pageSize: 5,
      },
      total: 0,
      commentList: [],
      commentForm: {
        comment: "",
      },
      addCommentDialogVisible: false,
      addCommentRule: {
        comment: [{ required: true, message: "评论不能为空", trigger: "blur" }],
      },
      queryMy: false,
      isLogin: false,
      isCollect: false,
      addListDialogVisible: false,
      musicListsName: [],
      addListForm: {
        id: "",
      },
    };
  },

  async created() {
    const user = window.sessionStorage.getItem("user");
    if (user) this.isLogin = true;
    const { data: res } = await this.$http.get("/song/get", {
      params: {
        id: this.$route.query.id,
      },
    });
    if (res.status !== 200) {
      return this.$message.error("获取歌曲详情失败");
    } else {
      this.music = res.data;
      this.pageInfo.id = this.music.id;
    }
    if (this.isLogin) {
      const { data: res } = await this.$http.get("/song/exists", {
        params: {
          id: this.music.id,
        },
      });
      if (res.status === 204) {
        this.isCollect = true;
      }
    }

    this.getComment();
    // const { data: resC } = await this.$http.get("/song/get", {
    //   params: this.pageInfo,
    // });
    // if (resC.status !== 200) {
    //   return this.$message.error("获取评论失败");
    // }
    // this.commentList = resC.data.records;
    // this.total = resC.data.total;
  },

  methods: {
    play() {
      this.$store.commit("changeMusic", this.music);
    },

    async getComment() {
      const { data: res } = await this.$http.get(
        "/comment/query" + (this.queryMy ? "My" : ""),
        {
          params: this.pageInfo,
        }
      );
      if (res.status !== 200) {
        return this.$message.error("获取评论失败");
      }
      this.commentList = res.data.records;
      this.total = res.data.total;
    },

    commentVisible() {
      this.addCommentDialogVisible = true;
    },

    closeCommentForm() {
      this.addCommentDialogVisible = false;
      this.$refs.addCommentFormRef.resetFields();
    },

    addCommentSubmit() {
      this.$refs.addCommentFormRef.validate(async (valid) => {
        if (!valid) return;
        const data = await this.$http.post("/comment/add", {
          songId: this.music.id,
          comment: this.commentForm.comment,
        });
        // console.log(res)
        if (data.data.status !== 200) {
          return this.$message.error("发表评论失败");
        } else {
          this.$message.success("发表评论成功");
          this.closeCommentForm();
          this.getComment();
          return;
        }
        // console.log(data)
      });
    },

    formatDate(timestamp) {
      return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
    },

    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getComment();
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getComment();
    },

    queryChange(value) {
      // alert(this.queryMy)
      this.getComment();
    },

    async deleteComment(id) {
      const confirmResult = await this.$confirm(
        "此操作将删除该评论, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除！");
      }
      const { data: res } = await this.$http.get("/comment/delete", {
        params: {
          id: id,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("删除评论失败");
      } else {
        this.$message.success("删除评论成功");
        this.getComment();
      }
    },

    async addCollect() {
      const { data: res } = await this.$http.get("/song/collect", {
        params: {
          id: this.music.id,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("添加收藏失败");
      } else {
        this.isCollect = true;
        this.$message.success("添加收藏成功");
      }
    },

    async deleteCollect() {
      const { data: res } = await this.$http.post("/song/deleteCollect", {
        deleteId: [this.music.id],
      });
      if (res.status !== 200) {
        return this.$message.error("删除收藏失败");
      } else {
        this.isCollect = false;
        this.$message.warning("删除收藏成功");
      }
    },

    async ListVisible() {
      const { data: res } = await this.$http.get("/musiclist/query", {
        params: {
          pageNum: 1,
          pageSize: 40,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("获取歌单失败");
      }
      this.musicListsName = res.data.records;
      this.addListDialogVisible = true;
    },

    closeListForm() {
      this.addListDialogVisible = false;
      this.$refs.addListFormRef.resetFields();
    },

    async addListSubmit() {
      if (this.addListForm.id <= 0) {
        return this.$message.error("请选择歌单");
      }
      const { data: res } = await this.$http.post("/musiclist/add", {
        singId: this.music.id,
        musicListId: this.addListForm.id,
      });
      if (res.status !== 200) {
        this.$message.error("添加歌单失败");
        this.closeListForm();
      } else {
        this.$message.warning("添加歌单成功");
        this.closeListForm();
      }
    },

    addList() {
      this.$store.commit("addMusic", this.music);
    },
  },
};
</script>

<style lang="less" scoped>
</style>