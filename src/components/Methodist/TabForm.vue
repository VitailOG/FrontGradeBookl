<template>
  <v-form>
    <v-autocomplete
        :items="name_subjects"
        v-model="filterData.name_subject"
        label="Назва предмета"
        hide-details
        item-text="name_subject"
        item-value="name_subject"
        class="filterFilds"
    >
    </v-autocomplete>
    <v-select
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
        v-model="filterData.first_semestr"
        :items="semester"
        label="Початковий семестр"
        hide-details
        class="filterFilds"
    ></v-select>
    <v-select
        v-model="filterData.final_semester"
        :items="semester"
        label="Кінцевий семестр"
        hide-details
        class="filterFilds"
    ></v-select>
    <v-row>
      <v-col align="center">
        <v-btn class="success my-4" @click="filter">
          Відправити
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

import http from "../../http/index";
export default {
  name: "TabForm",
  data:() => ({
    teachers:[],
    name_subjects:[],
    semester:[1, 2, 3, 4, 5, 6, 7, 8],
    filterData:{
      name_subject:'',
      group:'',
      teachers:[],
      first_semestr: '',
      final_semester:''
    },
  }),
  mounted() {
    this.actionGetGroup()
    this.getNameSubject()
  },
  computed:{
    ...mapGetters(['getGroups']),
  },
  methods:{
    ...mapActions(['actionGetGroup']),
    getNameSubject(){
      http.get('/methodist/subject/names-subjects/')
          .then(response => {
            response.data.map(i => {
              this.name_subjects.push(i)
            })
          })
          .catch(error => {
            console.log(error)
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
    filter(){
      let data = {
        subject:this.filterData.name_subject,
        group:this.filterData.group,
        semester:this.filterData.first_semestr,
        final_semester:this.filterData.final_semester
      }
      // this.actionFilter({
      //   subject:this.filterData.name_subject,
      //   group:this.filterData.group,
      //   semester:this.filterData.first_semestr,
      //   final_semester:this.filterData.final_semester
      // })
      // this.$emit('clickFilter', data)
    },
  }
}
</script>

<style scoped>
  .filterFilds{
    width: 80%;
    margin: 0 auto;
    margin-top: 10px;
  }
</style>