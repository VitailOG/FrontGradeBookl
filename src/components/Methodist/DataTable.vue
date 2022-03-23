<template>
  <tr>
    <td>
      <p v-for="i in data.item.teachers">
        {{ i.username }}
      </p>
    </td>
    <td>{{ data.item.group.name }}</td>
    <td>{{ data.item.name_subject }}</td>
    <td>{{ data.item.hours }}</td>
    <td>{{ data.item.loans }}</td>
    <td>{{ data.item.semester }}</td>
    <td>{{ data.item.final_semester }}</td>
    <td>{{ data.item.form_of_control }}</td>
    <td>{{ data.item.finally_subject }}</td>
    <td>{{ data.item.url_on_moodle }}</td>
    <td>
      <v-row>
        <v-col cols="4" sm="12" md="6">
          <v-btn class="success" @click="openChange(
                    data.item.id,
                    data.item.group,
                    data.item.teachers,
                    data.item.name_subject,
                    data.item.hours,
                    data.item.semester,
                    data.item.final_semester,
                    data.item.form_of_control,
                    data.item.finally_subject,
                    data.item.url_on_moodle
                )">Редагувати</v-btn>
        </v-col>
      </v-row>
    </td>
    <td>
      <v-row>
        <v-col>
<!--          <v-btn class="error" @click="openModalForDelete(data.item.id)">Видалити</v-btn>-->
          <v-btn class="error" @click="openDelete(data.item.id)">Видалити</v-btn>
        </v-col>
      </v-row>
    </td>
  </tr>
</template>

<script>
export default {
  name: "DataTable",
  props:['data'],
  data:() => ({
    id:null,
    group:'',
    teachers:[],
    name_subject:'',
    hours:null,
    semester:null,
    final_semester:null,
    form_of_control:'',
    finally_subject:false,
    url_on_moodle:''
  }),
  methods:{
    openDelete(data){
      console.log(data)
      this.$emit('openModalForDelete')
    },
    openChange(id, group, teachers, name_subject, hours, semester, final_semester, form_of_control, finally_subject, url_on_moodle){
      const data = {
        id: id,
        group: group.id,
        teachers:teachers.id,
        name_subject:name_subject,
        hours:hours,
        semester:semester,
        final_semester:final_semester,
        form_of_control:form_of_control,
        finally_subject:finally_subject,
        url_on_moodle:url_on_moodle
      }
      this.$emit('updateData', data)
    }
  }
}
</script>

<style scoped>

</style>