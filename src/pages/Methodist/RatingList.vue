<template>
  <div>
    <v-data-table
      hide-default-footer
      class="table"
      :headers="headers"
      :items="list_student[0]"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.id }}</td>
          <td>{{ row.item.user.last_name }}</td>
          <td>{{ row.item.user.first_name }}</td>
          <td>{{ row.item.user.surname }}</td>
          <td>Оцінка</td>
          <td>
            <div v-if="row.item.extra_point.length > 0">
              <span v-for="i in row.item.extra_point" :key="i">
                {{ i.point }} - {{ i.text }}<br>
              </span>
            </div>
            <p v-else>Немає додаткових балів</p>
          </td>
          <td>{{ row.item.total_rating }}</td>
          <td>
            <v-btn style="background: #88daff" class="white--text" @click="openModalExtra(row.item.id)">
              Додати додатковий бал
            </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        <p>Поки немає даних</p>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="450"
    >
      <v-card>
        <v-card-title class="text-h5 justify-center">
          Додатковий бал
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="extra_rating.rating"
            label="додатковий бал"
            color="success"
          ></v-text-field>
          <v-textarea
            label="опис додаткового балу"
            v-model="extra_rating.text"
          >
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeExtraRating" class="error">
            Скасувати
          </v-btn>
          <v-btn class="success" @click="addExtraRating">
            Зберегти
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import http from "../../http/index";

export default {
  name: "RatingList",
  data:() => ({
    studentId:null,
    dialog:false,
    list_student:[],
    extra_rating:{
      rating:null,
      text:''
    },
    headers:[
      {text:'ID', value:'id', sortable:false},
      {text:'Прізвище', value:'last_name', sortable:false},
      {text: "Ім'я", value: 'user__first_name', sortable:false},
      {text:'По батькові', value:'surname', sortable:false},
      {text:'Оцінка', value:'rating', sortable:false},
      {text:'Додаткові бали', value:'special_rating', sortable:false},
      {text:'Загальна оцінка', value:'main_rating', sortable:false},
      {text:'Дія', value:'move', sortable:false},
    ]
  }),
  mounted() {
    this.listRating()
  },
  methods:{
    closeExtraRating(){
      this.dialog = false
      this.extra_rating.rating = null
      this.extra_rating.text = ''
    },
    openModalExtra(id){
      this.dialog = true
      this.studentId = id
    },
    addExtraRating(){
      const data = {
        semester: this.$route.params.semester,
        point: this.extra_rating.rating,
        text: this.extra_rating.text,
        user: this.studentId
      }
      http.post('/methodist/group/create_extra_points/', data)
        .then(response => {
          if (response.data.created){
            this.list_student[0].map(i => {
              if (i.id === this.studentId){
                i.extra_point.push(data)
                i.total_rating += Number(data.point)
              }
            })
            this.list_student[0].sort((a, b) => a.total_rating < b.total_rating ? 1 : -1)
            this.dialog = false
          }
        })
        .catch(error => {
          console.log(error)
        })
      this.extra_rating.rating = null
      this.extra_rating.text = ''
    },
    listRating(){
      http.get(`/methodist/group/${this.$route.params.id}/detail/${this.$route.params.semester}/`)
        .then(response => {
          console.log(response.data)
          this.list_student.push(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
  .table{
    max-width: 1400px;
    margin: 0 auto;
    margin-top: 25px;
  }
</style>