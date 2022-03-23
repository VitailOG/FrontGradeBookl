<template>
  <LoginForm @clickLogin="clickLogin"/>
</template>

<script>
import axios from 'axios'
import LoginForm from "../components/Login/LoginForm";

export default {
  name: "LoginPage",
  components:{
    LoginForm
  },
  methods:{
    clickLogin(data){
      const loginData = {
        username: data.username,
        password: data.password
      }
      axios.post('/auth/api/token/', loginData)
          .then(response => {
            localStorage.setItem('refresh', response.data.refresh)
            localStorage.setItem('access', response.data.access)
            localStorage.setItem('permission', response.data.permission)
            console.log(response.data.permission)
            if (response.data.permission === 'Студент'){
              this.$router.push('/student')
            } else if(response.data.permission === 'Методист'){
              this.$router.push('/methodist')
            }

            // switch (response.data.permission) {
            //   case 'student':
            //     this.$router.push('/student');
            //     break;
            //   case 'methodist':
            //     this.$router.push('methodist');
            //     break;
            // }

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

</style>