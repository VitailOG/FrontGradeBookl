<template>
  <tr>
    <td>{{ data.id }}</td>
    <td>{{ data.user.first_name }}</td>
    <td>{{ data.user.last_name }}</td>
    <td>
      <v-text-field
          type="number"
          v-model="rating.rating_5"
          placeholder="оцінка 5 бальної системи"
      ></v-text-field>
    </td>
    <td>
      <v-text-field
          type="number"
          v-model="rating.rating_12"
          placeholder="оцінка 12 бальної системи"
      >
      </v-text-field>
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
            :active-picker.sync="activePicker"
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
          :items="teachers"
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
          <v-btn class="success" @click="clickRating">
            Поставити
          </v-btn>
        </v-col>
      </v-row>
    </td>
  </tr>
</template>

<script>

export default {
  name: "FormRating",
  props: ['data', 'ratings', 'teachers', 'index', 'id'],
  data:() => ({
    menu:false,
    activePicker: null,
    activateButton:true,
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
  methods:{
    save (date) {
      this.$refs.menu.save(date)
    },
    listStudent(){
      this.ratings.map(i => {
        console.log(i)
        if (i.user === this.data.id && i.is_annual_assessment === false){
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
    },
    clickRating(){
      this.activateButton = false
      let data = {
        date_rating:this.rating.date,
        rating_5: this.rating.rating_5 != null ? this.rating.rating_5 : 0,
        rating_12: this.rating.rating_12,
        retransmission: this.rating.retransmission,
        credited: this.rating.credited,
        semester: this.$route.params.semester,
        teacher:this.rating.teacher,
        user: this.data.id,
        subject: this.id,
        is_annual_assessment:false
      }
      console.log(data)
      this.$emit('clickPost', data)
    }
  },
}
</script>

<style scoped>

</style>