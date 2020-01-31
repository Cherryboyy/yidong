<template>
  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad" finished-text="没有了">
        <van-cell v-for="article in articles" :key="article">
          <div class="article_item">
            <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
            <!-- 三图模式 -->
            <div class="img_box">
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <!-- 单图模式 -->
            <div class="img_box">
              <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <div class="info_box">
              <span>你像一阵风</span>
              <span>8评论</span>
              <span>10分钟前</span>
              <span class="close">
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
  methods: {
    // 上拉加载方法
    onLoad() {
      //   console.log("加载数据");
      //加载的方法
      setTimeout(() => {
        if (this.articles.length === 50) {
          //停止追加
          this.finished = true;
        } else {
          let arr = Array.from(
            Array(10),
            (value, index) => index + this.articles.length + 1
          );
          this.articles.push(...arr); //生成1条数据追加到末尾
          this.upLoading = false; //关闭状态
        }
      }, 1000);
    },
    onRefresh() {
      // 触发下拉刷新
      console.log("下拉刷新");
      setTimeout(() => {
        let arr = Array.from(Array(10), (value, index) => "追加" + (index + 1));
        this.articles.unshift(...arr); // 将数据添加到队首
        this.downLoading = false; // 关掉下拉状态
        this.refreshSuccessText = `更新了${arr.length}条数据`;
      }, 1000);
    }
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