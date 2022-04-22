<template>
  <div>
    <h1 class="black--text mt-3" align="center">Предмети</h1>
    <v-container class="main">
      <v-icon @click="openModalForFilter">
        mdi-filter
      </v-icon>
      <v-expand-transition>
        <v-card
            width="350px"
            class="filter"
            overlay
            v-if="tab"
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
                :items="name_subjects"
                v-model="filterData.name_subject"
                v-debounce:300ms="getSubject"
                label="Назва предмета"
                hide-details
                item-text="name_subject"
                item-value="name_subject"
                class="filterFilds"
              >
              </v-autocomplete>
              <v-select
                  clear-icon="mdi-close"
                  clearable
                  v-model="filterData.group"
                  label="Група"
                  :items="getGroups"
                  item-value="id"
                  item-text="name"
                  hide-details
                  class="filterFilds"
              >
              </v-select>
              <v-select
                clear-icon="mdi-close"
                clearable
                v-model="filterData.educational_program"
                :items="getPrograms"
                item-value="id"
                item-text="name"
                label="Освітня програма"
                hide-details
                class="filterFilds"
              >
              </v-select>
              <v-select
                clear-icon="mdi-close"
                clearable
                :items="teachers"
                v-model="filterData.teachers"
                item-value="id"
                item-text="username"
                label="Викладчі"
                hide-details
                class="filterFilds"
                multiple
              >
              </v-select>
              <v-select
                  clear-icon="mdi-close"
                  clearable
                  v-model="filterData.first_semestr"
                  :items="semester"
                  label="Початковий семестр"
                  hide-details
                  class="filterFilds"
              ></v-select>
              <v-select
                  clear-icon="mdi-close"
                  clearable
                  v-model="filterData.final_semester"
                  :items="semester"
                  label="Кінцевий семестр"
                  hide-details
                  class="filterFilds"
              ></v-select>
              <v-row>
                <v-col align="center">
                  <v-btn class="success my-4" @click="getListSubject">
                    Відправити
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-select
                label="Видимі поля"
                class="filterFilds"
                v-model="selectedHeaders"
                :items="headers.slice(1, 11)"
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
    </v-container>
    <v-data-table
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :page.sync="page"
        :headers="showHeaders"
        :items="listSubject"
        :items-per-page="itemsPerPage"
        :pagination.sync="pagination"
        :loading="loading"
        :header-props="{sortIcon:'mdi-sort'}"
        loading-text="Загрузка даних"
        hide-default-footer
        class="table"
    >
      <template v-slot:item="row">
        <tr>
          <td>{{ row.item.id }}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Назва предмета')">
            <router-link :to="{name:'detail_subject', params:{id:row.item.id}}">
              {{ row.item.name_subject }}
            </router-link>
          </td>
          <td v-if="showHeaders.some(obj => obj.text === 'Вчителі')">
            <p v-for="i in row.item.teachers">
              {{ i.username }}
            </p>
          </td>
          <td v-if="showHeaders.some(obj => obj.text === 'Група')">{{ row.item.group.name }}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Освітня програма')">{{ row.item.educational_program.name }}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Кількість годин')">{{ row.item.hours }}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Кількість кредитів')">{{ row.item.loans }}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Початковий семестр')">{{ row.item.semester }}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Кінцевий семестр')">{{ row.item.final_semester }}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Форма контроля')">{{ row.item.form_of_control }}</td>
          <td v-if="showHeaders.some(obj => obj.text === 'Фінальний предмет')">
            <span v-if="row.item.finally_subject">
              <v-icon color="green">
                mdi-checkbox-marked-circle
              </v-icon>
            </span>
            <span v-else>
              <v-icon color="red">
                mdi-cancel
              </v-icon>
            </span>
          </td>
          <td v-if="showHeaders.some(obj => obj.text === 'Посилання на Moodle')">
            <a :href="row.item.url_on_moodle" target="_blank">Посилання</a>
          </td>
          <td>
            <v-row>
              <v-col cols="4" sm="12" md="6">
                <v-btn class="success" @click="openModalForChange(
                    row.item.id,
                    row.item.group,
                    row.item.educational_program.id,
                    row.item.teachers,
                    row.item.name_subject,
                    row.item.hours,
                    row.item.semester,
                    row.item.final_semester,
                    row.item.form_of_control,
                    row.item.finally_subject,
                    row.item.url_on_moodle
                )">Редагувати</v-btn>
              </v-col>
            </v-row>
          </td>
          <td>
            <v-row>
              <v-col>
                <v-btn class="error" @click="openModalForDelete(row.item.id)">Видалити</v-btn>
              </v-col>
            </v-row>
          </td>
        </tr>
      </template>
      <template v-slot:footer>
        <div align="right">
          <v-select
              class="mr-3"
              style="max-width: 80px; display: inline-block"
              :items="items_per_page"
              v-model="itemsPerPage"
              @input="changeItems"
          ></v-select>
          <span class="mr-3">{{ getCurrentPage }}/{{ getAllPage }}</span>
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
      </template>
      <template v-slot:no-data>
        <p>Поки немає даних</p>
      </template>
    </v-data-table>
    <v-btn
      @click="openModelSubject"
      color="primary"
      dark
      absolute
      bottom
      right
      fab
    >
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="430"
    >
      <v-card>

        <v-card-title class="text-h5" v-if="this.changeModal">
          Редагувати предмет
        </v-card-title>
        <v-card-title class="text-h5" v-else>
          Створити предмет
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Назва предмета"
            v-model="selectedSubject.name"
          >
          </v-text-field>
          <v-text-field
              label="Кількість годин"
              type="number"
              min="0"
              v-model="selectedSubject.hours"
          >
          </v-text-field>
          <v-select
            label="Група"
            v-model="selectedSubject.group"
            :items="getGroups"
            item-value="id"
            item-text="name"
          >
          </v-select>
          <v-select
              label="Форма контролю"
              v-model="selectedSubject.form_of_control"
              :items="form_of_control"
          ></v-select>
          <v-select
            label="Початковий семестр"
            v-model="selectedSubject.first_semestr"
            :items="semesterFirst"
          >
          </v-select>
          <v-select
              label="Кінцевий семестр"
              v-model="selectedSubject.last_semestr"
              :items="semesterFinally"
              :disabled="disableSemester"
          >
          </v-select>
          <v-select
              label="Викладачі"
              v-model="selectedSubject.teachers"
              :items="teachers"
              item-value="id"
              item-text="username"
              multiple
          >
          </v-select>
          <v-checkbox
              v-model="selectedSubject.finallySubject"
              label="Фінальний предмет"
              :disabled="disableFinishSubject"
          ></v-checkbox>
          <v-text-field
            label="Посилання на мудл"
            v-model="selectedSubject.link_to_Moodle"
            type="url"
            placeholder="http://moodle.gi.edu.ua/"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="error" @click="showDialog = false">Скасувати</v-btn>
          <v-btn class="primary" @click="changeSubject" v-if="changeModal">
            <Loading v-if="loading"/>
            <span v-else>Зберегти</span>
          </v-btn>
          <v-btn class="primary" @click="createSubject" v-else>
            <Loading v-if="loading"/>
            <span v-else>Зберегти</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Dialog>
      <DateDeleteSubject
        :load="loading"
        @clickDelete="deleteSubject"
      />
    </Dialog>
    <!--  Модальне вікно для фільтрів  -->
    <SnackBar/>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

