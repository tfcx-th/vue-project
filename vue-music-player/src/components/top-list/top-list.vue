<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script text="text/ecmascript-6">
import MusicList from 'components/music-list/music-list';
import {mapGetters} from 'vuex';
import {getMusicList} from 'api/rank';
import {ERR_OK} from 'api/config';
import {handleSongUrl} from 'api/song';
import {createSong} from 'common/js/song';

export default {
  components: {
    MusicList
  },
  computed: {
    title () {
      return this.topList.topTitle;
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image;
      } else {
        return this.topList.picUrl;
      }
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getMusicList();
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank');
        return;
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          handleSongUrl(this._normalizeSong(res.songlist)).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeSong (list) {
      let ret = [];
      list.forEach(item => {
        let musicData = item.data;
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      });
      return ret;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active
  transition all 0.5s ease
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
