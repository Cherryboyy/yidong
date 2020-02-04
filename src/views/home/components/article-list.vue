<template>
  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad" finished-text="没有了">
        <van-cell v-for="article in articles" :key="article.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ article.title }}</h3>
            <!-- 三图模式 -->
            <div class="img_box" v-if="article.cover.type === 3">
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
            </div>
            <!-- 单图模式 -->
            <div class="img_box" v-else>
              <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ article.aut_name }}</span>
              <span>{{ article.comm_count }}评论</span>
              <span>{{ article.pubdate | relTime}}</span>
              <!-- 点击弹出 -->
              <span
                class="close"
                v-if="user.token"
                @click="$emit('showMoreAction',article.art_id.toString())"
              >
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticles } from "@/api/article";
import { mapState } from "vuex";
export default {
  name: "article-list",
  data() {
    return {
      //是否开启上拉加载
      upLoading: false,
      //是否已经完成全部的数据加载
      finished: false,
      //文章数据
      articles: [],
      refreshSuccessText: "更新成功", //  文本
      downLoading: false, // 是否开启下拉刷新
      //定义一个给时间戳，告诉服务器要求我要什么时候的东西
      timestamp: null
    };
  },
  props: {
    channel_id: {
      type: Number, //指定传入的类型
      required: true, //
      default: null //给props一个默认值
    }
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    // 上拉加载方法
    async onLoad() {
      //   //   console.log("加载数据");
      //   //加载的方法
      //   setTimeout(() => {
      //     if (this.articles.length === 50) {
      //       //停止追加
      //       this.finished = true;
      //     } else {
      //       let arr = Array.from(
      //         Array(10),
      //         (value, index) => index + this.articles.length + 1
      //       );
      //       this.articles.push(...arr); //生成1条数据追加到末尾
      //       this.upLoading = false; //关闭状态
      //     }
      //   }, 1000);
      let data = await getArticles({
        channel_id: this.channel_id,
        timestamp: this.timestamp || Date.now() //如果不为空则使用当前时间
      });
      console.log(data);

      //把数据追加到末尾
      this.articles.push(...data.results);
      //关闭加载状态
      this.upLoading = false;
      if (data.pre_timestamp) {
        //如果又时间戳
        this.timestamp = data.pre_timestamp;
      } else {
        this.finished = true;
      }
    },
    async onRefresh() {
      // 触发下拉刷新
      console.log("下拉刷新");
      // 下拉刷新拉取最新数据
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now()
      });
      // 关掉下拉状态
      this.downLoading = false;
      //有可能没有推荐的数据
      if (data.results.length) {
        //如果大于0 表示有数据
        this.articles = data.results; //将数据覆盖
        this.finished = false;
        // 注意我们依然获取时间撮
        this.timestamp = data.pre_timestamp;
        this.refreshSuccessText = `更新了${data.results.length}条数据`;
      } else {
        //如果没有数据 什么都不要变
        this.refreshSuccessText = "已是最新数据";
      }
    }
    //   created() {
    //     this.getArticles();
    //   }
  }
};
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>