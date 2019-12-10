import * as Cookies from 'js-cookie'
import { TOKEN } from '@/config/constant'
const Token = (function() {
  const get = () => {
    return Cookies.get(TOKEN)
  }
  const set = (token: string, day: number = 7) => {
    return Cookies.set(TOKEN, token, {
      expires: day
    })
  }
  const remove = () => {
    return Cookies.remove(TOKEN)
  }
  return {
    get,
    set,
    remove
  }
})()
export default Token
