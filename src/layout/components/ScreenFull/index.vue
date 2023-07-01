<template>
    <!-- 放置一个图标 -->
    <div>
      <!-- 放置一个svg的图标 -->
      <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
    </div>
  </template>
  
  <script>
  import ScreenFull from 'screenfull/dist/screenfull'
  export default {
    methods: {
      //   改变全屏
      changeScreen() {
        if (!ScreenFull.isEnabled) {
          this.$message.warning('此时全屏组件不可用')
          return
        }
        ScreenFull.toggle()
      }
    }
  }
  </script>
  
  <style>
  
  </style>