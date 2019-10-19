<template>
  <div v-click-outside>
    <input type="text" :value="formatDate">
    <div class="pannel" v-if="isVisible">
      <div class="pannel-nav">
        <span @click="prevYear">&lt;</span>
        <span @click="prevMonth">&lt;&lt;</span>
        <span>{{ time.year }}年 {{ time.month + 1 }}月</span>
        <span @click="nextMonth">&gt;&gt;</span>
        <span @click="nextYear">&gt;</span>
      </div>
      <div class="pannel-content">
        <span class="cell"
                v-for="w in 7" :key="'_' + w">
            {{ week[w - 1] }}
        </span>
        <div v-for="i in 6" :key="i">
          <span class="cell cell-days"
                :class="[{
                  notCurrentMonth: !isCurrentMonth(visibleDays[(i - 1) * 7 + j - 1]),
                  today: isToday(visibleDays[(i - 1) * 7 + j - 1]),
                  selected: isSelected(visibleDays[(i - 1) * 7 + j - 1])
                }]"
                v-for="j in 7" :key="j"
                @click="chooseDate(visibleDays[(i - 1) * 7 + j - 1])">
            {{ visibleDays[(i - 1) * 7 + j - 1].getDate() }}
          </span>
        </div>
      </div>
      <div class="pannel-footer">
        today
      </div>
    </div>
  </div>
</template>

<script>
import * as utils from './util'

export default {
  directives: {
    clickOutside: {
      bind (el, bindings, vnode) {
        // 把事件绑定给 document 上，看点击的是否是元素内部
        const handler = e => {
          if (el.contains(e.target)) {
            // 判断面板是否已经出现
            if (!vnode.context.isVisible) {
              vnode.context.focus()
            }
          } else {
            if (vnode.context.isVisible) {
              vnode.context.blur()
            }
          }
        }
        el.handler = handler
        document.addEventListener('click', handler)
      },
      unbind (el) {
        document.removeEventListener('click', el.handler)
      }
    }
  },
  data () {
    let { year, month } = utils.getYearMonthDay(this.value)
    return {
      week: ['日', '一', '二', '三', '四', '五', '六'],
      time: {
        year,
        month
      },
      // 控制面板是否可见，默认不可见
      isVisible: false
    }
  },
  props: {
    value: {
      type: Date,
      default: () => new Date()
    }
  },
  methods: {
    // 显示面板
    focus () {
      this.isVisible = true
    },
    // 隐藏面板
    blur () {
      this.isVisible = false
    },
    isCurrentMonth (date) {
      let { year: y1, month: m1 } = utils.getYearMonthDay(utils.getDate(this.time.year, this.time.month, 1))
      let { year: y2, month: m2 } = utils.getYearMonthDay(date)
      return y1 === y2 && m1 === m2
    },
    isToday (date) {
      let { year: y1, month: m1, day: d1 } = utils.getYearMonthDay(new Date())
      let { year: y2, month: m2, day: d2 } = utils.getYearMonthDay(date)
      return y1 === y2 && m1 === m2 && d1 === d2
    },
    chooseDate (date) {
      this.time = utils.getYearMonthDay(date)
      this.$emit('input', date)
      this.blur()
    },
    isSelected (date) {
      let { year: y1, month: m1, day: d1 } = utils.getYearMonthDay(this.value)
      let { year: y2, month: m2, day: d2 } = utils.getYearMonthDay(date)
      return y1 === y2 && m1 === m2 && d1 === d2
    },
    prevMonth () {
      if (this.time.month !== 0) {
        this.time.month--
      } else {
        this.time.month = 11
        this.time.year--
      }
    },
    nextMonth () {
      if (this.time.month !== 11) {
        this.time.month++
      } else {
        this.time.month = 0
        this.time.year++
      }
    },
    prevYear () {
      this.time.year--
    },
    nextYear () {
      this.time.year++
    }
  },
  computed: {
    visibleDays () {
      let arr = []
      let { year, month } = utils.getYearMonthDay(utils.getDate(this.time.year, this.time.month, 1))
      let firstDayOfCurrentMonth = utils.getDate(year, month, 1)
      let weekOfFirstDay = firstDayOfCurrentMonth.getDay()
      let startDay = firstDayOfCurrentMonth - weekOfFirstDay * 60 * 60 * 1000 * 24
      for (let i = 0; i < 42; i++) {
        arr.push(new Date(startDay + i * 60 * 60 * 1000 * 24))
      }
      return arr
    },
    formatDate () {
      let { year, month, day } = utils.getYearMonthDay(this.value)
      return `${year}-${month + 1}-${day}`
    }
  }
}
</script>

<style lang="stylus">
.pannel
  width 224px
  position absolute
  background #fff
  box-shadow 2px 2px 2px pink, -2px -2px 2px pink
  .pannel-nav
    display flex
    height 30px
    justify-content space-around
    span
      cursor pointer
      user-select none
  .pannel-content
    .cell
      display inline-flex
      box-sizing border-box
      width 32px
      height 32px
      justify-content center
      align-items center
      font-weight bold
    .cell-days:hover, .selected
      border 1px solid pink
      border-radius 50%
    .notCurrentMonth
      color gray
    .today
      background red
      color white
      border-radius 50%
  .pannel-footer
    height 30px
    text-align center
</style>