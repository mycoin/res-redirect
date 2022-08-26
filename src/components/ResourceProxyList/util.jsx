import { message } from 'antd'
import { cleanHostCache } from '@/services'

let initTime = Date.now()

const createRecord = (record) => ({
  status: true,
  type: 'Equals',
  ...record,
  key: initTime--,
})

const cleanDNS = () => {
  if (cleanHostCache()) {
    message.success('缓存DNS刷新成功！', 1, () => {
      chrome.tabs.reload()
    })
  } else {
    message.error('缓存DNS失败')
  }
}

export {
  createRecord,
  cleanDNS,
}
