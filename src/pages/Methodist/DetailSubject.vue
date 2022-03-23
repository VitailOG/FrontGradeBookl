 <template>
  <div>
    <v-container style="max-width: 400px; position: relative; float: left; margin-left: 50px">
      <v-list>
        <v-list-item-group v-model="model">
          <h2 align="left">{{ name_subject }} {{ this.$route.params.id }}</h2>
          <v-list-item
              v-for="i in semestrs"
              :key="i"
              style="border-bottom: 1px solid white; background: #EEEBEBFF;"
          >
            <v-list-item-content>
              <router-link :to="{name:'rating', params:{semester:i}}" class="link">
                <v-list-item-title  @click="semester(i)" style="color: black">
                  {{ i }} семестр
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
              v-if="form_control === 'Екзамен' || form_control === 'Залік'"
              style="border: 1px solid white; background: #EEEBEBFF"
          >
            <v-list-item-content>
              <router-link :to="{name:'year_rating', params:{id:$route.params.id}}" class="link">
                <v-list-item-title>
                  Річна оцінка
                </v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-container>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import http from "../../http/index";

export default {
  name: "DetailSubject",
  data:() => ({
    model:1,
    name_subject:'',
    form_control:'',
    semestrs:[],
    current:null
  }),
  mounted() {
    this.getSubject()
  },
  methods:{
    ...mapMutations(['CURRENT_SUBJECT', 'CURRENT_SEMESTER']),
    semester(item){
      this.CURRENT_SEMESTER(item)
    },
     getSubject(){
       http.get(`/methodist/subject/${this.$route.params.id}/`)
        .then(response => {
          console.log(response.data)
          this.name_subject = response.data.name
          this.form_control = response.data.form_of_control
          this.CURRENT_SUBJECT(response.data)
          if (response.data.initial_semester === response.data.last_semester){
            this.semestrs.push(response.data.initial_semester)
          } else {
            for(let i = response.data.initial_semester; i <= response.data.last_semester; i++){
              this.semestrs.push(i)
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
  .link{
    text-decoration: none;
    color: black;
  }
  .theme--light.v-list-item--active:before, .theme--light.v-list-item:focus:before {
    opacity: 0;
  }
  .theme--light.v-list-item--active:hover:before{
    opacity: 0.04;
  }
</style>