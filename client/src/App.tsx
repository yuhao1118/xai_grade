import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Layout } from 'antd';
import { MainPage, WelcomePage } from './pages';
import './App.less';

const App: React.FC = () => {
  return (
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
  );
};

export default App;
