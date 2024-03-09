import React from 'react'
import { Button, Switch, Table, Tag } from 'antd'
import BaseExport from '../BaseExport'
import { cleanDNS, colorMap } from '../util'

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

    addColumn('Mode', 'type', 90)
    addColumn('Name', 'note', 180)
    addColumn('Enable', 'enable', 90)

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
          <Tag color={colorMap[value]}>{value}</Tag>
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
            <Switch size="small" onChange={handleChange} checked={value} />
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
          <Button size="small" type="primary" onClick={handleOpen}>
            Manage
          </Button>
          <Button size="small" onClick={cleanDNS}>
            clear DNS Cache
          </Button>
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
        </div>
      </div>
    )
  }
}
export default ModuleExport
