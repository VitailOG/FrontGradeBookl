<template>
  <div>
    <v-container class="main">
      <v-data-table
          class="table1"
          :headers="headers"
          :items="listStudent"
          hide-default-footer
      >
        <template v-slot:item="row">
          <YearRatingForm
              @postRating="postRating"
              @clickUpdateDataRating="updateRating"
              :teachers="teachers"
              :data="row.item"
              :ratings="ratings"
              :ratingsReadOnly="ratingsReadOnly"
              :first_semestr="semestr_first"
              :second_semestr="semester_second"
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
import YearRatingForm from "../../components/Methodist/YearRatingForm";
import http from "../../http/index";

export default {
  name: "YearRating",
  components:{YearRatingForm},
  data:() => ({
    semestr_first:null,
    semester_second:null,
    menu:false,
    listStudent:[],
    teachers:[],
    ratings:[],
    ratingsReadOnly:[],
    index:1,
    headers:[
      {text:'ID', value:'id', sortable:false},
      {text:'Ім\'я', value:'first_name', sortable:false},
      {text:'Прізвище', value:'last_name', sortable:false},
      {text:'Початковий семестр', value:'semester1', sortable:false},
      {text:'Кінцевий семестр', value:'teacher', sortable:false},
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
    this.yearRating()
  },
  methods:{
    postRating(data){
      http.post('/methodist/rating/', data)
        .then(response => {
          this.index++
          console.log(response)
          this.ratings.push(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateRating(data){
      http.put(`/methodist/rating/${data.id}/`, data)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
    },
    yearRating(){
      http.get(`/methodist/rating/group/${this.$route.params.id}/`)
        .then(response => {
          console.log(response.data)
          this.semestr_first = response.data.semester
          this.semester_second = response.data.final_semester
          if (response.data.semester === response.data.final_semester){
            this.headers = this.headers.filter(i => {
              return i.text != 'Кінцевий семестр'
            })
          }
          response.data.students.map(i => {
            this.listStudent.push(i)
          })
          response.data.teachers.map(i =>  {
            this.teachers.push(i)
          })
          response.data.ratings.map(i => {
            this.ratings.push(i)
          })
          this.ratings.map(i => {
            if(!i.is_annual_assessment){
              this.ratingsReadOnly.push(i)
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
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