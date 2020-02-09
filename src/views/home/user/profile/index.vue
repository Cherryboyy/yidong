<template>
  <div class="container">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      @click-right="saveUserInfo()"
      title="编辑资料"
      right-text="保存"
    ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          @click="showPhoto=true"
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link @click="showName=true" title="名称" :value="user.name" />
      <van-cell is-link @click="showGender=true" title="性别" :value="user.gender==0? '男': '女'" />
      <van-cell is-link @click="showBirthDay=true" title="生日" :value="user.birthday" />
    </van-cell-group>
    <!-- 头像弹出层 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <van-cell is-link @click="openChangeFile" title="本地相册选择图片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 弹昵称 -->
    <van-popup :close-on-click-overlay="false" v-model="showName" style="width:80%">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field :error-message="nameMsg" v-model.trim="user.name" type="textarea" rows="4"></van-field>
      <!-- 关闭按钮组件 -->
      <van-button type="info" size="large" block @click="btnName">确定</van-button>
    </van-popup>
    <!-- 性别弹出 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹出 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthDay=false"
        @confirm="confirmDate"
      />
    </van-popup>
    <!-- 文件选择控件 -->
    <input ref="myFile" @change="upload()" type="file" style="display:none" />
  </div>
</template>

<script>
import { getUserProfile, updateImg, saveUserInfo } from "@/api/user";
import dayjs from "dayjs";
import { mapMutations } from "vuex";
export default {
  name: "",
  data() {
    return {
      showPhoto: false,
      showName: false,
      showGender: false,
      showBirthDay: false,
      user: {
        name: "猪",
        gender: 0,
        birthday: ""
      },
      actions: [{ name: "男" }, { name: "女" }], // 性别数据
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      currentDate: new Date(), // 当前时间
      nameMsg: ""
    };
  },
  methods: {
    ...mapMutations(["updatePhoto"]),
    btnName() {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = "您的用户昵称不符合1-7的长度要求";
        return false;
      }
      this.nameMsg = "";
      this.showName = false;
    },
    selectItem(item) {
      // console.log(item);
      this.user.gender = item.name === "男" ? 0 : 1;
      this.showGender = false;
    },
    confirmDate(date) {
      this.user.birthday = dayjs(date).format("YYYY-MM-DD");
      this.showBirthDay = false; // 关闭弹层
    },
    showDate() {
      // 要将字符串  2019-08-08 转化成日期类型
      this.currentDate = new Date(this.user.birthday); // 将当前用户的生日 赋值给绑定当前时间的数据
      this.showBirthDay = true; // 显示生日弹层
    },
    // 获取用户资料的方法
    async getUserProfile() {
      let data = await getUserProfile();
      // console.log(data);
      this.updatePhoto({ photo: data.photo });
      // 将数据赋值给user
      this.user = data;
      // this.photo = data.photo;
    },
    openChangeFile() {
      this.$refs.myFile.click(); // 触发文件上传组件的点击方法
    },
    async upload() {
      let data = new FormData();
      data.append("photo", this.$refs.myFile.files[0]); // 往formData中添加参数
      let result = await updateImg(data);
      // 应该 把地址 同步设置给 当前页面的数据
      this.user.photo = result.photo; // 将上传成功的头像设置给当前头像
      this.showPhoto = false; // 关闭弹层
      this.updatePhoto({
        photo: result.photo
      }); // 调用mutations方法 将数据设置给公共状态
    },
    // 保存方法  调用保存接口  这里是不需要传photo数据的
    // 1 我们通过别的方法 更新了头像
    // 2 photo base64字符串
    async saveUserInfo() {
      try {
        await saveUserInfo({ ...this.user, photo: null });
        this.$gnotify({ type: "success", message: "保存成功" });
      } catch (error) {
        this.$gnotify({ type: "danger", message: "保存失败" });
      }
    }
  },
  created() {
    this.getUserProfile(); // 调用获取用户资料的方法
  }
};
</script>

<style scoped lang="less">
</style>
