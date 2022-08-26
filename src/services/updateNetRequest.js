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

  if (type === 'Regex') {
    ruleRedirect.regexSubstitution = targetResult.replace('$', '\\')
    ruleObject.regexFilter = onMatch
  } else if (type === 'Equals') {
    ruleObject.urlFilter = onMatch
    ruleRedirect.url = targetResult
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

export default (data) => {
  const { proxyList } = data

  declarativeNetRequest.getDynamicRules((previousRules) => {
    const removeRuleIds = previousRules.map((rule) => rule.id)
    const addRules = []

    proxyList.forEach((item, index) => {
      const rule = createAddRules(item, index + 1)
      if (rule && item.status === true) {
        addRules.push(rule)
      }
    })
    declarativeNetRequest.updateDynamicRules({
      addRules,
      removeRuleIds,
    })
  })
}
