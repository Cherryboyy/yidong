<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="myList">
      <div
        :class="{ left: item.name === 'xz', right: item.name!='xz' }"
        class="chat-item"
        v-for="(item,index)  in list"
        :key="index"
      >
        <!-- 小智同学的图片 -->
        <!-- 需要根据item中的name值 决定是否显示 左侧的图片 或者右侧的图片 -->
        <van-image v-if="item.name === 'xz'" fit="cover" round :src="XZImg" />
        <div class="chat-pao">{{ item.msg }}</div>
        <!-- 右边再放置一个图片 -->
        <van-image v-if="item.name !== 'xz'" fit="cover" round :src="photo" />
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import XZImg from "@/assets/0.jpg";
import io from "socket.io-client"; // 引入socket.io的客户端代码
export default {
  data() {
    return {
      value: "",
      loading: false,
      XZImg,
      list: [] //存储聊天记录
    };
  },
  //我们退出小智之后要关闭连接
  beforeDestroy() {
    this.socket.close();
    console.log("销毁成功");
  },
  computed: {
    ...mapState(["photo", "user"])
  },
  methods: {
    send() {
      if (!this.value) return false;
      let obj = { name: "self", msg: this.value, timestamp: Date.now() };
      this.socket.emit("message", obj);
      this.list.push(obj);
      this.value = ""; // 清空消息
      this.scrollBottom();
    },
    scrollBottom() {
      this.$nextTick(() => {
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight;
      });
    }
  },
  created() {
    // console.log(this.user.token);
    this.socket = io("http://ttapi.research.itcast.cn", {
      query: {
        token: this.user.token
      }
    });
    this.socket.on("connect", () => {
      console.log("和服务器连接成功");
      this.list.push({ msg: "早点回学校吧", name: "xz" });
    });
    this.socket.on("message", data => {
      // console.log(data);

      this.list.push({ ...data, name: "xz" }); // name:xz相当于 给我们的消息记录一下 谁发了这个消息
      this.scrollBottom();
    });
  }
};
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
