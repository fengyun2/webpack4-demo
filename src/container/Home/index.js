import React from 'react'
import { Button, Checkbox } from 'antd'
import styles from './index.scss'

const Home = () => (
  <div style={{ padding: '10px' }}>
    <button type="button" className={styles.btn}>
      home - 按钮
    </button>
    <Button className={styles.btn}>home-按钮</Button>
    <hr />
    <Checkbox onChange={e => console.log(`checked = ${e.target.checked}`)}>Apple</Checkbox>
  </div>
)

export default Home
