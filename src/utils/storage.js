/* localstorage持久化的二次封装 */

import config from "../config";

export default {
  setItem(key, val){
    let storage = this.getStorage()
    storage[key] = val
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  getItem(key){
    return this.getStorage()[key]
  },
  // 取出localstorage持久化存储的数据
  getStorage(){
    return JSON.parse(window.localStorage.getItem(config.namespace) || "{}")
  },
  clearItem(key){
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  clearAll(){
    window.localStorage.clear()
  }
}