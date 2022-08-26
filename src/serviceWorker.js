import storageService, { updateNetRequest } from './services'

storageService.get(updateNetRequest)
storageService.addListener((data) => {
  updateNetRequest(data)
})
