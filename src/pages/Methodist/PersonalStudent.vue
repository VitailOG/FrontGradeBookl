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
              <v-tab>
                Додаткові бали
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
            <v-divider></v-divider>
            <tr style="float: right; margin-right: 70px; margin-top: 10px; margin-bottom: 10px;">
              <td>Загальний бал {{ total_rating }}</td>
            </tr>
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
          <v-tab-item>
            <v-data-table
                :items="extra_data"
                :headers="headersForExtra"
                hide-default-footer
            >
              <template v-slot:item="row">
                <tr>
                  <td>{{ row.item.id }}</td>
                  <td>{{ row.item.point }}</td>
                  <td>{{ row.item.text }}</td>
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
import http from "../../http/index";
export default {
  name: "PersonalStudent",
  data:() => ({
    index:1,
    mainTab:null,
    semesters:[],
    selectSemester:null,
    listPersonalData:[],
    extra_data:[],
    yearRatingList:[],
    total_rating:null,
    headers:[
      { text: 'Предмет', value: 'subject', sortable:false},
      { text: 'Оцінка 5', value: 'rating_5', sortable:false},
      { text: 'Оцінка 12', value: 'rating_12', sortable:false},
      { text: 'Перездача', value: 'retransmission', sortable:false},
      { text: 'Зараховано', value: 'credited', sortable:false},
      { text: 'Дата', value: 'data', sortable:false},
      { text: 'Форма контроля', value: 'form_of_control', sortable:false},
      { text: 'Викладач', value: 'teacher', sortable:false}
    ],
    headersForExtra:[
      { text: 'ID', value: 'id', sortable:false},
      { text: 'Бал', value: 'point', sortable:false},
      { text: 'Текст', value: 'text', sortable:false},
    ]
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
      this.yearRatingList = []
      this.listPersonalData = []
      http.get(`/student/detail/`, {params:{semester:val, student_id:this.$route.params.id, educational_program_id:this.$route.params.educational_program_id}})
          .then(response => {
            this.index++
            this.extra_data = response.data.extra_points
            this.total_rating = response.data.total_rating
            this.listPersonalData = response.data.ratings
            // response.data.ratings.map(i => {
            //   i.rating_set.map(j => {
            //     if (!j.is_annual){
            //       this.listPersonalData.push(i)
            //     }
            //   })
            // })
            // response.data.ratings.map(i => {
            //   i.rating_set.map(j => {
            //     if (j.is_annual){
            //       this.yearRatingList.push(i)
            //     }
            //   })
            // })
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