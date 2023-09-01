export default{
  // 定义日期格式化的函数，这里的date是传进来的日期，rule代表日期规则
  formateDate(date, rule){
    // 这里如果传进来了规则，那就是传进来的规则，如果没有就给一个默认的规则
    let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
    // 这里做一个匹配，RegExp.$1获取的就是通过y+获取到的年yyyy
    if(/(y+)/.test(fmt)){
      fmt = fmt.replace(RegExp.$1, date.getFullYear())
    }
    
    // 通过for循环遍历进行格式化
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    
    for(let k in o){
      if(new RegExp(`(${k})`).test(fmt)){
        const val = o[k] + ''
        fmt = fmt.replace(RegExp.$1,RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length))
      }
    }
    
    return fmt 
  },
  // 生成路由的方法
  generateRoute(menuList) {
    let routes = []
    // 递归函数 deepList 用于处理嵌套的菜单列表，以便生成对应的路由数组。
    const deepList = (list) => {
      while (list.length) {
        let item = list.pop()
        // 如果菜单项具有 action 属性，则将其转换为路由对象并添加到 routes 数组中
        if (item.action) {
          routes.push({
            name: item.menuName,
            path: item.path,
            meta: {
              title: item.menuName
            },
            component: item.component
          })
        }
        // 如果菜单项具有 children 属性但没有 action 属性，则递归调用 deepList 函数处理子菜单
        if (item.children && !item.action) {
          deepList(item.children)
        }
      }
    }
    deepList(menuList)
    return routes
  }
}