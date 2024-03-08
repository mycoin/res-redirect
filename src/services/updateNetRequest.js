/* eslint-disable no-continue */
const { declarativeNetRequest } = chrome

const defaultCondition = {
  isUrlFilterCaseSensitive: true,
  resourceTypes: ['main_frame', 'sub_frame', 'stylesheet', 'script'],
}

const escapeQuestionMarksOutsideParentheses = (regexStr) => {
  let result = ''
  let parenthesesCount = 0
  let i = 0
  while (i < regexStr.length) {
    const char = regexStr[i]

    if (char === '(') {
      parenthesesCount++
    } else if (char === ')') {
      parenthesesCount--
      if (parenthesesCount < 0) {
        throw new Error('Unmatched closing parenthesis')
      }
    } else if (char === '?' && parenthesesCount === 0) {
      result += '\\?'
      i++
      continue
    }
    if (char === '\\' && i + 1 < regexStr.length) {
      const nextChar = regexStr[i + 1]
      if (['(', ')', '\\'].includes(nextChar)) {
        result += char + nextChar
        i += 2
        continue
      }
    }
    result += char
    i++
  }
  if (parenthesesCount > 0) {
    throw new Error('Unmatched opening parenthesis')
  }
  return result
}

const createAddRules = (item, index) => {
  const { type, onMatch, targetResult } = item
  const ruleObject = {}
  const ruleRedirect = {}
  if (!onMatch || !targetResult) {
    return null
  }

  if (type === 'regex') {
    ruleRedirect.regexSubstitution = targetResult.replace(/\$/g, '\\')
    ruleObject.regexFilter = escapeQuestionMarksOutsideParentheses(onMatch)
  } else if (type === 'useEqual') {
    ruleRedirect.url = targetResult
    ruleObject.urlFilter = onMatch
  } else if (type === 'replace') {
    ruleRedirect.regexSubstitution = targetResult
    ruleObject.regexFilter = onMatch
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
    declarativeNetRequest.updateDynamicRules(
      {
        addRules,
        removeRuleIds,
      },
      () => {
        if (typeof callback === 'function') {
          callback()
        }
      },
    )
  })
}
