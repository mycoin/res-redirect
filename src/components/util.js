import { message } from 'antd'
import { cleanHostCache } from '@/services'

let initTime = Date.now()

const createRecord = (record) => ({
  enable: true,
  type: 'replace',
  ...record,

  key: initTime--,
})

const cleanDNS = () => {
  if (cleanHostCache()) {
    message.success('Clean host cache successfully.', 1, () => {
      chrome.tabs.reload()
    })
  } else {
    message.error('Failed. add "--enable-net-benchmarking" to chrome args')
  }
}
const colorMap = {
  replace: '#2DB7F5',
  useEqual: '#87D068',
  regex: '#108EE9',
}
export { colorMap, createRecord, cleanDNS }
