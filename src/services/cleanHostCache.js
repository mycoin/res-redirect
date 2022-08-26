const bm = chrome.benchmarking

export default () => {
  try {
    bm.closeConnections()
    bm.clearHostResolverCache()
    return true
  } catch (e) {
    return false
  }
}
