import { defineStore } from 'pinia'
import { login } from '@/api/user'
import jwt_decode from 'jwt-decode'
// import { removeToken, setToken } from '../../../utils/auth'
import CryptoJS from 'crypto-js'

interface BaseUserInfo {
  id: string
  nickName: string
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: {} as BaseUserInfo,
    token: '' as string
  }),
  getters: {
    nickName: (state) => state.userInfo.nickName
  },
  actions: {
    async Login(loginInfo: { username: string; password: string }) {
      loginInfo.password = CryptoJS.SHA512(loginInfo.password).toString(CryptoJS.enc.Base64)
      let res = await login(loginInfo)
      this.userInfo = jwt_decode(res.data.token)
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      this.token = res.data.token
      // setToken(this.token)
      localStorage.setItem('token', this.token)
      return res.data.token
    },
    LoginOut() {
      this.userInfo = {} as BaseUserInfo
      // removeToken()
      localStorage.clear()
    }
  }
})
