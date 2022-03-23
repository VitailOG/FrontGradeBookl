<template>
  <v-app>
    <Header :index="index"/>
    <v-main class="mainWrapper">
      <router-view></router-view>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script>
import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
export default {
  name: 'App',
  components: {Header, Footer},

  data: () => ({
    index:1
  }),
};
</script>

<style>
  .mainWrapper{
    background: white;
  }
</style>