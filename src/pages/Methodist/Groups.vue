<template>
  <div>
    <v-row class="mt-6 mb-4" style="max-width: 900px; margin: 0 auto">
      <v-expansion-panels popout>
        <v-expansion-panel
            v-for="i in getGroups"
            :key="i.id"
        >
          <v-expansion-panel-header>{{ i.name }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <router-link :to="{name:'common_rating', params:{id:i.id}}" class="link" style="margin-left: 4.5%; font-size: 15px">
              Загальний бал
            </router-link>
            <v-expansion-panels popout class="iconAccordion">
              <v-expansion-panel>
                <v-expansion-panel-header>Рейтинг</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-expansion-panel-content
                      v-for="j in i.semesters"
                      :key="j"
                  >
                    <router-link :to="{name:'rating_list', params:{id:i.id, semester:j}}" class="link">
                      {{ j }} семестр
                    </router-link>
                  </v-expansion-panel-content>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-content>
<!--          <v-expansion-panel-content-->
<!--            v-for="j in i.semesters"-->
<!--            :key="j"-->
<!--          >-->
<!--            <router-link :to="{name:'rating_list', params:{id:i.id, semester:j}}" class="link">-->
<!--              {{ j }} семестр-->
<!--            </router-link>-->
<!--          </v-expansion-panel-content>-->
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  name: "Groups",
  data:() => ({
    list_group:[]
  }),
  mounted() {
    this.actionGetGroup()
  },
  methods:{
    ...mapActions(['actionGetGroup'])
  },
  computed:{
    ...mapGetters(['getGroups'])
  }
}
</script>

<style scoped>
  .link{
    text-decoration: none;
    color: black;
  }
  #app > div > main > div > div > div > div > div.v-expansion-panel.v-expansion-panel--active.v-item--active > div > div > div{
    position: inherit;
  }
</style>