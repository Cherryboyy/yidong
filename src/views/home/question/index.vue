<template>
  <div>
  <div class="tops"></div>
  <van-skeleton title :row="3"/>
  <div class="tops"></div>
  <van-skeleton title :row="3"/>
  <div class="tops"></div>
  <van-skeleton title :row="3"/>
  </div>
</template>

<script>
  export default {
    name: ''
  }
</script>

<style scoped>
  .tops {
    margin-top: 10px;
  }
</style>
