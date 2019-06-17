import { login, loginout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

//数据状态
const state = {
	//token: getToken(),
	name: '',
	avatar: '',
	introduction: '',
	roles: []
}

//commit提交事件
const mutations = { //所有方法默认接收state数据状态参数
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_INTRODECTION: (state, introduction) => {
		state.introduction = introduction
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles
	}
}

//异步提交commit
//默认接收context参数（包含context.state , context.getters , context.commit）
const actions = { 
	login({ commit }, userInfo) {
		const { username, password } = userInfo //这个是表单接收的数据
		return new Promise((resolve, reject) => {
			//注意下面这个login()方法是从@api/user导入的方法
			login({ username: username.trim(), password: password })
			  .then(response => { //ajax请求返回的结果数据就是response.data
					const { data } = response //请求成功的结果
					commit('SET_TOKEN', data.token) //更新token
					//setToken(data.token)
					resolve()
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	
	getInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			getInfo(state.token).then(response => {
				const { data } = response
				if(!data){
					reject('用户数据不存在！')
				}
				
				const { roles, name, avatar, introduction } = data
				
				commit('SET_ROLES', roles)
				commit('SET_NAME', name)
				commit('SET_AVATAR', avatar)
				commit('SET_INTRODUCTION', introduction)
				resolve(data)
			}).catch(error => {
				reject(error)
			})
		})
	},
	
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
			logout(state.token).then(() => {
				commit('SET_ROLES', [])
				commit('SET_NAME', '')
				removeToken()
				resetRouter()
				resolve()
			}).catch(error => {
				reject(error)
			})
		})
	},
	
	resetToken({ commit }) {
		return new Promise(resolve => {
			commit('SET_ROLES', [])
			commit('SET_NAME', '')
			removeToken()
			resolve()
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}