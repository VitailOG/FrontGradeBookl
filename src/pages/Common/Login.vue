<template>
  <v-container class="wrapper" fill-height>
    <v-sheet outlined rounded>
      <v-card outlined>
        <v-card-title>
          <h4 style="color: #343434" class="blocktext">Авторизація</h4>
        </v-card-title>
        <v-card-text>
          <LoginForm @clickLogin="clickLogin"/>
        </v-card-text>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import axios from 'axios'
import LoginForm from "../../components/Login/LoginForm";

export default {
  name: "Login",
  components:{
    LoginForm
  },
  methods:{
    clickLogin(data){
      console.log(data)
      const dataLogin = {
        username: data.username,
        password: data.password
      }
      axios.post('http://192.168.0.102:8000/auth/api/token/', dataLogin)
        .then(response => {
          console.log(response.data.student_id)
          localStorage.setItem('refresh', response.data.refresh)
          localStorage.setItem('access', response.data.access)
          localStorage.setItem('permission', response.data.permission)
          if (response.data.permission === 'Студент'){
            this.$router.push(`/personal/student/${response.data.student_id}/`)
          } else if(response.data.permission === 'Методист'){
            this.$router.push('/subjects')
          }
        })
        .catch(error => {
          console.log(error)
        })
        this.username = this.password = ''
    }
  }
}
</script>

<style scoped>
  .wrapper{
    max-width: 500px;
    height: 80%;
  }
  .blocktext{
    margin-left: auto;
    margin-right: auto;
    width: 7em
  }
</style>