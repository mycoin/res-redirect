import { message } from 'antd'
import { cleanHostCache } from '@/services'

let initTime = Date.now()

const createRecord = (record) => ({
  enable: true,
  type: 'useEqual',
  ...record,
  key: initTime--,
})

const cleanDNS = () => {
  if (cleanHostCache()) {
    message.success('Clean host cache successfully.', 1, () => {
      chrome.tabs.reload()
    })
  } else {
    message.error('Failed to clean hosts cache.')
  }
}

export {
  createRecord,
  cleanDNS,
}
