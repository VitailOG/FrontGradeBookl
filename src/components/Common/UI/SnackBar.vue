<template>
  <v-snackbar
      top
      v-model="getVisible"
      :color="getColorSnack"
  >
    <div align="center">{{ getTextMessage }}</div>
  </v-snackbar>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: "SnackBar",
  computed:{
    ...mapGetters(['getVisible', 'getTextMessage', 'getColorSnack'])
  }
}
</script>

<style scoped>

</style>