import Loading from "../../components/Common/UI/Loading";
import SnackBar from "../../components/Common/UI/SnackBar";
import Dialog from "../../components/Common/UI/Dialog";
import DateDeleteSubject from "../../components/Methodist/DateDeleteSubject";
import DataTable from "../../components/Methodist/DataTable";

import http from "../../http/index";

export default {
  name: "SubjectPage",
  components:{
    Loading,
    SnackBar,
    Dialog,
    DateDeleteSubject,
    DataTable
  },
  data: () => ({
    disableSemester:false,
    disableFinishSubject:false,
    selectedHeaders: [],
    mainTab:null,
    tab:false,
    listSubject:[],
    sortBy: 'fat',
    sortDesc: false,
    filterData:{
      name_subject:'',
      group:'',
      teachers:[],
      first_semestr: '',
      final_semester:'',
      educational_program:''
    },
    selectedSubject:{
      name:'',
      hours:null,
      group:'',
      teachers:[],
      first_semestr:null,
      last_semestr:null,
      finallySubject:false,
      form_of_control:'',
      link_to_Moodle:'',
      educational_program:''
    },
    name_subjects:[],
    idSubject:null,
    showDialog:false,
    changeModal:false,
    loading:false,
    filter:false,
    page:0,
    allPages:null,
    itemsPerPage:5,
    idDelete:'',
    semester:[1, 2, 3, 4, 5, 6, 7, 8],
    items_per_page:[1, 2, 5, 10, 20, 30],
    teachers:[],
    form_of_control:['Екзамен', 'Залік', 'Курсова', 'Практика'],
    pagination:{},
    headers:[
      {text:'ID', value:'id'},
      {text:'Назва предмета', value:'name_subject'},
      {text:'Вчителі', value:'teachers'},
      {text:'Група', value:'group__name'},
      {text:'Освітня програма', value:'educational_program'},
      {text:'Кількість годин', value:'hours'},
      {text:'Кількість кредитів', value:'loans'},
      {text:'Початковий семестр', value:'semester'},
      {text:'Кінцевий семестр', value:'final_semester'},
      {text:'Форма контроля', value:'Форма контроля', sortable:false},
      {text:'Фінальний предмет', value:'Фінальний предмет', sortable:false},
      {text:'Посилання на Moodle', value:'Посилання на Moodle', sortable:false},
      {text:'Редагувати', value:'Редагувати', sortable:false},
      {text:'Видалити', value:'Видалити', sortable:false},
    ]
  }),
  mounted() {
    this.getListSubject(0)
    this.actionGetGroup()
    this.actionGetPrograms()
    this.getData()
    // this.getNameSubject()
    this.selectedHeaders = this.headers
  },
  computed:{
    ...mapGetters(['getGroups', 'getPrograms']),
    semesterFirst(){
      if (this.selectedSubject.last_semestr != null){
        return this.semester.slice(0, this.selectedSubject.last_semestr)
      } else {
        return this.semester
      }
    },
    semesterFinally(){
      if (this.selectedSubject.first_semestr != null){
        return this.semester.slice(this.selectedSubject.first_semestr-1)
      } else {
        return this.semester
      }
    },
    showHeaders(){
      let headers = this.headers.filter(i => this.selectedHeaders.includes(i))
      return headers
    },
    getNext(){
      let a = Math.ceil((this.page + 1)/this.itemsPerPage)
      let b = Math.ceil(this.allPages / this.itemsPerPage)
      return  a === b
    },
    getPrevious(){
      return this.page === 0
    },
    getCurrentPage(){
      return Math.ceil((this.page + 1) / this.itemsPerPage)
    },
    getAllPage(){
      return Math.ceil(this.allPages/this.itemsPerPage)
    },
    minusPagination(){
      return this.page - this.itemsPerPage
    },
    plusPagination(){
      return this.page + this.itemsPerPage
    }
  },
  methods:{
    ...mapActions(['actionGetGroup', 'actionOpenSnack', 'actionOpenModal', 'actionCloseModal', 'actionGetPrograms']),
    openModalForFilter(){
      this.filterData.group = localStorage.getItem('subject_group') ? Number(localStorage.getItem('subject_group')) : ''
      this.filterData.educational_program = localStorage.getItem('subject_educational_program') ? Number(localStorage.getItem('subject_educational_program')) : ''
      this.filterData.teachers = localStorage.getItem('teachers') ? JSON.parse(localStorage.getItem('teachers')) : []
      this.filterData.first_semestr = localStorage.getItem('subject_first_semester') ? Number(localStorage.getItem('subject_first_semester')) : ''
      this.filterData.final_semester = localStorage.getItem('subject_final_semester') ? Number(localStorage.getItem('subject_final_semester')) : ''

      this.tab = !this.tab
    },
    getSubject(val){
      this.name_subjects = []
      if (val.length > 0){
        http.get('/methodist/subject/names-subjects/')
            .then(response => {
              response.data.map(i => {
                this.name_subjects.push(i)
              })
            })
            .catch(error => {
              console.log(error)
            })
      }
    },
    changeItems(limit){
      localStorage.setItem('limit', limit)
      localStorage.setItem('currentPage', 0)
      this.getListSubject()
    },
    openModelSubject(){
      this.changeModal = false
      this.showDialog = true
      this.cleanForm()
    },
    cleanForm(){
      this.selectedSubject.name = ''
      this.selectedSubject.finallySubject = false
      this.selectedSubject.teachers = []
      this.selectedSubject.form_of_control = ''
      this.selectedSubject.hours = null
      this.selectedSubject.group = ''
      this.selectedSubject.educational_program = ''
      this.selectedSubject.first_semestr = null
      this.selectedSubject.last_semestr = null
      this.selectedSubject.link_to_Moodle = ''
      this.selectedSubject.form_of_control = ''
    },
    getListSubject(){
      this.loading = true
      this.itemsPerPage = parseInt(localStorage.getItem('limit')) ||  5
      this.page = parseInt(localStorage.getItem('currentPage')) ||  0
      this.filterData.name_subject = localStorage.getItem('name_subject') ? localStorage.getItem('name_subject') : ''
      http.get(`/methodist/subject/?offset=${this.page}&limit=${this.itemsPerPage}`, {params:{
          subject:localStorage.getItem('name_subject') ? localStorage.getItem('name_subject') : '',
          group:localStorage.getItem('subject_group') ? localStorage.getItem('subject_group') : '',
          teachers:localStorage.getItem('teachers') ? JSON.parse(localStorage.getItem('teachers')) : [],
          semester:localStorage.getItem('subject_first_semester') ? localStorage.getItem('subject_first_semester') : '',
          educational_program: localStorage.getItem('subject_educational_program') ? localStorage.getItem('subject_educational_program') : '',
          final_semester:localStorage.getItem('subject_final_semester') ? localStorage.getItem('subject_final_semester') : '',
          ordering:localStorage.getItem('sort') ? localStorage.getItem('sort') : 'fat'
        }})
        .then(response => {
          this.loading = false
          this.allPages = response.data.count
          this.listSubject = response.data.results
        })
    },
    getData(){
      http.get('/methodist/subject/teachers/')
        .then(response => {
          response.data.map(i => {
            this.teachers.push(i)
          })
        })
    },
    createSubject(){
      this.changeModal = false
      const data = {
        name_subject: this.selectedSubject.name,
        hours: this.selectedSubject.hours,
        semester: this.selectedSubject.first_semestr,
        final_semester: this.selectedSubject.last_semestr,
        form_of_control: this.selectedSubject.form_of_control,
        url_on_moodle: this.selectedSubject.link_to_Moodle,
        finally_subject: this.selectedSubject.finallySubject,
        group: this.selectedSubject.group,
        teachers: this.selectedSubject.teachers
      }
      this.loading = true
      http.post('/methodist/subject/', data)
        .then(response => {
          this.allPages += 1
          this.listSubject.push(response.data)
          this.loading = false
          this.cleanForm()
          this.showDialog = false
          this.getListSubject(0)
          this.page = 0
          const info = {'text':'Предмет створено', 'color':'green'}
          this.actionOpenSnack(info)
          })
        .catch(error => {
          console.log(error)
        })
    },
    openModalForDelete(id){
      this.idDelete = id
      this.actionOpenModal()
    },
    deleteSubject(){
      this.loading = true
      http.delete(`/methodist/subject/${this.idDelete}/`)
        .then(response => {
          this.listSubject = this.listSubject.filter((p) => p.id !== this.idDelete)
          this.loading = false
          this.actionCloseModal()
          const info = {'text':'Предмет видаленно', 'color':'red'}
          this.actionOpenSnack(info)
        })
        .catch(error => {
          console.log(error)
        })
    },
    openModalForChange(id, group, educational_program, teachers, name_subject, hours, semester, final_semester, form_of_control, finallySubject, url){
      console.log(name_subject.split(' ').slice(0, -1))
      this.cleanForm()
      this.changeModal = true
      this.showDialog = true
      this.selectedSubject.teachers = []
      teachers.map(i => {
        this.selectedSubject.teachers.push(i.id)
      })
      this.idSubject = id
      this.selectedSubject.group = group
      this.selectedSubject.name = name_subject.split(' ').slice(0, -1).join(' ')
      this.selectedSubject.hours = hours
      this.selectedSubject.link_to_Moodle = url
      this.selectedSubject.first_semestr = semester
      this.selectedSubject.educational_program = educational_program
      this.selectedSubject.last_semestr = final_semester
      this.selectedSubject.form_of_control = form_of_control
      this.selectedSubject.finallySubject = finallySubject
      console.log(this.selectedSubject.name + ` (${this.selectedSubject.group.name})`)
      console.log(this.selectedSubject.group.name)
    },
    changeSubject(){
      const data = {
        name_subject: this.selectedSubject.name + ` (${this.selectedSubject.group.name})`,
        hours: this.selectedSubject.hours,
        semester: this.selectedSubject.first_semestr,
        final_semester: this.selectedSubject.last_semestr,
        form_of_control: this.selectedSubject.form_of_control,
        url_on_moodle: this.selectedSubject.link_to_Moodle,
        finally_subject: this.selectedSubject.finallySubject,
        educational_program: this.selectedSubject.educational_program,
        group: this.selectedSubject.group.id,
        teachers: this.selectedSubject.teachers
      }
      console.log(data)
      this.loading = true
      http.put(`/methodist/subject/${this.idSubject}/`, data)
        .then(response => {
          let find = this.listSubject.find(i => {
            return i.id === this.idSubject
          })

          let index = this.listSubject.indexOf(find)

          this.listSubject[index].group = response.data.group
          this.listSubject[index].hours = response.data.hours
          this.listSubject[index].loans = response.data.loans
          this.listSubject[index].semester = response.data.semester
          this.listSubject[index].final_semester = response.data.final_semester
          this.listSubject[index].finally_subject = response.data.finally_subject
          this.listSubject[index].name_subject = response.data.name_subject
          this.listSubject[index].url_on_moodle = response.data.url_on_moodle
          this.listSubject[index].form_of_control = response.data.form_of_control
          this.listSubject[index].educational_program = response.data.educational_program
          this.listSubject[index].teachers = response.data.teachers

          this.cleanForm()
          this.loading = false
          this.changeModal = false
          this.showDialog = false
          const info = {'text':'Предмет відредагований', 'color':'orange'}
          this.actionOpenSnack(info)
        })
        .catch(error => {
          console.log(error)
        })
    },
    closeModalForChange(){
      this.showDialog = false
    }
  },
  watch:{
    'selectedSubject.form_of_control'(val){
      if (val === 'Практика' || val === 'Курсова'){
        this.disableSemester = true
        this.disableFinishSubject = true
        this.selectedSubject.last_semestr = null
        this.selectedSubject.finallySubject = true
      } else {
        this.disableSemester = false
        this.disableFinishSubject = false
        // this.selectedSubject.finallySubject = false
      }
    },
    page(val){
      localStorage.setItem('currentPage', val)
      this.getListSubject(val)
    },
    'filterData.name_subject'(val){
      if (val === null){
        localStorage.setItem('name_subject', '')
      } else {
        localStorage.setItem('name_subject', val)
      }
    },
    'filterData.group'(val){
      if (val === null){
        localStorage.setItem('subject_group', '')
      } else {
        localStorage.setItem('subject_group', val)
      }
    },
    'filterData.teachers'(val){
      if (val === null){
        localStorage.setItem('teachers', [])
      } else {
        localStorage.setItem('teachers', JSON.stringify(val))
      }
    },
    'filterData.first_semestr'(val){
      if (val === null){
        localStorage.setItem('subject_first_semester', '')
      } else {
        localStorage.setItem('subject_first_semester', val)
      }
    },
    'filterData.final_semester'(val){
      if (val === null){
        localStorage.setItem('subject_final_semester', '')
      } else {
        localStorage.setItem('subject_final_semester', val)
      }
    },
    'filterData.educational_program'(val){
      console.log(val)
      if (val === null){
        localStorage.setItem('subject_educational_program', '')
      } else {
        localStorage.setItem('subject_educational_program', val)
      }
    },
    sortDesc(val){
      if (val){
        this.sortBy = '-' + this.sortBy
      }
      localStorage.setItem('sort', this.sortBy)
      this.page = 0
      this.getListSubject(0)
    },
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
  .main{
    max-width: 1400px;
  }
  .table thead th{
    color: white;
  }
  .filterFilds{
    width: 80%;
    margin: 0 auto;
    margin-top: 10px;
  }
</style>