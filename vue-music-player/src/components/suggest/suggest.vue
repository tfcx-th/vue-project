<template>
  <scroll class="suggest"
          ref="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item"
          v-for="(item, index) in result" :key="index"
          @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import {search} from 'api/search';
import {ERR_OK} from 'api/config';
import {createSong} from 'common/js/song';
import {handleSongUrl} from 'api/song';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import Singer from 'common/js/singer';
import {mapMutations, mapActions} from 'vuex';
import NoResult from 'base/no-result/no-result';

const TYPE_SINGER = 'singer';
const perpage = 20;

export default {
  components: {
    Scroll,
    Loading,
    NoResult
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    }
  },
  methods: {
    search () {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._getResult(res.data).then(result => {
            this.result = result;
          })
          this._checkMore(res.data);
        }
      });
    },
    searchMore () {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._getResult(res.data).then(result => {
            this.result = this.result.concat(result);
          })
          this._checkMore(res.data);
        }
      });
    },
    getIconClass (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine';
      } else {
        return 'icon-music';
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name} - ${item.singer}`;
      }
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        let singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit('select', item);
    },
    listScroll () {
      this.$emit('listScroll');
    },
    _checkMore (data) {
      let song = data.song;
      if (!song.list.length || (song.curnum + song.curpage * 20) >= song.totalnum) {
        this.hasMore = false;
      }
    },
    _getResult (data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}});
      }
      return handleSongUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs);
        return ret;
      });
    },
    _normalizeSongs (list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) return;
      this.search(newQuery);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      align-items center
      padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
        [class^="icon-"]
          font-size 14px
          color $color-text-d
      .name
        flex 1
        font-size $font-size-medium
        color $color-text-d
        overflow hidden
        .text
          no-wrap()
  .no-result-wrapper
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
