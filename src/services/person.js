import axios from 'axios'

// palvelimen juurihakemisto
const baseUrl = 'http://localhost:3001/api/persons'

// hakee kaikki kontaktit palvelimelta ja palauttaa datan (kontaktit)
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// luo palvelimelle uuden kontaktin ja palauttaa kontaktin
const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

// korvaa id:ta vastaavan kontaktin palvelimella ja palauttaa sen
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

// poistaa palvelimelta id:a vastaavan kontaktin
const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { getAll, create, update, remove }