<template>
  <div class="daily">
    <div class="daily-menu">
      <div class="daily-menu-item"
          :class="{ on: type === 'recommend' }"
          @click="handleToRecommend">每日推荐</div>
    </div>
    <div class="daily-list" ref="list">
      <template v-if="type === 'recommend'">
        <div v-for="(list, index) in recommendList" :key="index">
          <div class="daily-date">{{ formatDay(list.date) }}</div>
          <Item v-for="story in list.stories"
               :key="story.id"
               :data="story"
               @click.native="handleClick(story.id)"></Item>
        </div>
      </template>
    </div>
    <daily-article :id="articleId"></daily-article>
  </div>
</template>
<script>

import $ from './libs/util';
import Item from './components/item.vue';
import dailyArticle from './components/daily-article.vue';

export default {
  components: {
    Item,
    dailyArticle
  },
  data() {
    return {
      themes: [],
      showThemes: false,
      type: 'recommend',
      // themeId: 0,
      recommendList: [],
      list: [],
      dailyTime: $.getTodayTime(),
      isLoading: false,
      articleId: 0
    }
  },
  methods: {
    // 转换为带汉字的日期
    formatDay(date) {
      let month = date.substr(4, 2);
      let day = date.substr(6, 2);
      if (month.substr(0, 1) === '0') {
        month = month.substr(1, 1);
      }
      if (day.substr(0, 1) === '0') {
        day = day.substr(1, 1);
      }
      return `${month}月${day}日`;
    },
    handleToRecommend() {
      this.type = 'recommend',
      this.recommendList = [];
      this.dailyTime = $.getTodayTime();
      this.getRecommendList();
    },

    getRecommendList() {
      // 加载时设置为true，加载完设置为false
      this.isLoading = true;
      // 查询过往信息
      const prevDay = $.prevDay(this.dailyTime + 86400000);
      $.ajax.get('news/before/' + prevDay).then(res => {
        this.recommendList.push(res);
        this.isLoading = false;
      });
    },

    handleClick(id) {
      this.articleId = id;
    }
  },
  mounted () {
    // 初始化时调用
    // this.getThemes();
    this.getRecommendList();

    // 获取到DOM
    const $list = this.$refs.list;

    if (document.body.clientHeight >= $list.scrollHeight) {
        // 时间减少一天
        this.dailyTime -= 86400000;
        this.getRecommendList();
      }

    // 监听中栏滚动事件
    $list.addEventListener('scroll', () => {
      // 在主题日报或正在加载时停止
      if (this.type === 'daily' || this.isLoading) return;
      // 已经滚动的距离加页面的高度等于整个内容区高度时，视为接触底部
      if ($list.scrollTop + document.body.clientHeight >= $list.scrollHeight) {
        // 时间减少一天
        this.dailyTime -= 86400000;
        this.getRecommendList();
      }
    });
  }
}
</script>
