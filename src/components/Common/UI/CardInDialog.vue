<template>
  <v-card>
    <v-card-title class="text-h5 justify-center">
      <slot name="header"></slot>
    </v-card-title>
    <v-card-text>
      <slot name="body"></slot>
    </v-card-text>
    <v-card-actions class="justify-center">
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "CardInDialog"
}
</script>

<style scoped>

</style>