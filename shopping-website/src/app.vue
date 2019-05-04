<template>
  <div>hello {{ name }}</div>
</template>
<script>
export default {
  data () {
    return {
      name: 'Vue.js'
    }
  }
}
</script>
<style scoped>
div {
  background: red;
}
</style>
