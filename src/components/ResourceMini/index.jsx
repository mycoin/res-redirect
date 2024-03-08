import React from 'react'
import { Button, Switch, Table, Tag } from 'antd'
import BaseExport from '../BaseExport'
import { cleanDNS } from '../util'

import './index.scss'

const handleOpen = () => {
  open('?fullscreenMode=1')
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

    addColumn('type', 'type', 80)
    addColumn('note', 'note', 180)
    addColumn('enable', 'enable', 80)

    this.columns = columnList
  }

  getColumnRenders() {
    const updateRecordWith = (index, nextValue) => {
      this.handleUpdateRecords((dataList) => {
        Object.assign(dataList[index], nextValue)
      })
    }
    return {
      note: 'note',
      type: (value) => (
        <div className="align-center">
          <Tag color="magenta">{value}</Tag>
        </div>
      ),
      enable: (value, index) => {
        const handleChange = (enable) => {
          updateRecordWith(index, {
            enable,
          })
        }
        return (
          <div className="align-center">
            <Switch onChange={handleChange} checked={value} />
          </div>
        )
      },
    }
  }

  render() {
    const { value } = this.props
    return (
      <div className="resource-proxy-mini">
        <div className="topbar-actions content-wrapper">
          <Button type="primary" onClick={handleOpen}>
            Manage
          </Button>
          <Button onClick={cleanDNS}>clean DNS</Button>
        </div>
        <div className="content-wrapper">
          <Table size="small" bordered columns={this.columns} dataSource={value.proxyList} />
        </div>
      </div>
    )
  }
}
export default ModuleExport
