<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script text="type/ecmascript-6">
import MusicList from 'components/music-list/music-list';
import {mapGetters} from 'vuex';
import {getSongList} from 'api/recommend';
import {ERR_OK} from 'api/config';
import {handleSongUrl} from 'api/song';
import {createSong} from 'common/js/song';

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
      return this.disc.dissname;
    },
    bgImage () {
      return this.disc.imgurl;
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getSongList();
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend');
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          handleSongUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeSongs (list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
        }
      })
      return ret;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active
  transition all 0.5s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
