import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../pages/Common/Login";
import NotFound from "../pages/Common/NotFound";

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'login',
    component: Login,
    meta:{
      beforeEach(to, from, next){
        console.log(to, from, next)
      }
    }
  },
  {
    path:'/without-group',
    name:'without-group',
    component: () => import ('../pages/Methodist/WithoutGroup')
  },
  {
    path:'/methodist',
    name:'methodist',
    component: () => import ('../pages/Methodist/Methodist')
  },
  {
    path: '/students',
    name: 'students',
    component: () => import('../pages/Methodist/StudentListPage')
  },
  {
    path:'/subjects',
    name:'subject',
    component: () => import('../pages/Methodist/SubjectPage')
  },
  {
    path:'/detail-subject/:id',
    name:'detail_subject',
    component: () => import('../pages/Methodist/DetailSubject')
  },
  {
    path:'/rating-students/:id/:semester',
    name:'rating',
    props: true,
    component: () => import('../pages/Methodist/RatingPage')
  },
  {
    path:'/group',
    name:'group',
    component: () => import('../pages/Methodist/Groups')
  },
  {
    path: '/rating-list/:id/:semester',
    name: 'rating_list',
    component: () => import('../pages/Methodist/RatingList')
  },
  {
    path:'/year-rating/:id',
    name:'year_rating',
    component: () => import('../pages/Methodist/YearRating')
  },
  {
    path:'/student/:id/:educational_program_id',
    name:'student',
    component: () => import('../pages/Methodist/PersonalStudent')
  },
  {
    path:'/common-rating/:id',
    name:'common_rating',
    component: () => import('../pages/Methodist/CommonRating')
  },
  {
    path: '/personal/student/:id',
    name:'personal_student',
    component: () => import('../pages/Student/Student')
  },
  {
    path: '*',
    name:'notFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
