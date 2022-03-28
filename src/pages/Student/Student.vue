<template>
  <div>
    <v-container style="max-width: 1400px; margin: 0 auto">
      <v-select
          :items="semesters"
          v-model="selectSemester"
      >
      </v-select>
      <v-card
          width="1400px"
          class="filter"
          overlay
      >
        <template>
          <v-tabs
              v-model="mainTab"
              align-with-title
          >
            <v-tab>
              Семестрові оцінки
            </v-tab>
            <v-tab>
              Річні оцінки
            </v-tab>
          </v-tabs>
        </template>
        <v-tabs-items
            v-model="mainTab"
        >
          <v-tab-item>
            <v-data-table
                hide-default-footer
                :headers="headers"
                :items="listPersonalData"
                :key="index"
            >
              <template v-slot:item="row">
                <tr>
                  <td>{{ row.item.name_subject }}</td>
                  <td>
                    {{ row.item.rating_set.length ?  row.item.rating_set[0].rating_5 : '-' }}
                  </td>
                  <td>{{ row.item.rating_set.length ?  row.item.rating_set[0].rating_12 ? row.item.rating_set[0].rating_12 : '-' : '-' }}</td>
                  <td v-if="row.item.rating_set.length">
                    <span v-if="row.item.rating_set[0].retransmission">
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
                  <td v-else>-</td>
                  <td v-if="row.item.rating_set.length">
                    <span v-if="row.item.rating_set[0].credited">
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
                  <td v-else>-</td>
                  <td>{{ row.item.rating_set.length ?  row.item.rating_set[0].date_rating : '-' }}</td>
                  <td>{{ row.item.form_of_control }}</td>
                  <td>{{ row.item.rating_set.length ?  row.item.rating_set[0].teacher.fio  : '-' }}</td>
                </tr>
              </template>
              <template v-slot:no-data>
                <p>Поки немає даних</p>
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <!--            переробити-->
            <v-data-table
                hide-default-footer
                :headers="headers"
                :items="listPersonalData"
                :key="index"
            >
              <template v-slot:item="row">
                <tr v-if="!(row.item.form_of_control === 'Курсова' || row.item.form_of_control === 'Практика')">
                  <td>{{ row.item.name_subject }}</td>
                  <td>{{ row.item.rating_set.length > 1 ? row.item.rating_set[1].rating_5 : '-' }}</td>
                  <td>{{ row.item.rating_set.length > 1 && row.item.rating_set[1].rating_12 ? row.item.rating_set[1].rating_12 : '-' }}</td>
                  <td v-if="row.item.rating_set.length > 1">
                    <span v-if="row.item.rating_set[1].retransmission">
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
                  <td v-else>-</td>
                  <td v-if="row.item.rating_set.length > 1">
                    <span v-if="row.item.rating_set[1].credited">
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
                  <td v-else>-</td>
                  <td>{{ row.item.rating_set.length > 1 ? row.item.rating_set[1].date_rating : '-' }}</td>
                  <td>{{ row.item.form_of_control }}</td>
                  <td>{{ row.item.rating_set.length > 1 ? row.item.rating_set[1].teacher.fio : '-' }}</td>
                </tr>
              </template>
              <template v-slot:no-data>
                <p>Поки немає даних</p>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import http from "../../http";

export default {
  name: "Student",
  data:() => ({
    index:1,
    mainTab:null,
    semesters:[],
    selectSemester:null,
    listPersonalData:[],
    headers:[
      { text: 'Предмет', value: 'subject'},
      { text: 'Оцінка 5', value: 'rating_5'},
      { text: 'Оцінка 12', value: 'rating_12'},
      { text: 'Перездача', value: 'retransmission'},
      { text: 'Зараховано', value: 'credited'},
      { text: 'Дата', value: 'data'},
      { text: 'Форма контроля', value: 'form_of_control'},
      { text: 'Викладач', value: 'teacher'}
    ],
  }),
  mounted() {
    this.getSemester()
  },
  methods:{
    getSemester(){
      http.get('/student/semesters/', {params:{student_id:this.$route.params.id}})
          .then(response => {
            response.data.semesters.map(i => {
              this.semesters.push(i)
            })
            this.selectSemester = this.semesters[0]
          })
          .catch(error => {
            console.log(error)
          })
    },
  },
  watch:{
    selectSemester(val){
      http.get(`/student/detail/`, {params:{semester:val}})
          .then(response => {
            console.log(response.data)
            this.index++
            this.listPersonalData = response.data
          })
          .catch(error => {
            console.log(error)
          })
    }
  },
}
</script>

<style scoped>

</style>