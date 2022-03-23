<template>
<!--  <v-footer-->
<!--      dark-->
<!--      :style="{'background': 'rgb(20 10 34)'}"-->
<!--      padless-->
<!--      app-->
<!--      absolute-->
<!--      bottom-->

<!--  >-->
<!--    <v-card-->
<!--        flat-->
<!--        tile-->
<!--        :style="{'background': 'rgb(20 10 34)', 'width': '100%'}"-->
<!--        class="lighten-1 white&#45;&#45;text text-center"-->
<!--    >-->

<!--      <v-card-text class="white&#45;&#45;text pt-0 mt-3">-->
<!--        Default text-->
<!--      </v-card-text>-->

<!--      <v-divider></v-divider>-->

<!--      <v-card-text class="white&#45;&#45;text">-->
<!--        <strong>Тернопіль</strong> - {{ new Date().getFullYear() }}-->
<!--      </v-card-text>-->
<!--    </v-card>-->
<!--  </v-footer>-->
  <v-footer
      dark
      style="background: #198754"
      padless
      app
      absolute
      bottom

  >
    <v-card
        flat
        tile
        :style="{'background': '#198754', 'width': '100%'}"
        class="lighten-1 white--text text-center"
    >

      <v-card-text class="white--text pt-0 mt-3">
        Default text
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        <strong>Тернопіль</strong> - {{ new Date().getFullYear() }}
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>

</style>