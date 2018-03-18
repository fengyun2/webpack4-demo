import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import asyncComponent from '../utils/AsyncComponent'
// import Loadable from 'react-loadable';
// import Loading from '../components/Loading';

// const LazyLoad = (component) => Loadable({
//   loader:() => import(component),
//   loading: Loading
// })

// import Home from '../containers/Home'
// import About from '../containers/About'
// import Topics from '../containers/Topics'

const Home = asyncComponent(() => import(/* webpackChunkName: "home" */ '../containers/Home'))
const About = asyncComponent(() => import(/* webpackChunkName: "about" */ '../containers/About'))
const Topics = asyncComponent(() => import(/* webpackChunkName: "topics" */ '../containers/Topics'))

const RouterConfig = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
)

export default RouterConfig
