import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'react-router-dom';

import styles from './index.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return (
      <img
        src={icon}
        alt="icon"
        className={`${styles.icon} sider-menu-item-img`}
      />
    );
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export const getMenuMatcheys = (flatMenuKeys, path) => {
  return flatMenuKeys.filter(item => {
    return pathToRegexp(item).test(path);
  });
};

class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.flatMenuKeys = this.getMenuMatcheys(props.menuData);
  }
  render() {
    const { logo, collapsed, onCollapse } = this.props;
    const { openKeys } = this.state;

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        className={styles.sider}
      >
        <div className={styles.logo} key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>Ant Design</h1>
          </Link>
        </div>

        <Menu key="Menu" style={{ padding: '16px 0', width: '100%' }} />
      </Sider>
    );
  }
}

export default SiderMenu;
