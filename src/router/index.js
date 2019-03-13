import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import Loadable from 'react-loadable'

import Loading from '../components/Loading'

// 懒加载的第二中方式：Loadable
const Home = Loadable({
  loader: () => import('../containers/Home/index.js'),
  loading: Loading
})
const About = Loadable({
  loader: () => import('../containers/About/index.js'),
  loading: Loading
})
const Topics = Loadable({
  loader: () => import('../containers/Topics/index.js'),
  loading: Loading
})

const RouterConfig = () => (
  <LocaleProvider locale={zhCN}>
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/topics" component={Topics} />
        </Switch>
      </div>
    </Router>
  </LocaleProvider>
)

export default RouterConfig
