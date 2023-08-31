import { createStore } from "vuex";
// 引入mutations
import mutations from './mutations'
// 引入持久化存储
import storage from "../utils/storage";

const state = {
  userInfo:storage.getItem('userInfo') || {},
  menuList:storage.getItem('menuList') || [],
  actionList:storage.getItem('actionList') || [],
}

export default createStore({
  state,
  mutations
})