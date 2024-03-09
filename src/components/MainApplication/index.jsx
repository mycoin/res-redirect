import React, { Component } from 'react'
import produce from 'immer'
import { message } from 'antd'
import storageService, { updateNetRequest } from '@/services'
import ResourceMini from '../ResourceMini'
import ResourceProxyList from '../ResourceProxyList'

const defaultValueMap = {
  proxyList: [],
}

class Application extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: defaultValueMap,
    }
    storageService.get((value) => {
      this.setState({
        value: {
          ...defaultValueMap,
          ...value,
        },
      })
    })
  }

  handleUpdateImmer = (callback) => {
    const { value } = this.state
    const nextValue = produce(value, callback)
    this.setState(
      {
        value: nextValue,
      },
      () => {
        storageService.set(nextValue)
        updateNetRequest(nextValue, () => {
          message.destroy()
          message.success('Saved successfully')
        })
      },
    )
  }

  render() {
    const { miniMode } = this.props
    const { value } = this.state

    return miniMode ? (
      <ResourceMini value={value} onCallback={this.handleUpdateImmer} />
    ) : (
      <div className="layout">
        <div className="layout-content">
          <ResourceProxyList value={value} onCallback={this.handleUpdateImmer} />
        </div>
      </div>
    )
  }
}

export default Application
