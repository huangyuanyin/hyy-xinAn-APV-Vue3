// 过滤对象中属性为空的值
export function filterData(Data) {
  let params = {}
  for (const item in Data) {
    if (Data[item]) {
      params[item] = Data[item]
    }
  }
  return params
}

// UTC时间转为北京时间 '2022-09-16T17:44:08Z' => '2022/9/16 16:43:40'
export function utc2beijing(utc_datetime) {
  return new Date(utc_datetime).toLocaleString().replace(/\//g, '-')
}

// 获取当前日期
export const getNowDate = () => {
  var date = new Date()
  var sign2 = ':'
  var year = date.getFullYear() // 年
  var month = date.getMonth() + 1 // 月
  var day = date.getDate() // 日
  var hour = date.getHours() // 时
  var minutes = date.getMinutes() // 分
  var seconds = date.getSeconds() //秒
  var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
  var week = weekArr[date.getDay()]
  // 给一位数的数据前面加 “0”
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (day >= 0 && day <= 9) {
    day = '0' + day
  }
  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = '0' + minutes
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = '0' + seconds
  }
  return year + '-' + month + '-' + day + ' ' + hour + sign2 + minutes + sign2 + seconds
}

// 当前日期 - 特殊格式 (20230102133020)
export const getSpecialNowDate = () => {
  var date = new Date()
  var year = date.getFullYear() // 年
  var month = date.getMonth() + 1 // 月
  var day = date.getDate() // 日
  var hour = date.getHours() // 时
  var minutes = date.getMinutes() // 分
  var seconds = date.getSeconds() //秒
  // 给一位数的数据前面加 “0”
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (day >= 0 && day <= 9) {
    day = '0' + day
  }
  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = '0' + minutes
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = '0' + seconds
  }
  return year + month + day + hour + minutes + seconds
}

// 不定长文本逐个出现并不断循环的效果
export const textLoop = (text, idName) => {
  const delay = 100 // 每个字符出现的延迟时间（毫秒）
  const typingText = document.getElementById(idName)

  function type() {
    let i = 0
    const intervalId = setInterval(() => {
      if (i < text.length) {
        typingText.innerHTML += text.charAt(i)
        i++
      } else {
        clearInterval(intervalId)
        typingText.innerHTML = ''
        i = 0
      }
    }, delay)
  }
  type() // 初始执行一次
  setInterval(type, delay * text.length) // 循环执行
}
