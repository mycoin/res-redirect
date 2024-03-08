/* eslint-disable react/no-danger */
import React from 'react'
import { Button, Input, Popconfirm, Select, Switch, Table } from 'antd'
import BaseExport from '../BaseExport'
import renderHtml from './renderHtml.ejs'
import { cleanDNS, createRecord } from '../util'

import './index.scss'

const { Option } = Select
const placeholderMap = {
  replace: {
    onMatch: 'https://www.baidu.com/s?wd=(param)',
    targetResult: 'http://localhost/search?wd=(1)',
  },
  useEqual: {
    onMatch: 'https://www.google.com',
    targetResult: 'http://127.0.0.1:8080',
  },
  regex: {
    onMatch: 'https://www.baidu.com/s\\?wd=([^&]+)',
    targetResult: 'http://localhost/search?wd=\\1',
  },
}

class ModuleExport extends BaseExport {
  constructor(props) {
    super(props)

    const columnList = []
    const columnRenders = this.getColumnRenders()
    const addColumn = (labelName, key, widthNumber) => {
      const config = {
        title: labelName,
        key,
        width: widthNumber,
        className: key,
        dataIndex: key,
      }
      config.render = (value, record, index) => {
        if (typeof columnRenders[key] === 'function') {
          return columnRenders[key](value, index, record)
        } else {
          return value
        }
      }
      columnList.push(config)
    }

    addColumn('enable', 'enable', 80)
    addColumn('mode', 'type', 80)
    addColumn('match', 'onMatch')
    addColumn('target', 'targetResult')
    addColumn('name', 'note', 180)
    addColumn('option', 'option', 100)

    this.columns = columnList
  }

  getColumnRenders() {
    const updateRecordWith = (index, nextValue) => {
      this.handleUpdateRecords((dataList) => {
        Object.assign(dataList[index], nextValue)
      })
    }
    return {
      enable: (value, index) => {
        const handleChange = (enable) => {
          updateRecordWith(index, {
            enable,
          })
        }
        return (
          <div className="center">
            <Switch size="small" onChange={handleChange} checked={value} />
          </div>
        )
      },
      note: (value, index) => {
        const handleChange = (event) => {
          updateRecordWith(index, {
            note: event.target.value,
          })
        }
        return <Input value={value} onChange={handleChange} />
      },
      type: (value, index) => {
        const handleChange = (type) => updateRecordWith(index, {
          type,
        })
        return (
          <Select className="field-type" value={value} onChange={handleChange}>
            <Option value="replace">replace</Option>
            <Option value="useEqual">useEqual</Option>
            <Option value="regex">regex</Option>
          </Select>
        )
      },
      onMatch: (value, index, record) => {
        const { type } = record
        const handleChange = (event) => {
          updateRecordWith(index, {
            onMatch: event.target.value,
          })
        }
        return (
          <Input
            /**/
            value={value}
            placeholder={(placeholderMap[type] || {}).onMatch}
            onChange={handleChange}
          />
        )
      },
      targetResult: (value, index, record) => {
        const { type } = record
        const handleChange = (event) => {
          updateRecordWith(index, {
            targetResult: event.target.value,
          })
        }
        return (
          <Input
            /**/
            value={value}
            placeholder={(placeholderMap[type] || {}).targetResult}
            onChange={handleChange}
          />
        )
      },
      option: (_, index, record) => {
        const handleRemove = () => {
          this.handleUpdateRecords((dataList) => {
            dataList.splice(index, 1)
          })
        }
        const handleCopy = () => {
          this.handleUpdateRecords((dataList) => {
            dataList.splice(index, 0, createRecord(record))
          })
        }
        return (
          <div className="field-option">
            <Button onClick={handleCopy}>copy</Button>
            <Popconfirm title="Delete this record, sure?" onConfirm={handleRemove}>
              <Button type="primary" danger>
                delete
              </Button>
            </Popconfirm>
          </div>
        )
      },
    }
  }

  render() {
    const { value } = this.props
    const handleAdd = () => {
      this.handleUpdateRecords((dataList) => {
        dataList.push(createRecord())
      })
    }

    return (
      <div className="resource-proxy-list">
        <div className="topbar-logo">
          Res-Redirect
          <span>1.0.6</span>
        </div>
        <div className="topbar-actions content-wrapper">
          <Button type="primary" onClick={handleAdd}>
            add
          </Button>
          <Button onClick={cleanDNS}>clean DNS</Button>
        </div>
        <div className="content-wrapper">
          <Table
            size="small"
            bordered
            columns={this.columns}
            dataSource={value.proxyList}
            pagination={{
              hideOnSinglePage: true,
              pageSize: 20,
            }}
          />
          <div className="content-help" dangerouslySetInnerHTML={{ __html: renderHtml({}) }} />
        </div>
        <div className="other-urls">
          <a href="https://github.com/mycoin/res-redirect">Github</a>
        </div>
      </div>
    )
  }
}
export default ModuleExport
