<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex';
import {getSingerDetail} from 'api/singer';
import {ERR_OK} from 'api/config';
import {createSong} from 'common/js/song';
import {handleSongUrl} from 'api/song';
import MusicList from 'components/music-list/music-list';

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name;
    },
    bgImage () {
      return this.singer.avatar;
    },
    ...mapGetters(['singer'])
  },
  created () {
    this._getDetail();
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer');
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          handleSongUrl(this._normalizeSongs(res.data.list)).then(songs => {
            this.songs = songs;
          });
        }
      })
    },
    _normalizeSongs (list) {
      let ret = [];
      list.forEach((item) => {
        ret.push(createSong(item.musicData));
      });
      return ret;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
