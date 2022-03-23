<template>
  <div>
    <h1 class="black--text mt-3" align="center">Студенти</h1>
    <v-container class="main">
    <v-icon @click="tab=!tab">
      mdi-filter
    </v-icon>
    <v-expand-transition>
      <v-card
          width="350px"
          class="filter"
          overlay
          v-if="tab"
          style="margin-left: 80px"
      >
        <template>
          <v-tabs
              v-model="mainTab"
              align-with-title
          >
            <v-tab>
              Фільтрація
            </v-tab>
            <v-tab>
              Колонки
            </v-tab>
          </v-tabs>
        </template>
        <v-tabs-items
          v-model="mainTab"
        >
          <v-tab-item>
            <v-autocomplete
                :items="last_name_fio"
                v-model="filterData.last_name"
                v-debounce:300ms="lastName"
                label="Прізвища"
                class="filterFilds"
                hide-details
            >
            </v-autocomplete>
            <v-autocomplete
                :items="first_name_fio"
                v-model="filterData.first_name"
                v-debounce:300ms="getName"
                label="Ім'я"
                class="filterFilds"
                hide-details
            >
            </v-autocomplete>
            <v-select
              label="Група"
              v-model="filterData.group"
              :items="getGroups"
              item-value="id"
              item-text="name"
              hide-details
              class="filterFilds"
            >
            </v-select>
            <v-select
              label="Форма навчання"
              v-model="filterData.form_education"
              :items="['Державна', 'Контрактна']"
              class="filterFilds"
              hide-details
            >
            </v-select>
            <v-select
              v-model="filterData.education_program"
              :items="getPrograms"
              label="Освітня програма"
              class="filterFilds"
              item-value="id"
              item-text="name"
              hide-details
            >
            </v-select>
            <v-select
                :items="year"
                v-model="filterData.start_year"
                label="Початковий рік"
                class="filterFilds"
                item-text="year_entry__year"
                item-value="year_entry__year"
                hide-details
            ></v-select>
            <v-select
                :items="year"
                v-model="filterData.last_year"
                label="Кінцевий рік"
                class="filterFilds"
                item-text="year_entry__year"
                item-value="year_entry__year"
                hide-details
            ></v-select>
            <v-row>
              <v-col align="center">
                <v-btn class="success my-4" @click="getStudent(0)">
                  Відправити
                </v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-select
                label="Показувати поля"
                v-model="selectedHeaders"
                :items="headers.slice(1, 7)"
                multiple
                return-object
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 2">
                  <span>{{ item.text }}</span>
                </v-chip>
                <span v-if="index === 2" class="grey--text caption">(+{{ selectedHeaders.length - 5 }} інші)</span>
              </template>
            </v-select>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-expand-transition>
    <v-data-table
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :page.sync="page"
        :headers="showHeaders"
        :items="listStudent"
        :items-per-page="itemsPerPage"
        class="table"
        hide-default-footer
        :header-props="{sortIcon:'mdi-sort'}"
        :loading="loading"
        loading-text="Загрузка даних"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{row.item.id}}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Прізвище')">
            <router-link :to="{name:'student', params:{id:row.item.id}}">
              {{row.item.user.last_name}}
            </router-link>
          </td>
          <td v-if="showHeaders.some(obj => obj.text === 'Ім\'я')">{{row.item.user.first_name}}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Група')">{{row.item.group.name}}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Курс')">{{row.item.course}}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Форма навчання')">{{row.item.form_education}}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Освітня програма')">{{row.item.educational_program.name}}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Рік вступу')">{{row.item.year_entry}}</td>
          <td>
            <v-row>
              <v-col cols="4" sm="12" md="6">
                <v-btn class="success" @click="openChangeModel(
                    row.item.id,
                    row.item.group,
                    row.item.form_education,
                    row.item.educational_program,
                    row.item.year_entry)"
                >Редагувати</v-btn>
              </v-col>
            </v-row>
          </td>
          <td>
            <v-row>
              <v-col cols="4" sm="12" md="6">
                <v-btn class="error" @click="openModelForDeleteStudent(row.item.id)">Видалити</v-btn>
              </v-col>
            </v-row>
          </td>
        </tr>
      </template>
      <template v-slot:footer>
        <div>
          <div align="right">
            <v-select
                class="mr-3"
                style="max-width: 80px; display: inline-block"
                :items="items_per_page"
                v-model="itemsPerPage"
                @input="changeItems"
            ></v-select>
            <span class="mr-3">{{ getCurrentPage }} / {{ getAllPage }}</span>
            <v-icon
                class="mr-3"
                @click="page=0"
                :disabled="getPrevious"
            >
              mdi-arrow-collapse-left
            </v-icon>
            <v-icon
                class="mr-3"
                @click="page=minusPagination"
                :disabled="getPrevious"
            >
              mdi-chevron-left
            </v-icon>
            <v-icon
                class="mr-3"
                @click="page=plusPagination"
                :disabled="getNext"
            >
              mdi-chevron-right
            </v-icon>
          </div>
        </div>
      </template>
      <template v-slot:no-data>
        <p>Поки немає даних</p>
      </template>
    </v-data-table>
    <Dialog>
      <DataInDialogDelete
          :load="loading"
          @clickDelete="deleteStudent"
      />
    </Dialog>
    <!-- Діалогове вікно редагування даних студента  -->
    <v-dialog
        v-model="dialogChange"
        persistent
        max-width="450"
    >
      <v-card color="white">
        <v-card-title class="text-h5">
          Редагувати студента
        </v-card-title>
        <v-card-text>
          <v-select
              label="Група"
              v-model="activeData.group"
              :items="getGroups"
              item-value="id"
              item-text="name"
          >
          </v-select>
          <v-select
              label="Освітня програма"
              v-model="activeData.educational_program"
              :items="getPrograms"
              item-value="id"
              item-text="name"
          >
          </v-select>
          <v-select
              v-model="activeData.form_education"
              label="Форма навчання"
              :items="getEducational"
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
                  v-model="activeData.year_entry"
                  label="Дата народження"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="activeData.year_entry"
                :active-picker.sync="activePicker"
                :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="save"
            ></v-date-picker>
          </v-menu>
        </v-card-text>
        <v-card-actions align="center">
          <v-spacer></v-spacer>
          <v-btn class="error" @click="dialogChange=false">Скасувати</v-btn>
          <v-btn class="primary" @click="changeStudent">
            <Loading v-if="loading" />
            <span v-else>Зберегти</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SnackBar/>
    </v-container>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

