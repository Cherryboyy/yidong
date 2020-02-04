<template>
  <div class="container">
    <van-tabs v-model="activeIndex" swipeable>
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <article-list @showMoreAction="openMoreAction" :channel_id="channel.id"></article-list>
      </van-tab>
    </van-tabs>
    <span class="bar_btn">
      <van-icon name="wap-nav" />
    </span>
    <!-- 放置弹层 -->
    <van-popup :style="{ width: '80%' }" v-model="showMoreAction">
      <more-action></more-action>
    </van-popup>
  </div>
</template>

<script>
import ArticleList from "./components/article-list"; //引入封装的加载组件
import MoreAction from "./components/more-action";
import { getMyChannels } from "@/api/channels";
export default {
  data() {
    return {
      activeIndex: 0,
      // 频道获取到的数据
      channels: [],
      showMoreAction: false,
      articleId: null // 定义一个值接收
    };
  },
  components: {
    ArticleList,
    MoreAction
  },
  methods: {
    async getMyChannels() {
      let data = await getMyChannels();
      // console.log(data);
      this.channels = data.channels;
    },
    openMoreAction(artId) {
      this.showMoreAction = true;
      this.articleId = artId;
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
</style>
