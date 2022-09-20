// 过滤对象中属性为空的值
export function filterData(Data) {
  let params = {};
  for (const item in Data) {
    if (Data[item]) {
      params[item] = Data[item];
    }
  }
  return params;
}

// UTC时间转为北京时间 '2022-09-16T17:44:08Z' => '2022/9/16 16:43:40'
export function utc2beijing(utc_datetime) {
  return new Date(utc_datetime).toLocaleString().replace(/\//g, '-');
} 
