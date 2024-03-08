/* eslint-disable prefer-const */
/* eslint-disable no-continue */
const { declarativeNetRequest } = chrome
const defaultCondition = {
  isUrlFilterCaseSensitive: true,
  resourceTypes: [
    'csp_report',
    'font',
    'image',
    'main_frame',
    'media',
    'object',
    'other',
    'ping',
    'script',
    'stylesheet',
    'sub_frame',
    'webbundle',
    'websocket',
    'webtransport',
    'xmlhttprequest',
  ],
}

const sortReplaces = {
  '?': '\\?',
  '(param)': '([^&]*)',
  '(name)': '([^/]*)',
  '(...)': '(.*?)',
  '(any)': '(.*?)',
  '(version)': '([0-9.]*)',
}

const createAddRules = (item, index) => {
  let { type, onMatch, targetResult } = item
  const ruleObject = {}
  const ruleRedirect = {}
  if (!onMatch || !targetResult) {
    return null
  }
  if (type === 'useEqual') {
    ruleRedirect.url = targetResult
    ruleObject.urlFilter = onMatch
  } else {
    if (type === 'replace') {
      Object.keys(sortReplaces).forEach((key) => {
        onMatch = onMatch.replaceAll(key, sortReplaces[key])
      })
    }
    ruleRedirect.regexSubstitution = targetResult.replace(/(\(([\d]+)\))/g, (a, b, c) => '\\' + c)
    ruleObject.regexFilter = onMatch
  }

  return {
    id: Math.floor(Math.random() * 10e5),
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
    const addRules = []
    const dynamicRules = {
      addRules,
      removeRuleIds,
    };
    (proxyList || []).forEach((item, index) => {
      const rule = createAddRules(item, index + 1)
      if (rule && item.enable === true) {
        addRules.push(rule)

        console.error('rule', rule)
      }
    })
    declarativeNetRequest.updateDynamicRules(dynamicRules, () => {
      if (typeof callback === 'function') {
        callback()
      }
    })
  })
}
