<template>
  <div id="app">
    <v-dialog
        v-model="showDialog"
        persistent
        max-width="430"
    >
      <v-card>
        <v-card-title>Редагування</v-card-title>
        <v-card-text>
          <v-text-field
            label="Оцінка"
            v-model="dataChange.rating"
          ></v-text-field>
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
                  v-model="dataChange.date"
                  label="Дата виставлення"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="dataChange.date"
                :active-picker.sync="activePicker"
                :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="save"
            ></v-date-picker>
          </v-menu>
          <v-checkbox
              v-model="dataChange.retransmission"
              label="Зараховано"
          ></v-checkbox>
          <v-checkbox
              v-model="dataChange.credit"
              label="Перездача"
          ></v-checkbox>
          <v-select
              v-model="dataChange.teacher"
              label="Викладач"
              :items="teachers"
              item-value="id"
              item-text="username"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showDialog=false">
            Скасувати
          </v-btn>
          <v-btn @click="saveData">
            Зберегти
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
        :headers="headers1"
        :items="commonList"
        :key="index"
        hide-default-footer
    >
      <template v-slot:item="row">
          <tr @click="toggle(row.item.user.id, row.item.id)">
            <td>{{ row.item.id }}</td>
            <td>{{ row.item.user.last_name }}</td>
            <td>{{ row.item.user.first_name }}</td>
            <td>{{ row.item.user.surname }}</td>
            <td>{{ row.item.form_education }}</td>
            <td>{{ row.item.total_count ? row.item.total_sum / row.item.total_count : 'Оцінка відсутня' }}</td>
          </tr>
          <tr v-if="opened.includes(row.item.user.id)">
            <td colspan="12">
              <v-data-table
                style="width: 60%; margin-left: 17%"
                :headers="headers2"
                :items="commonList"
                hide-default-footer
                :key="index2"
              >
                <template v-slot:item="row">
                  <tr v-if="user_id === i.user" v-for="i in row.item.user_rating" :key="i.id">
                    <td>{{ i.name_subject }}</td>
                    <td>{{ i.rating_5 }}</td>
                    <td>{{ i.date_rating }}</td>
                    <td>
                      <span v-if="i.retransmission">
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
                    <td>
                      <span v-if="i.credited">
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
                    <td>{{ i.semester }}</td>
                    <td>
                      <span v-for="j in i.subject.teachers" :key="i.id">
                        <span v-if="j.id === i.teacher">
                          {{ j.last_name }}
                        </span>
                      </span>
                    <td>
                      <v-btn class="warning" @click="openModal(i.rating_5, i.date_rating, i.retransmission, i.credited, i.teacher, i.id)">
                        Редагувати
                      </v-btn>
                    </td>
                  </tr>
                </template>
                <template v-slot:no-data>
                  Немає даних
                </template>
              </v-data-table>
            </td>
          </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import http from "../../http/index";

export default {
  name: "CommonRating",
  data:() => ({
    teachers:[],
    menu:false,
    showDialog:false,
    user_id:null,
    index:1,
    index2:1,
    changeStateTable:false,
    commonList:[],
    nestedList:[],
    opened:[],
    dataChange:{
      rating_id:null,
      rating:null,
      date:'',
      credit:false,
      retransmission:false,
      teacher:''
    },
    headers1:[
      { text: 'ID', value: 'ID', sortable:false},
      { text: 'Прізвище', value: 'user__last_name', sortable:false},
      { text: "Ім'я", value: 'user__first_name', sortable:false},
      { text: "По батькові", value: 'user__surname', sortable:false},
      { text: "Форма навчання", value: 'form_control', sortable:false},
      { text: "Загальний бал", value: 'main_rating', sortable:false},
    ],
    headers2:[
      { text: 'Назва предмета', value: 'name_subject', sortable:false},
      { text: "Оцінка", value: 'rating', sortable:false},
      { text: "Дата виставлення", value: 'data', sortable:false},
      { text: "Зараховано", value: 'retransmission', sortable:false},
      { text: "Перездача", value: 'Credited', sortable:false},
      { text: "Семестр", value: 'semester', sortable:false},
      { text: "Викладач", value: 'teacher', sortable:false},
      { text: "Редагування", value: 'change', sortable:false},
    ],
  }),
  mounted() {
    this.getCommonRating()
  },
  methods:{
    saveData(){
      const data = {
        date_rating: this.dataChange.date,
        rating_5: this.dataChange.rating,
        retransmission: this.dataChange.retransmission,
        credited: this.dataChange.credit,
        teacher: this.dataChange.teacher
      }
      http.patch(`/methodist/rating/${this.dataChange.rating_id}/`, data)
        .then(response => {
          let old_rating = 0
          this.commonList.map(i => {
            i.user_rating.map(j => {
              if (j.id === response.data.id){
                old_rating = j.rating_5
                j.credited = response.data.credited
                j.retransmission = response.data.retransmission
                j.date_rating = response.data.date_rating
                j.rating_5 = response.data.rating_5
                j.teacher = response.data.teacher
              }
            })
          })
          this.commonList.map(i => {
            if (i.id === response.data.user){
              i.total_sum = (i.total_sum - old_rating) + response.data.rating_5
            }
          })
          this.showDialog = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    openModal(rating, data, retransmission, credited, id_teacher, id_rating){
      this.teachers = []
      this.commonList.map(i => {
        i.user_rating.map(j => {
          if(j.id === id_rating){
            console.log(j.subject.teachers)
            j.subject.teachers.map(k => {
              this.teachers.push(k)
            })
          }
        })
      })
      this.showDialog = true
      this.dataChange.rating_id = id_rating
      this.dataChange.rating = rating
      this.dataChange.date = data
      this.dataChange.retransmission = retransmission
      this.dataChange.credit = credited
      this.dataChange.teacher = id_teacher

    },
    save (date) {
      this.$refs.menu.save(date)
    },
    toggle(id, user_id){
      const index = this.opened.indexOf(id)
      this.opened = []

      if (index === -1){
        this.opened.push(id)
        this.user_id = user_id
      } else {
        this.opened.splice(index, 1)
        this.user_id = null
      }
      this.index++
    },
    getCommonRating(){
      http.get(`/methodist/group/${this.$route.params.id}/common-ratings-students/`)
        .then(response => {
          this.commonList = response.data
          // response.data.map(i => {
          //   i.user_rating.map(j => {
          //     j.subject.teachers.map(k => {
          //       this.teachers.push(k)
          //     })
          //   })
          // })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
  #app{
    margin: 0 auto;
    max-width: 1400px;
    margin-top: 50px;
    margin-bottom: 50px;
  }
</style>