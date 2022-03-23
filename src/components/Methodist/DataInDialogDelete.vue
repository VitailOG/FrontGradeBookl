<template>
  <CardInDialog>
    <template v-slot:header>
      Видалити студента?
    </template>
    <template v-slot:actions>
      <v-btn class="error" @click="actionCloseModal">Ні</v-btn>
      <v-btn class="primary" @click="deleteStudent">
        <Loading v-if="load"/>
        <span v-else>Так</span>
      </v-btn>
    </template>
  </CardInDialog>
</template>

<script>
import CardInDialog from "../Common/UI/CardInDialog";
import Loading from "../Common/UI/Loading";
import {mapActions} from 'vuex'
export default {
  name: "DataInDialogDelete",
  components:{
    CardInDialog,
    Loading
  },
  props:['load'],
  methods:{
    ...mapActions(['actionCloseModal']),
    deleteStudent(){
      this.$emit('clickDelete')
    }
  }
}
</script>

<style scoped>

</style>