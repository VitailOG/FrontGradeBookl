<template>
  <v-col cols="6" xs="6" sm="4" md="3" lg="3">
    <v-card>
      <v-img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
      >
      </v-img>
      <v-card-text>
        <p>{{ list.id }}</p>
        <p>{{ list.first_name }}</p>
        <p>{{ list.last_name }}</p>
        <p>{{ list.surname }}</p>
      </v-card-text>
      <v-card-actions>
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
                  :items="formGroups"
                  item-value="id"
                  item-text="name"
              >
              </v-select>
              <v-select
                  label="Освітня програма"
                  v-model="formProgram"
                  :items="formPrograms"
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
                      label="Дата народження"
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
                  color="green darken-1"
                  text
                  @click="close"
              >
                Закрити
              </v-btn>
              <v-btn
                  color="green darken-1"
                  text
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
        <v-btn @click="dialog=true" class="primary">
          Додати
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import http from "../../http/index";
export default {
  name: "CardStudent",
  data:() => ({
    dialog:false,
    loading:false,
    menu:false,
    formEductions:['Контрактна', 'Державна'],
    formEduction:'',
    formGroup:'',
    formProgram:'',
    date:'',
  }),
  props:['list', 'formPrograms', 'formGroups'],
  methods:{
    save (date) {
      this.$refs.menu.save(date)
    },
    saveDate(){
      const dataForm = {
        group: this.formGroup,
        educational_program: this.formProgram,
        form_education: this.formEduction,
        year_entry: this.date
      }
      const idData = {
        id : this.list.id
      }
      this.dialog = true
      http.post(`/methodist/student/create/${this.list.id}/`, dataForm)
          .then(response => {
            console.log(response)
            this.dialog = false
          })
          .catch(error => {
            console.log(error)
            alert('Error')
          })
      this.$emit('clickSave', idData)
      this.formEduction = ''
      this.formGroup = ''
      this.formProgram = ''
      this.dialog = false
    },
    close(){
      this.formEduction = ''
      this.formGroup = ''
      this.formProgram = ''
      this.dialog = false
    }
  }
}
</script>

<style scoped>
.v-card{
  background: #715398ad;
}
</style>