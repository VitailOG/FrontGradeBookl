<template>
  <v-container class="wrapper" fill-height>
    <SnackBar/>
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
import {mapActions} from 'vuex'

import axios from 'axios'

import SnackBar from "../../components/Common/UI/SnackBar";
import LoginForm from "../../components/Login/LoginForm";

export default {
  name: "Login",
  components:{
    LoginForm,
    SnackBar
  },
  methods:{
    ...mapActions(['actionOpenSnack']),
    clickLogin(data){
      console.log(data)
      const dataLogin = {
        username: data.username,
        password: data.password
      }
      const obj = new FormData()
      obj.append('username', data.username)
      obj.append('password', data.password)

      axios.post('/auth/api/token/', obj)
      // axios.post('/api-token-auth/', dataLogin)
        .then(response => {
          // localStorage.setItem('token', response.data.token)
          // localStorage.setItem('permission', response.data.permission)
          localStorage.setItem('refresh', response.data.refresh)
          localStorage.setItem('access', response.data.access)
          localStorage.setItem('permission', response.data.permission)
          if (response.data.permission === 'Методист'){
            this.$router.push('/subjects')
          } else {
            this.$router.push(`/personal/student/${response.data.student_id}/`)
          }
          // console.log(response.data)
          // if (response.data.status_code === 401){
          //   const info = {'text':response.data.message, 'color':'red'}
          //   this.actionOpenSnack(info)
          // }
          // localStorage.setItem('refresh', response.data.refresh)
          // localStorage.setItem('access', response.data.access)
          // localStorage.setItem('permission', response.data.permission)
          // if (response.data.permission === 'Студент'){
          //   this.$router.push(`/personal/student/${response.data.student_id}/`)
          // } else if(response.data.permission === 'Методист'){
          // }

        })
        .catch(error => {
          console.log(error)
          const info = {'text':'Помилка в авторизація', 'color':'red'}
          this.actionOpenSnack(info)
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