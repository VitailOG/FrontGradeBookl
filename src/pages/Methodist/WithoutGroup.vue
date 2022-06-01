<template>
  <v-container>
    <!-- модальне вікно для створенн   -->
    <v-dialog
        v-model="dialog"
        persistent
        max-width="450"
    >
      <v-card color="white">
        <v-card-title class="text-h5">
          Додати студента
        </v-card-title>
        <v-card-text>
          <v-select
              label="Група"
              v-model="formGroup"
              :items="getGroups"
              item-value="id"
              item-text="name"
          >
          </v-select>
          <v-select
              v-model="formEduction"
              label="Форма навчання"
              :items="formEductions"
          >
          </v-select>
          <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="date"
                  label="Дата вступу"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="date"
                :active-picker.sync="activePicker"
                :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="save"
            ></v-date-picker>
          </v-menu>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              class="error"
              @click="close"
          >
            Закрити
          </v-btn>
          <v-btn
              class="primary"
              @click="saveDate"
          >
            <v-progress-circular
                v-if="loading"
                :size="25"
                color="white"
                indeterminate
            ></v-progress-circular>
            <span v-else>Зберегти</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <h1 class="black--text mt-3" align="center">Без групи</h1>
    <!-- таблиця виводу   -->
    <v-data-table
      hide-default-footer
      :headers="headers"
      :items="listStudent"
      :items-per-page="listStudent.length"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.id }}</td>
          <td>{{ row.item.surname }}</td>
          <td>{{ row.item.first_name }}</td>
          <td>{{ row.item.last_name }}</td>
          <td>
            <v-btn @click="openDialog(row.item.id)" class="primary">
              Додати
            </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        <p>Поки немає даних</p>
      </template>
    </v-data-table>
    <SnackBar/>
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

import http from "../../http/index";
import SnackBar from "../../components/Common/UI/SnackBar";

export default {
  name: "WithoutGroup",
  components: {SnackBar},
  data:() => ({
    id_user:null,
    dialog:false,
    listStudent:[],
    loading:false,
    menu:false,
    formEductions: ['Контрактна', 'Державна'],
    formEduction: '',
    formGroup: '',
    formProgram:  '',
    date:'',
    headers:[
      {text:'ID', value:'id', sortable:false},
      {text:'Surname', value:'surname', sortable:false},
      {text:'Firstname', value:'firstname', sortable:false},
      {text:'Lastname', value:'lastname', sortable:false},
      {text:'Дія', value:'move'},
    ]
  }),
  mounted() {
    this.getStudent()
    this.actionGetGroup()
    this.actionGetPrograms()
  },
  computed:{
    ...mapGetters(['getGroups', 'getPrograms'])
  },
  methods:{
    ...mapActions(['actionGetGroup', 'actionGetPrograms', 'actionOpenSnack']),
    saveDate(){
      const dataForm = {
        group: this.formGroup,
        form_education: this.formEduction,
        year_entry: this.date
      }
      this.loading = true
      http.post(`/methodist/student/create/${this.id_user}/`, dataForm)
          .then(response => {
            console.log(response)
            this.listStudent = this.listStudent.filter((p) => p.id !== this.id_user)
            this.loading = false
            const info = {'text':'Студента створено', 'color':'green'}
            this.actionOpenSnack(info)
          })
          .catch(error => {
            console.log(error)
            alert('Error')
          })
      this.formEduction = ''
      this.formGroup = ''
      this.date = ''
      this.dialog = false
    },
    openDialog(id){
      this.dialog = true
      this.id_user = id
    },
    close(){
      this.formEduction = ''
      this.formGroup = ''
      this.formProgram = ''
      this.date = ''
      this.dialog = false
    },
    getStudent(){
      http.get('/methodist/student/without-group/')
        .then(response => {
          this.listStudent = response.data
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
  }
}
</script>

<style scoped>

</style>