<template>
  <span>{{number}}</span>
</template>
<script>
const delay = 30
const k = 4

export default {
  name: 'grow-num',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      number: 0
    }
  },
  methods: {
    calculate(newVal, oldVal) {
      let diff = newVal > oldVal ? Math.ceil((newVal - oldVal) / k) : Math.floor((newVal - oldVal) / k)
      this.number = diff + oldVal
      if (Math.abs(this.number - newVal) < 1) {
        this.number = newVal
        return
      }
      this.timer = setTimeout(() => {
        this.calculate(newVal, this.number)
      }, delay)
    }
  },
  watch: {
    value(newVal, oldVal) {
      clearTimeout(this.timer)
      this.calculate(newVal, oldVal)
    }
  },
  created() {
    this.timer = ''
    this.calculate(this.value, this.number)
  }
}
</script>
