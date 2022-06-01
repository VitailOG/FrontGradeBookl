<template>
    <tr>
      <td>{{ data.id }}</td>
      <td>{{ data.user.first_name }}</td>
      <td>{{ data.user.last_name }}</td>
      <td v-if="first_semester_rating.length === 0">Оцінка відсутня</td>
      <td
        v-else
        v-for="i in first_semester_rating"
        :key="i.id"
      >
        {{ i.rating_5 }}
      </td>
      <td v-if="second_semester_rating.length === 0 && first_semestr != second_semestr">Оцінка відсутня</td>
      <td
          v-else
          v-if="first_semestr != second_semestr"
          v-for="i in second_semester_rating"
          :key="i.id"
      >
        {{ i.rating_5 }}
      </td>
      <td>
        <v-text-field
            v-model="rating.rating_5"
            placeholder="оцінка 5 бальної системи"
        >
        </v-text-field>
      </td>
      <td>
        <v-text-field
            v-model="rating.rating_12"
            placeholder="оцінка 12 бальної системи"
        ></v-text-field>
      </td>
      <td>
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
                v-model="rating.date"
                label="Дата"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="rating.date"
              :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
              min="1950-01-01"
              @change="save"
          ></v-date-picker>
        </v-menu>
      </td>
      <td>
        <v-checkbox
            v-model="rating.retransmission"
        >
        </v-checkbox>
      </td>
      <td>
        <v-checkbox
            v-model="rating.credited"
        >
        </v-checkbox>
      </td>
      <td>
        <v-select
            v-model="rating.teacher"
            placeholder="Викладач"
            :items="teachersInForm"
            item-text="username"
            item-value="id"
        >
        </v-select>
      </td>
      <td>
        <v-row>
          <v-col v-if="!activateButton">
            <v-btn class="warning" @click="clickUpdate">
              Редагувати
            </v-btn>
          </v-col>
          <v-col v-else>
            <v-btn class="success" @click="createYearRating(data.id)">
              Поставити
            </v-btn>
          </v-col>
        </v-row>
      </td>
    </tr>
</template>

<script>
export default {
  name: "YearRatingForm",
  props:['data', 'id', 'teachers', 'ratings', 'first_semestr', 'second_semestr', 'ratingsReadOnly'],
  data:() => ({
    activateButton:true,
    menu:false,
    rating_first:null,
    rating_second:null,
    first_semester_rating:[],
    second_semester_rating:[],
    rating:{
      id:null,
      rating_5:null,
      rating_12:null,
      retransmission:false,
      credited:false,
      date:'',
      teacher:null
    },
  }),
  mounted() {
    this.listStudent()
  },
  computed:{
    teachersInForm(){
      if (this.teachers.length === 1){
        this.rating.teacher = this.teachers[0].id
        return this.teachers
      } else {
        return this.teachers
      }
    }
  },
  methods:{
    save (date) {
      this.$refs.menu.save(date)
    },
    listStudent() {
      this.ratings.map(i => {
        if (i.user === this.data.id && i.is_annual_assessment) {
          this.rating.id = i.id
          this.rating.rating_5 = i.rating_5 === 0 ? null : i.rating_5
          this.rating.rating_12 = i.rating_12
          this.rating.date = i.date_rating
          this.rating.credited = i.credited
          this.rating.retransmission = i.retransmission
          this.rating.teacher = i.teacher
          this.activateButton = false
        }
      })
      this.ratingsReadOnly.map(i => {
        if (this.first_semestr != this.second_semestr) {
          if (i.user === this.data.id && i.semester === this.second_semestr) {
            this.second_semester_rating.push(i)
          }
        }
        if (i.user === this.data.id && i.semester === this.first_semestr){
          this.first_semester_rating.push(i)
        }
      })
    },
    createYearRating(id){
      this.activateButton = false
      const data = {
        date_rating: this.rating.date,
        rating_5: this.rating.rating_5,
        rating_12: this.rating.rating_12,
        retransmission: this.rating.retransmission,
        credited: this.rating.credited,
        semester: this.second_semestr,
        teacher:this.rating.teacher,
        user: id,
        subject: this.$route.params.id,
        is_annual_assessment:true
      }
      this.$emit('postRating', data)
    },
    clickUpdate(){
      let data = {
        id: this.rating.id,
        date_rating: this.rating.date,
        rating_5: this.rating.rating_5,
        rating_12: this.rating.rating_12,
        retransmission: this.rating.retransmission,
        credited: this.rating.credited,
        semester: this.semester,
        teacher:this.rating.teacher,
        user: this.data.id,
        subject: this.id
      }
      this.$emit('clickUpdateDataRating', data)
    }
  }
}
</script>

<style scoped>

</style>