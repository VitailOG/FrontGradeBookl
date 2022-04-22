<template>
  <nav>
    <v-toolbar elevation="2" style="background: #198754">
      <v-container style="max-width: 1460px; display: flex">
      <v-app-bar-nav-icon>
        <v-img src="../../assets/logoGC.png" style="margin-left: 150px" width="180px"></v-img>
      </v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <div v-if="auth === 'Методист'" class="mt-2">
        <router-link to="/subjects" class="router">Предмети</router-link>
        <router-link to="/students" class="router">Студенти</router-link>
        <router-link to="/group" class="router">Групи</router-link>
        <router-link to="/without-group" class="router">Без групи</router-link>
        <router-link to="/" class="router">
          <v-btn class="success" @click="logout">
            Вийти
          </v-btn>
        </router-link>
      </div>
<!--        <router-link to="/log-in" class="router">-->
<!--          <v-btn class="success" @click="logout">-->
<!--            Вийти-->
<!--          </v-btn>-->
<!--        </router-link>-->
      <div v-else-if="auth === 'Студент'">
        <router-link to="/asd">
          Студент
        </router-link>
        <router-link to="/" class="router">
          <v-btn class="success" @click="logout">
            Вийти
          </v-btn>
        </router-link>
      </div>
      </v-container>
    </v-toolbar>
  </nav>
</template>

<script>

export default {
  name: "Header",
  props:['index'],
  data:() => ({
    color:{
      r:139,
      g:0,
      b:139
    },
  }),
  computed:{
    auth(){
      this.index++
      return localStorage.getItem('permission')
    }
  },
  methods:{
    logout(){
      localStorage.clear()
    },
    funcGenerateNumber(min, max){
      return Math.floor(
          Math.random() * (max - min + 1) + min
      )
    },
    funcHover(){
      this.color.r = this.funcGenerateNumber(1, 256);
      this.color.g = this.funcGenerateNumber(1, 256);
      this.color.b = this.funcGenerateNumber(1, 256);
    }
  }
}
</script>

<style scoped>
  .iconText{
    margin-left: 85px;
  }
  .router{
    text-decoration: none;
    color: white;
    margin-top: 10px;
    margin-right: 60px;
    font-size: 18px;
  }
</style>