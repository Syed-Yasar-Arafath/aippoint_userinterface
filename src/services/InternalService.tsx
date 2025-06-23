import axios from 'axios'
import { useState, useEffect } from 'react'

export const useGetAllSkills = (
  url = process.env.REACT_APP_API_URL + 'role',
  options = null,
) => {
  const [data, setData]: any = useState(null)
  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [url, options])
  return data
}

export const useGetService = (
  url = process.env.REACT_APP_API_URL + 'services/getbyid?id=1',
  options = null,
) => {
  const [data, setData]: any = useState(null)
  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [url, options])
  return data
}
