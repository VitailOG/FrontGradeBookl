<template>
  <div>
    <p style="color: white">
      {{ list }}
    </p>
  </div>
</template>

<script>
import http from "../../http/index";

export default {
  name: "Methodist",
  data:() => ({
    list:[]
  }),
  mounted() {
    this.getStudent()
  },
  methods:{
    getStudent(){
      http.get('/methodist/student/without-group/')
        .then(response => {
          console.log(response)
          this.list = response.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>

</style>