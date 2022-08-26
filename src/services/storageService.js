const { sync, onChanged } = chrome.storage

const set = (data) => sync.set({
  data,
  dataVersion: 1,
})

const get = (callback) => {
  sync.get(['data', 'dataVersion'], (result) => {
    callback(result.data)
  })
}

const addListener = (callback) => {
  onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      get(callback)
    }
  })
}

export default {
  addListener,
  get,
  set,
}
