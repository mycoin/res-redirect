import React from 'react'
import ReactDOM from 'react-dom'
import MainApplication from './components/MainApplication'

import './scss/index.scss'

const miniMode = /isMini=1/.test(location.search)

ReactDOM.render(<MainApplication miniMode={miniMode} />, document.getElementById('content'))
