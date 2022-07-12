import { resolveResRewrite, storageService } from './services'

const { webRequest } = chrome
const { onBeforeRequest } = webRequest

// onBeforeRequest.addListener((details) => {
//   const { url } = details
//   if (!url.indexOf('chrome-extension://') || !url.indexOf('chrome://') === 0) {
//     return {}
//   }

//   const config = storageService.get()
//   const targetResult = resolveResRewrite(config, url)

//   if (targetResult.redirectUrl) {
//     return targetResult
//   }
//   return true
// }, {
//   urls: ['<all_urls>'],
// }, ['blocking'])
