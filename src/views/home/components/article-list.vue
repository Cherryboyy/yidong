<template>
  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <van-cell-group>
      <!-- 这里使用list组件 -->
      <van-list v-model="upLoading" :finished="finished" finished-text="没有了" @load="onLoad">
        <!-- 渲染数据 -->
        <van-cell v-for="article in articles" :key="article" :title="article"></van-cell>
      </van-list>
    </van-cell-group>
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
      articles: []
    };
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
    }
  }
};
</script>

<style lang="">
</style>