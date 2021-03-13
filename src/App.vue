<template>
  <div id="app">
    <Scheduler />
  </div>
</template>

<script>
import Scheduler from './components/Scheduler.vue'
import Room from './data/Room.js'

export default {
  name: 'app',
  components: {
    Scheduler
  },
  mounted() {
    Room.loadRooms()
  },
}
</script>
