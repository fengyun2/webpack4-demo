import React from 'react';
import { Button } from 'antd';
import styles from './App.css';

import Router from './Router'

const App = () => (
  <div className="App">
    <button className={styles.button}>Button</button>
    <Button type="primary">Antd Button</Button>
    <Router />
  </div>
)

export default App;
