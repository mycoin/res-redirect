import { Component } from 'react'

class BaseExport extends Component {
  handleUpdateRecords = (callback) => {
    const { onCallback } = this.props
    onCallback((rootValue) => {
      return callback(rootValue.proxyList)
    })
  }
}

export default BaseExport
