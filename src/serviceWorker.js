import storageService, { updateNetRequest } from './services'

const { declarativeNetRequest } = chrome

storageService.get(updateNetRequest)
storageService.addListener((data) => {
  updateNetRequest(data)
})

declarativeNetRequest.setExtensionActionOptions({
  displayActionCountAsBadgeText: true,
})
