<template>
  <v-dialog
      v-model="getVisibleModal"
      width="500"
      persistent
  >
    <slot></slot>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: "Dialog",
  computed:{
    ...mapGetters(['getVisibleModal'])
  },
}
</script>

<style scoped>

</style>