import React from 'react'
// import { Button } from 'antd'
import Home from './container/Home'
import About from './container/About'
import styles from './App.css'

const App = () => (
  <div className="App">
    <button type="button" className={styles.button} style={{ marginBottom: '0px' }}>
      Button
    </button>
    {/* <Button type="primary">Antd Button</Button> */}
    <Home />
    <About />
  </div>
)

export default App
