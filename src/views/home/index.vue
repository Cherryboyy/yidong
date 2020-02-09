<template>
  <div class="container">
    <van-tabs v-model="activeIndex" swipeable @change="changeTab">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <article-list @showMoreAction="openMoreAction" :channel_id="channel.id"></article-list>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" @click="showChannelEdit=true">
      <van-icon name="wap-nav" />
    </span>
    <!-- 放置弹层 -->
    <van-popup :style="{ width: '80%' }" v-model="showMoreAction">
      <more-action
        @dislike="dislikeOrReport($event,'dislike')"
        @report="dislikeOrReport($event,'report')"
      ></more-action>
    </van-popup>
    <van-action-sheet :round="false" title="编辑频道" v-model="showChannelEdit">
      <channel-edit :activeIndex="activeIndex" @selectChannel="selectChannel" :channels="channels"></channel-edit>
    </van-action-sheet>
    <channel-edit v-model="showChannelEdit"></channel-edit>
  </div>
</template>

<script>
import ArticleList from "./components/article-list"; //引入封装的加载组件
import MoreAction from "./components/more-action";
import { getMyChannels } from "@/api/channels";
import { disLikeArticle } from "@/api/article";
import eventBus from "../../utils/eventBus";
import channelEdit from "./components/channel-edit";
export default {
  data() {
    return {
      activeIndex: 0,
      // 频道获取到的数据
      channels: [],
      showMoreAction: false,
      articleId: null, // 定义一个值接收
      showChannelEdit: false
    };
  },
  components: {
    ArticleList,
    MoreAction,
    channelEdit
  },
  methods: {
    changeTab() {
      // 通知所有的article-list实例 告诉他们 我切换页签了,把切换的页签传过去
      // article-list组件需要 拿到传过去的的页签 看看是否是自己所在的页签
      // 如果是自己所在的页签 就需要 判断一下 自己的组件是否有滚动 如果有滚动数据 就滚动对应的位置
      //  触发一个公共事件 事件名叫 切换页签 携带参数
      eventBus.$emit("changeTab", this.channels[this.activeIndex].id);
    },
    // 切换到对应的频道 关闭弹层
    selectChannel(id) {
      let index = this.channels.findIndex(item => item.id === id); // 获取切换频道的索引
      this.activeIndex = index; // 将tabs激活标签切换到对应的标签下
      this.showChannelEdit = false; // 关闭弹层
    },
    async getMyChannels() {
      let data = await getMyChannels();
      // console.log(data);
      this.channels = data.channels;
    },
    openMoreAction(artId) {
      this.showMoreAction = true;
      this.articleId = artId;
    },
    // 不喜欢文章
    // async dislike() {
    // 不喜欢文章或者举报文章
    async dislikeOrReport(params, operatetype) {
      try {
        if (this.articleId) {
          operatetype === "dislike"
            ? await disLikeArticle({
                target: this.articleId
              })
            : await reportArticle({
                target: this.articleId,
                type: params
              });
          this.$gnotify({ type: "success", message: "操作成功" });
          eventBus.$emit(
            "delArticle",
            this.articleId,
            this.channels[this.activeIndex].id
          );
          this.showMoreAction = false;
        }
      } catch (error) {
        this.$gnotify({ type: "danger", message: "操作失败" });
      }
    }
  },
  created() {
    this.getMyChannels();
  }
};
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
</style>
