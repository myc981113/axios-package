import axios from "axios"
import qs from 'qs'
import { debounce } from '../http/debounce'

type optionParams = {
  prefixURL ?: string,
  url : string,
  method ?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT',
  contentType ?: 'json' | 'urlencoded' | 'multipart',
  dataset ?: object,
  options ?: any
} 

const contentTypes = {
  json: 'application/json; charset=utf-8',
  urlencoded: 'application/x-www-form-urlencoded; charset=utf-8',
  multipart: 'multipart/form-data',
}

const defaultOptions = {
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': contentTypes.json,
  },
  timeout: 20000
}

let errorMsgobj = {}

function Toast() {
  Object.keys(errorMsgobj).map(item => {
    const error = new Error(item)
    console.error(error);
    delete errorMsgobj[item]
  })
}

export const myApi = async ({
  prefixURL,
  url,
  dataset = {},
  method = 'GET',
  options = {},
  contentType = 'json',
} : optionParams) => {
  if(!url) {
    const error = new Error('请输入URL')
    return Promise.reject(error)
  }

  const fullurl = `${prefixURL}/${url}`

  const newOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      'Content-Type': (options.headers && options.headers['Content-Type']) || contentTypes[contentType]
    },
    method,
    data: Object
  }

  if(method === 'GET') newOptions.data = dataset;

  if(method !== 'GET' && method !== 'HEAD') {
    newOptions.data = dataset;
    (dataset instanceof FormData) ?
      (
        newOptions.headers = {
        'x-requested-with': 'XMLHttpRequest',
        'cache-control': 'no-cache',
        }
      ) : 
        (newOptions.headers['Content-Type'] === contentTypes.urlencoded) ? 
          newOptions.data = qs.stringify(dataset) :
            (
              Object.keys(dataset).forEach((item) => {
                if (
                  data[item] === null ||
                  data[item] === undefined ||
                  data[item] === ''
                ) {
                  delete data[item]
                }
              })
            )
  }

  axios.interceptors.request.use(request => {
    request.url = request.url.replace(/^\//, '')
    return request
  })

  const response = await axios({
    fullurl,
    ...newOptions
  })
  const { data } = response
  switch (data) {
    case 'xxx':
      // 业务逻辑
      break
    case 'xxxx':
      // 业务逻辑
      // 与服务器连接成功
      return Promise.resolve(data)
    default:
      const { message } = data
      if (!errorMsgobj[message]) {
        errorMsgobj[message] = message
      }
      setTimeout(debounce(Toast, 1000, true), 1000)
      return Promise.reject(data)
  }
}