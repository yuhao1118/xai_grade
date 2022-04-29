import React, { useEffect } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Layout } from 'antd';
import { MainPage, WelcomePage } from './pages';
import CommonProvider from './context/common';

import './App.less';

const App: React.FC = () => {
  return (
    <CommonProvider>
      <BrowserRouter>
        <Switch>
          <Layout className="site-layout">
            <Layout>
              <Route path="/main" component={MainPage} />
              <Route path="/" exact component={WelcomePage} />
            </Layout>
          </Layout>
        </Switch>
      </BrowserRouter>
    </CommonProvider>
  );
};

export default App;
