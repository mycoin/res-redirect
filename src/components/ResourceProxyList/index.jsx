/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { Button, Input, Popconfirm, Select, Switch, Table } from 'antd'
import { CopyOutlined, DeleteOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons'
import { cleanDNS, createRecord } from './util'
import BaseExport from '../BaseExport'

import './index.scss'

const { Option } = Select

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

    addColumn('开启', 'status', 80)
    addColumn('类型', 'type', 80)
    addColumn('条件', 'onMatch')
    addColumn('目标地址', 'targetResult')
    addColumn('备注', 'note', 180)
    addColumn('操作', 'option', 100)

    this.columns = columnList
  }

  getColumnRenders() {
    const updateRecordWith = (index, nextValue) => {
      this.handleUpdateRecords((dataList) => {
        Object.assign(dataList[index], nextValue)
      })
    }
    return {
      status: (value, index) => {
        const handleChange = (status) => {
          updateRecordWith(index, {
            status,
          })
        }
        return (
          <Switch
            onChange={handleChange}
            checked={value} />
        )
      },
      note: (value, index) => {
        const handleChange = (event) => {
          updateRecordWith(index, {
            note: event.target.value,
          })
        }
        return (
          <Input
            value={value}
            placeholder="选填"
            onChange={handleChange} />
        )
      },
      type: (value, index) => {
        const handleChange = (type) => updateRecordWith(index, {
          type,
        })
        return (
          <Select
            className="field-type"
            value={value}
            onChange={handleChange}>
            <Option value="Equals">等于</Option>
            <Option value="Regex">正则表达式</Option>
          </Select>
        )
      },
      onMatch: (value, index, record) => {
        const handleChange = (event) => {
          updateRecordWith(index, {
            onMatch: event.target.value,
          })
        }
        return (
          <Input
            value={value}
            placeholder={record.type}
            onChange={handleChange} />
        )
      },
      targetResult: (value, index) => {
        const handleChange = (event) => {
          updateRecordWith(index, {
            targetResult: event.target.value,
          })
        }
        return (
          <Input
            value={value}
            onChange={handleChange} />
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
            <Popconfirm
              title="确认删除该条记录吗？"
              onConfirm={handleRemove}>
              <Button type="primary" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
            <Button onClick={handleCopy}>
              <CopyOutlined />
            </Button>
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
        <div className="topbar-actions">
          <Button type="primary" onClick={handleAdd}>
            <PlusOutlined />新增
          </Button>
          <Button onClick={cleanDNS}>
            <SyncOutlined />刷新
          </Button>
        </div>
        <Table
          size="small"
          bordered
          columns={this.columns}
          dataSource={value.proxyList} />
      </div>
    )
  }
}
export default ModuleExport
