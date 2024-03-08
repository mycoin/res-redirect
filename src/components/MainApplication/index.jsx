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
    const { isMini } = this.props
    const { value } = this.state

    return isMini ? (
      <ResourceMini value={value} onCallback={this.handleUpdateImmer} />
    ) : (
      <div className="layout">
        <div className="layout-content">
          <a target="_blank" href="https://www.baidu.com/s?wd=阿里巴巴&e=2" rel="noreferrer">
            wd
          </a>
          <ResourceProxyList value={value} onCallback={this.handleUpdateImmer} />
        </div>
      </div>
    )
  }
}

export default Application
