import React from 'react'
import Router from './router'
import styles from './App.css'

const App = () => (
  <div className="App">
    <button type="button" className={styles.button} style={{ marginBottom: '0px' }}>
      Button
    </button>
    <Router />
  </div>
)

export default App
