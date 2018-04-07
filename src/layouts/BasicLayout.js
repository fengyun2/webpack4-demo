import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';

import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';

import GlobalHeader from '@/components/GlobalHeader';

const { Content, Header, Footer } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200
  }
};

let isMobile;

enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends PureComponent {
  static childContextTypes = {
    location: PropTypes.object
    // breadcrumbNameMap: PropTypes.object
  };
  state = {
    isMobile
  };
  getChildContext() {
    const { location } = this.props;

    return {
      location
    };
  }
  componentDidMount() {
    enquireScreen(mobile => {
      this.setState({
        isMobile: mobile
      });
    });
    // this.props.dispatch({
    //   type: 'user/fetchCurrent'
    // })
  }

  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      match,
      location
    } = this.props;

    const layout = (
      <Layout>
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              {/* onNoticeClear={this.handleNoticeClear} */}
              {/* onCollapse={this.handleMenuCollapse} */}
              {/* onMenuClick={this.handleMenuClick} */}
              {/* onNoticeVisibleChange={this.handleNoticeVisibleChange} */}
            />
          </Header>

          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );

  }
}
