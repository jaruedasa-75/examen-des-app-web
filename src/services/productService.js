import axios from 'axios'
import { API_BASE_URL } from './config'

const RESOURCE_URL = `${API_BASE_URL}/productos`

export const getProducts = () => axios.get(RESOURCE_URL)

export const getProductById = (id) => axios.get(`${RESOURCE_URL}/${id}`)

export const createProduct = (data) => axios.post(RESOURCE_URL, data)

export const updateProduct = (id, data) => axios.put(`${RESOURCE_URL}/${id}`, data)

export const deleteProduct = (id) => axios.delete(`${RESOURCE_URL}/${id}`)
