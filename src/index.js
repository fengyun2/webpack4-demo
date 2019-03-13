import React from 'react'
import ReactDOM from 'react-dom'

import * as serviceWorker from './serviceWorker'
import App from './App'

// import foo from './demo/foo'
// import bar from './demo/bar';
import './global.scss'
import './test.css'

ReactDOM.render(<App />, document.getElementById('app'))

// console.info('welcome to webpack4!')
// foo()

serviceWorker.register()
