// 导出 对应的不同接口的URL地址
const configUrl = {
  Base_POC_URL: 'http://10.20.86.27:8015', // POC 接口地址
  Base_Xterm_URL: 'http://10.20.86.27:1182', // xterm 接口地址
  Base_Login_URL: import.meta.env.VITE_BASE_LOGIN_URL, // 登录 接口地址 测试
  Base_APV_URL: import.meta.env.VITE_BASE_URL // APV 接口地址 测试
}
export default configUrl
