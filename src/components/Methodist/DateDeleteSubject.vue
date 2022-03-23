<template>
  <CardInDialog>
    <template v-slot:header>
      Видалити предмет?
    </template>
    <template v-slot:actions>
      <v-btn class="primary" @click="deleteSubject">
        <Loading v-if="load"/>
        <span v-else>Так</span>
      </v-btn>
      <v-btn class="error" @click="actionCloseModal">Ні</v-btn>
    </template>
  </CardInDialog>
</template>

<script>
import CardInDialog from "../Common/UI/CardInDialog";
import Loading from "../Common/UI/Loading";
import {mapActions} from 'vuex'
export default {
  name: "DateDeleteSubject",
  props:['load'],
  components:{
    CardInDialog,
    Loading
  },
  methods:{
    ...mapActions(['actionCloseModal']),
    deleteSubject(){
      this.$emit('clickDelete')
    }
  }
}
</script>

<style scoped>

</style>