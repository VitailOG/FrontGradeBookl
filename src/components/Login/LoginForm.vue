<template>
  <v-form>
    <v-row>
      <v-col cols="12">
        <v-text-field
            prepend-icon="mdi-account"
            hide-details
            placeholder="Логін"
            v-model="username"
            color="green"
            class="text--white"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
            prepend-icon="mdi-lock"
            class="input"
            placeholder="Пароль"
            hide-details
            color="green"
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show1 = !show1"
            :type="show1 ? 'text' : 'password'"
        ></v-text-field>
      </v-col>
      <v-col align="center">
        <v-btn class="success" @click="login">
          Увійти
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  name: "LoginForm",
  data: () => ({
    show1:false,
    username:'',
    password:''
  }),
  methods:{
    login(){
      const loginData={
        username: this.username,
        password: this.password
      }
      this.$emit('clickLogin', loginData)
    }
  }
}
</script>

<style>
  .text-green input {
    color: white !important;
  }
</style>