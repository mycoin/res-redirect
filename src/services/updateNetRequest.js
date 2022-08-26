const { declarativeNetRequest } = chrome

const defaultCondition = {
  isUrlFilterCaseSensitive: true,
  resourceTypes: [
    'main_frame',
    'sub_frame',
    'stylesheet',
    'script',
  ],
}

const createAddRules = (item, index) => {
  const { type, onMatch, targetResult } = item
  const ruleObject = {}
  const ruleRedirect = {}
  if (!onMatch || !targetResult) {
    return null
  }
  if (type === 'regex') {
    ruleRedirect.regexSubstitution = targetResult.replace('$', '\\')
    ruleObject.regexFilter = onMatch
  } else if (type === 'useEqual') {
    ruleObject.urlFilter = onMatch
    ruleRedirect.url = targetResult
  } else {
    return null
  }
  return {
    id: index,
    priority: index,
    condition: {
      ...defaultCondition,
      ...ruleObject,
    },
    action: {
      type: 'redirect',
      redirect: ruleRedirect,
    },
  }
}

export default (data, callback) => {
  const { proxyList } = data || {}

  declarativeNetRequest.getDynamicRules((previousRules) => {
    const removeRuleIds = previousRules.map((rule) => rule.id)
    const addRules = [];

    (proxyList || []).forEach((item, index) => {
      const rule = createAddRules(item, index + 1)
      if (rule && item.enable === true) {
        addRules.push(rule)
      }
    })

    declarativeNetRequest.updateDynamicRules({
      addRules,
      removeRuleIds,
    }, () => {
      if (typeof callback === 'function') {
        callback()
      }
    })
  })
}