import SnackBar from "../../components/Common/UI/SnackBar";
import Loading from "../../components/Common/UI/Loading";
import Dialog from "../../components/Common/UI/Dialog";
import DataInDialogDelete from "../../components/Methodist/DataInDialogDelete";
import http from "../../http/index";

export default {
  name: "StudentListPage",
  components:{
    SnackBar,
    Loading,
    Dialog,
    DataInDialogDelete,
  },
  data:() => ({
    selectedHeaders: [],
    sortBy: 'fat',
    sortDesc: false,
    tab:false,
    mainTab:null,
    menu:false,
    search:null,
    last_name_fio:[],
    first_name_fio:[],
    year:[],
    filterData:{
      last_name:'',
      first_name:'',
      group:'',
      form_education:'',
      education_program:'',
      start_year:'',
      last_year:''
    },
    activeData:{
      id:'',
      group:'',
      educational_program: '',
      form_education: '',
      year_entry: ''
    },
    page:0,
    itemsPerPage:5,
    items_per_page:[1, 5, 10, 15, 30],
    allCount:null,
    listStudent:[],
    dialogChange:false,
    loading:false,
    loadData:false,
    snackbarChange:false,
    id:null,
    headers: [
      { text: 'ID', value: 'id'},
      { text: 'Прізвище', value: 'user__last_name'},
      { text: "Ім'я", value: 'user__first_name'},
      { text: 'Група', value: 'group__name' },
      { text: 'Курс', value: 'year_entry' },
      { text: 'Форма навчання', value: 'form_education'},
      { text: 'Освітня програма', value: 'educational_program__name'},
      { text: 'Рік вступу', value: 'year_entry'},
      { text: 'Редагувати', value: 'Редагувати', sortable:false},
      { text: 'Видалити', value: 'Видалити', sortable:false},
    ],
  }),
  mounted() {
    this.getStudent(0)
    this.actionGetGroup()
    this.actionGetPrograms()
    this.selectedHeaders = this.headers
    this.getYear()
  },
  computed:{
    ...mapGetters(['getGroups', 'getPrograms', 'getEducational']),
    showHeaders(){
      return this.headers.filter(i => this.selectedHeaders.includes(i))
    },
    getPrevious(){
      return this.page === 0
    },
    getNext(){
      let a = Math.ceil((this.page + 1)/this.itemsPerPage)
      let b = Math.ceil(this.allCount / this.itemsPerPage)
      return a === b
    },
    getCurrentPage() {
      return Math.ceil((this.page + 1) / this.itemsPerPage)
    },
    getAllPage(){
      return Math.ceil(this.allCount/this.itemsPerPage)
    },
    minusPagination(){
      return this.page - this.itemsPerPage
    },
    plusPagination(){
      return this.page + this.itemsPerPage
    }
  },
  methods:{
    ...mapActions(['actionOpenSnack', 'actionOpenModal', 'actionCloseModal', 'actionGetGroup', 'actionGetPrograms']),
    getName(val){
      this.first_name_fio = []
      http.get('/methodist/student/names/', {params:{
          first_name:val,
          last_name:this.filterData.last_name
        }})
        .then(response => {
          console.log(response)
          response.data.map(i => {
            this.first_name_fio.push(i.user__first_name)
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    lastName(val){
      this.last_name_fio = []
      if (val.length > 0){
        http.get(`/methodist/student/last-names/`, {params:{
            first_name: this.filterData.first_name,
            last_name: val
          }})
            .then(response => {
              console.log(response.data)
              response.data.map(i => {
                this.last_name_fio.push(i.user__last_name)
              })
            })
            .catch(error => {
              console.log(error)
            })
      }
    },
    getYear(){
      http.get('/methodist/student/years/')
        .then(response => {
          response.data.map(i => this.year.push(i))
        })
        .catch(error => {
          console.log(error)
        })
    },
    dataFio(data){
      console.log('data -> ', data)
    },
    changeItems(limit){
      this.itemsPerPage = limit
      this.page=0
      this.getListSubject(0)
    },
    openChangeModel(id, group, form_education, form_control, year_entry){
      this.dialogChange = true
      this.activeData.id = id
      this.activeData.group = group.id
      this.activeData.form_education = form_education
      this.activeData.educational_program = form_control.id
      this.activeData.year_entry = year_entry
    },
    changeStudent(){
      const dataChange = {
        group: this.activeData.group,
        form_education: this.activeData.form_education,
        educational_program: this.activeData.educational_program,
        year_entry: this.activeData.year_entry
      }
      this.loading = true
      http.put(`/methodist/student/${this.activeData.id}/`, dataChange)
        .then(response => {
          let find = this.listStudent.find(i => {
            return i.id === this.activeData.id
          })
          let index = this.listStudent.indexOf(find)
          this.listStudent[index].id = response.data.id
          this.listStudent[index].group = response.data.group
          this.listStudent[index].educational_program = response.data.educational_program
          this.listStudent[index].form_education = response.data.form_education
          this.listStudent[index].year_entry = response.data.year_entry
          this.loading = false
          this.dialogChange = false
          const info = {'text':'Студент успішно відредагований', 'color':'orange'}
          this.actionOpenSnack(info)
        })
        .catch(error => {
          console.log(error)
        })
    },
    save (date) {
      this.$refs.menu.save(date)
    },
    openModelForDeleteStudent(id){
      this.actionOpenModal()
      this.id = id
    },
    getStudent(id){
      this.loading = true
      http.get(`/methodist/student/?offset=${id}&limit=${this.itemsPerPage}`, {params:{
          first_name: this.filterData.first_name,
          last_name: this.filterData.last_name,
          group: this.filterData.group,
          educational_program: this.filterData.education_program,
          form_education: this.filterData.form_education,
          min_year: this.filterData.start_year,
          max_year: this.filterData.last_year,
          ordering:this.sortBy
        }})
        .then(response => {
          console.log(response)
          this.allCount = response.data.count
          this.listStudent = response.data.results
          this.loading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteStudent(){
      this.loading = true
      http.delete(`/methodist/student/${this.id}/`)
        .then(response => {
          this.listStudent = this.listStudent.filter((p) => p.id !== this.id)
          this.loading = false
          this.actionCloseModal()
          const info = {'text':'Студент успішно видаленно', 'color':'red'}
          this.actionOpenSnack(info)
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
  watch:{
    page(val){
      this.getStudent(val)
    },
    sortDesc(val){
      console.log(val)
      if (val){
        this.sortBy = '-' + this.sortBy
      }
      console.log(this.sortBy)
      this.page = 0
      this.getStudent(0)
    }
  }
}
</script>

<style scoped>
  .filter{
    position: absolute;
    z-index: 10;
  }
  .table{
    max-width: 1400px;
    margin: 0 auto;
    margin-top: 25px;
  }
  .table thead th{
    color: white;
  }
  .filterFilds{
    width: 80%;
    margin: 0 auto;
    margin-top: 10px;
  }
  .main{
    max-width: 1400px;
  }
</style>