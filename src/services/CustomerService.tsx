import axios from 'axios'
import { useState, useEffect } from 'react'

export const useSaveHire = (
  url = process.env.REACT_APP_API_URL + 'hire',
  body: any = null,
) => {
  const [data, setData]: any = useState(null)
  useEffect(() => {
    axios
      .post(url, body)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [url, body])
  return data
}
