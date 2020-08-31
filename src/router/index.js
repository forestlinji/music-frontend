import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import RandomUser from '../components/question/Random.vue'
import Login from '../components/user/Login.vue'
import Search from '../components/song/Search.vue'
import Signup from '../components/user/Signup.vue'
// import Active from '../components/user/Active.vue'
import Forget from '../components/user/Forget.vue'
// import Reset from '../components/user/Reset.vue'
// import UserInfo from '../components/user/UserInfo.vue'
// import QuestionBox from '../components/user/QuestionBox.vue'
// import AllUser from '../components/userAdmin/AllUser.vue'
// import Admin from '../components/userAdmin/Admin.vue'
// import Report from '../components/report/Report.vue'
// import Publish from '../components/message/Publish.vue'
// import Message from '../components/message/Message.vue'
// import Test from '../components/user/test.vue'
import Song from '../components/song/Song.vue'
import ChangePwd from '../components/user/changePwd.vue'
import SongInfo from '../components/song/SongInfo.vue'
import Random from '../components/song/Random.vue'
import Collect from '../components/collect/Collect.vue'
import MusicList from '../components/musiclist/Musiclist.vue'
import MusicListInfo from '../components/musiclist/MusicListInfo.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      // {path:'/random',component: RandomUser},
      {
        path: '/search',
        component: Search
      },
      {
        path: '/signup',
        component: Signup
      },
      // {path:'/active',component: Active},
      {
        path: '/forget',
        component: Forget
      },
      // {path:'/reset',component: Reset},
      // {path:'/userInfo',component: UserInfo},
      // {path:'/questionBox',component: QuestionBox},
      // {path:'/allUser',component: AllUser},
      // {path:'/deleteAdmin',component: Admin},
      // {path:'/reportList',component: Report},
      // {path:'/publish',component: Publish},
      // {path:'/message',component: Message},
      // {path:'/test',component: Test},
      {
        path: '/song',
        component: Song
      },
      {
        path: '/changePwd',
        component: ChangePwd
      },
      {
        path: '/songInfo',
        component: SongInfo
      },
      {
        path: '/random',
        component: Random
      },
      {
        path: '/collect',
        component: Collect
      },
      {
        path: '/musiclist',
        component: MusicList
      },
      {
        path: '/musiclistInfo',
        component: MusicListInfo
      }
    ]
  },
  {
    path: '/login',
    component: Login
  }

]

const router = new VueRouter({
  routes
})
export default router