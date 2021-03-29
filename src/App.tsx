import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './App.css';
import {
  Join,
  Room,
} from './components';
import * as ROUTES from './routes';

function App() {
  return (
    <Router>
      <Switch>
        <Route path={ROUTES.ROOM} children={<Room />}/>
        <Route path={ROUTES.ROOT} children={<Join />}/>
      </Switch>
    </Router>
  );
}

export default App;