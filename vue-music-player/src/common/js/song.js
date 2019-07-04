export class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

// http://117.34.59.18/amobile.music.tc.qq.com/C400003iHc0e2UIgMC.m4a?guid=362356740&vkey=F4262B250395ABCB04D8673A8190C17207247D6048439B2802197A17357A5B468FC6B9A3C42CB737D520AE8A3E175DB4C1D09A04A7450A28&uin=0&fromtag=66

function filterSinger(singer) {
  let ret = [];
  if (!singer) return '';
  singer.forEach(s => {
    ret.push(s.name);
  });
  return ret.join('/');
}
