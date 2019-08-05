<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲"
                    @query="search"></search-box>
      </div>
      <div class="shortcut"></div>
      <div class="search-result"></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box';

export default {
  components: {
    SearchBox
  },
  data () {
    return {
      showFlag: false,
      query: ''
    }
  },
  methods: {
    show () {
      this.showFlag = true;
    },
    hide () {
      this.showFlag = false;
    },
    search (query) {
      this.query = query;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.add-song
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 200
  background $color-background
  &.slide-enter-active, &.slide-leave-active
    transition all 0.4s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .header
    position relative
    height 44px
    text-align center
    .title
      line-height 44px
      font-size $font-size-large
      color $color-text
    .close
      position absolute
      top 0
      right 8px
      .icon-close
        display block
        padding 12px
        font-size 20px
        color $color-theme
  .search-box-wrapper
    margin 20px
  // .shortcut
  .search-result
    position fixed
    top 124px
    bottom 0
    width 100%
</style>