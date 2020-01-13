// 处理用户的token
const USE_TOKEN = 'heima-toutiao-m'

// 设置用户的信息
export function setUser(user) {
  localStorage.setItem(USE_TOKEN,JSON.stringify(user))
}

// 读取用户的信息
export function getUser() {
  return JSON.parse(localStorage.getItem(USE_TOKEN) || '{}')
}

// 删除用户信息
export function delUser() {
  localStorage.removeItem(USE_TOKEN)
}
