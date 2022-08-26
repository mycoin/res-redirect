import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'
import Application from './components/Application'
import locale from './locale'

import './index.scss'

ReactDOM.render((
  <ConfigProvider locale={locale}>
    <Application />
  </ConfigProvider>
),
document.getElementById('content'))
