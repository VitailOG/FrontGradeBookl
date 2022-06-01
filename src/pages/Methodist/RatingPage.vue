<template>
  <div>
<!--    <h1 class="black&#45;&#45;text my-3" align="center">{{ current_subject.name }}</h1>-->
    <SnackBar/>
    <v-container class="main">
      <v-data-table
        class="table1"
        :headers="headers"
        :items="students"
        hide-default-footer
      >
        <template v-slot:item="row">
          <FormRating
            @clickPost="postDataForRating"
            @clickUpdateDataRating="updateRating"
            :teachers="teachers"
            :ratings="ratings"
            :data="row.item"

            :form_of_control="form_of_control"

            :key="index"
            :id="$route.params.id"
          />
        </template>
        <template v-slot:no-data>
          <p>Поки немає даних</p>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import SnackBar from "../../components/Common/UI/SnackBar";
import FormRating from "../../components/Methodist/FormRating";
import http from "../../http/index";

import {mapState, mapActions} from "vuex";

export default {
  name: "RatingPage",
  components: {
    FormRating,
    SnackBar
  },
  data:() => ({
    index:1,
    listStudent:[],
    teachers:[],
    students:[],
    ratings:[],
    id_subject:null,
    form_of_control: '',
    headers:[
      {text:'ID', value:'id', sortable:false},
      {text:'Ім\'я', value:'first_name', sortable:false},
      {text:'Прізвище', value:'last_name', sortable:false},
      {text:'5', value:'rating_5', sortable:false},
      {text:'12', value:'rating_12', sortable:false},
      {text:'Дата', value:'data', sortable:false},
      {text:'Перездача', value:'retransmission', sortable:false},
      {text:'Зараховано', value:'credited', sortable:false},
      {text:'Викладач', value:'teacher', sortable:false},
      {text:'Дія', value:'move', sortable:false},
    ]
  }),
  mounted() {
    this.getDataForRating()
  },
  computed:{
    ...mapState(['current_subject', 'semester'])
  },
  methods:{
    ...mapActions(['actionOpenSnack']),
    updateRating(data){
      console.log(this.ratings)
      http.put(`/methodist/rating/${data.id}/`, data)
        .then(response => {
          console.log(response)
          const info = {'text':'Оцінка відредагована', 'color':'orange'}
          this.actionOpenSnack(info)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getDataForRating(){
      http.get(`/methodist/rating/group/${this.$route.params.id}/`, {params:{semester:this.$route.params.semester}})
          .then(response => {
            this.form_of_control = response.data.form_of_control
            response.data.teachers.map(i =>  {
              this.teachers.push(i)
            })
            response.data.students.map(i => {
              this.students.push(i)
            })
            response.data.ratings.map(i => {
              this.ratings.push(i)
            })
          })
          .catch(error => {
            console.log(error)
          })
    },
    postDataForRating(data){
      data.is_annual_assessment = ['Курсова', 'Практика'].includes(this.form_of_control) ? true : false
      http.post('/methodist/rating/', data)
          .then(response => {
            console.log(response.data)
            this.index++
            this.ratings.push(response.data)
            const info = {'text':'Оцінка добавлена', 'color':'green'}
            this.actionOpenSnack(info)
          })
          .catch(error => {
            console.log(error)
          })
    },
  },
}
</script>

<style scoped>
  .table1{
    margin: 0 auto;
    max-width: 1400px;
    margin-top: 25px;
  }
  .main{
    max-width: 1400px;
  }
</style>