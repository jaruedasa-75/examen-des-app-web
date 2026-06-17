import axios from 'axios'
import { API_BASE_URL } from './config'

const RESOURCE_URL = `${API_BASE_URL}/usuarios`

export const getUsers = () => axios.get(RESOURCE_URL)

export const getUserById = (id) => axios.get(`${RESOURCE_URL}/${id}`)

export const createUser = (data) => axios.post(RESOURCE_URL, data)

export const updateUser = (id, data) => axios.put(`${RESOURCE_URL}/${id}`, data)

export const deleteUser = (id) => axios.delete(`${RESOURCE_URL}/${id}`)
