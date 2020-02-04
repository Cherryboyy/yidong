<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell
        @click="toSearchResult(item)"
        icon="search"
        v-for="item in suggestList"
        :key="item"
      >{{ item }}</van-cell>
    </van-cell-group>
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <van-cell @click="toResult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{ item }}</a>
          <van-icon
            @click.stop="delHistory(index)"
            class="close_btn"
            slot="right-icon"
            name="cross"
          />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggestion } from "@/api/article";
const key = "hm-91-toutiao-history";
export default {
  name: "search",
  data() {
    return {
      q: "",
      historyList: [],
      suggestList: []
    };
  },
  watch: {
    q() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        if (!this.q) {
          this.suggestList = [];
          return;
        }
        let data = await suggestion({ q: this.q });
        this.suggestList = data.options;
      }, 300);
      // console.log("获取数据");
    }
  },
  methods: {
    clear() {
      this.historyList = [];
      localStorage.setItem(key, "[]");
    },
    // 删除对应的历史记录
    delHistory(index) {
      this.historyList.splice(index, 1); // 删除对应的历史记录
      localStorage.setItem(key, JSON.stringify(this.historyList)); // 重新写入缓存
    },
    // 跳到搜索结果页面
    toResult(text) {
      // 放入历史记录
      let obj = new Set(this.historyList); // 生成一个set变量  set对象自动去重
      obj.add(text);
      this.historyList = Array.from(obj); // 将set转回数组
      localStorage.setItem(key, JSON.stringify(this.historyList)); // 重新写入缓存
      this.$router.push({ path: "/search/result", query: { q: text } }); // 直接跳转到搜索结果界面
    },
    // 点击联想搜索关键词 去跳转 => 先把点击的关键词放入历史记录 表示我搜索过
    toSearchResult(text) {
      // 放入历史记录
      let obj = new Set(this.historyList); // 生成一个set变量  set对象自动去重
      obj.add(text);
      this.historyList = Array.from(obj); // 将set转回数组
      localStorage.setItem(key, JSON.stringify(this.historyList)); // 重新写入缓存
      this.$router.push({ path: "/search/result", query: { q: text } }); // 直接跳转到搜索结果界面
    }
  },
  created() {
    this.historyList = JSON.parse(localStorage.getItem(key) || "[]");
  }
};
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>

