<template>
  <div>
    <v-switch
        label="Всі студенти"
        color="green"
        v-model="chexbox"
    ></v-switch>
    <v-dialog
        v-model="showDialog"
        persistent
        max-width="430"
    >
      <v-card>
        <v-card-title>Дії з балами</v-card-title>
        <v-card-text>
          <v-btn class="primary" @click="showDialog=false">Скасувати</v-btn>
          <v-btn class="error" @click="deleteExtraRating">Видалити</v-btn>
          <v-btn class="warning" @click="updateExtraRating">Редагувати</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <SnackBar/>
    <v-data-table
      hide-default-footer
      class="table"
      :headers="headers"
      :items="list_student"
      :key="index"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.id }}</td>
          <td>{{ row.item.user.last_name }}</td>
          <td>{{ row.item.user.first_name }}</td>
          <td>{{ row.item.user.surname }}</td>
          <td>Оцінка</td>
          <td>
            <div v-if="row.item.extra_points_students.length > 0">
              <span v-for="i in row.item.extra_points_students" :key="i.id">
                <span @click="openActionModal(i.id, i.point, i.text)">{{ i.point }} - {{ i.text }}</span><br>
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
            height="110px"
          >
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeExtraRating" class="error">
            Скасувати
          </v-btn>
          <v-btn class="success" @click="addExtraRating" v-if="!button">
            Зберегти
          </v-btn>
          <v-btn class="success" @click="updateRating" v-else>
            Зберегти
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import http from "../../http/index";

import SnackBar from "../../components/Common/UI/SnackBar";

export default {
  name: "RatingList",
  components: {SnackBar},
  data:() => ({
    index:1,
    chexbox:false,
    button:false,
    showDialog:false,
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
    ],
    extra_id:null,
  }),
  mounted() {
    this.listRating()
    console.log(this.$route)
  },
  methods:{
    ...mapActions(['actionOpenSnack']),
    openActionModal(id, extra_rating, text){
      this.showDialog = true
      this.extra_id = id
      this.extra_rating.rating = extra_rating
      this.extra_rating.text = text
    },
    updateRating(){
      const data = {
        point: this.extra_rating.rating,
        text: this.extra_rating.text,
      }
      console.log(data)
      http.patch(`/methodist/group/update/${this.extra_id}/`, data)
          .then(response => {
            console.log(response)
            this.button = false
            this.dialog = false
            this.list_student.map(i => {
              i.extra_points_students.map(j => {
                if (j.id === this.extra_id){
                  let old_rating = j.point
                  j.point = this.extra_rating.rating
                  j.text = this.extra_rating.text
                  console.log((Number(i.total_rating) - Number(old_rating)) + Number(j.point))
                  i.total_rating = (Number(i.total_rating) - Number(old_rating)) + Number(j.point)
                }
              })
            })
          })
          .catch(error => {
            console.log(error)
          })
    },
    updateExtraRating(){
      this.showDialog = false
      this.dialog = true
      this.button = true
    },
    deleteExtraRating(){
      this.showDialog = true
      console.log('extra ',this.extra_id)
      http.delete(`/methodist/group/delete/${this.extra_id}/`)
        .then(response => {
          this.showDialog = false
          this.list_student.map(i => {
            console.log(i.total_rating)
            i.extra_points_students = i.extra_points_students.filter(j => {
             if (j.id !== this.extra_id){
               return j
             } else {
               i.total_rating -= Number(j.point)
             }
            })
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
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
          console.log(response.data)
          if (response.status === 201){
            console.log('asdasd')
            this.list_student.map(i => {
              if (i.id === this.studentId){
                i.extra_points_students.push(response.data)
                console.log(i.extra_points_students)
                i.total_rating += Number(data.point)
              }
            })
            this.list_student.sort((a, b) => a.total_rating < b.total_rating ? 1 : -1)
            this.dialog = false
            const info = {'text':'Дані збережені', 'color':'green'}
            this.actionOpenSnack(info)
            this.extra_rating.rating = null
            this.extra_rating.text = ''
          }
        })
        .catch(error => {
            if (this.extra_rating.rating === null || this.extra_rating.text === ''){
              const info = {'text':'Коректно заповніть всі поля', 'color':'red'}
              this.actionOpenSnack(info)
            } else {
              const info = {'text':'Додатковий бал не може бути більше 0.5', 'color':'red'}
              this.actionOpenSnack(info)
            }
        })
    },
    listRating(chexbox){
      http.get(`/methodist/group/${this.$route.params.id}/detail/${this.$route.params.semester}/`,
          {params:{is_all_students:chexbox}}
      )
        .then(response => {
          console.log(response.data)
          this.list_student = response.data
          this.index++
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  watch:{
    chexbox(val){
      console.log(val)
      this.listRating(val)
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