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
  }
}