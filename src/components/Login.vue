<script>
export default {
  name:'login',
  methods:{
    goHome(){
      this.$router.push('/welcome')
    }
  },
  mounted(){

  }
}
</script>
<template>
  <div>
    <h1>登陆页面</h1>
    <button @click="goHome">回首页</button>
  </div>
</template>


<style scoped>

</style>
