const { sync, onChanged } = chrome.storage

const internalMap = {}
const set = (data) => {
  sync.set({
    data,
    dataVersion: 1,
  })
}

const get = (callback) => {
  if (typeof callback === 'function') {
    sync.get(['data', 'dataVersion'], (result) => {
      callback(result.data)
    })
    return null
  } else {
    return internalMap.value || callback
  }
}

const addListener = (callback) => {
  onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      get(callback)
    }
  })
}

addListener((value) => {
  internalMap.value = value
})

export default {
  addListener,
  get,
  set,
}
