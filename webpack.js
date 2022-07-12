module.exports = (webpack, option) => {
  Object.assign(webpack, {
    entry: {
      index: '@/index',
      serviceWorker: '@/serviceWorker',
    },
  })
}
