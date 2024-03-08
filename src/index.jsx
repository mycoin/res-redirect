import React from 'react'
import ReactDOM from 'react-dom'
import MainApplication from './components/MainApplication'

import './scss/index.scss'

const isMini = /isMini/.test(location.search)

ReactDOM.render(<MainApplication isMini={isMini} />, document.getElementById('content'))
