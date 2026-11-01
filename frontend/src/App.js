import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // v5 imports
import FormPage from './components/FormPage';
import IndexPage from './components/IndexPage';
import HomePage from './components/HomePage';
import Header from './components/Header';
import LeftSideBar from './components/LeftSideBar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from './components/ProtectedRoute';
import Matrixfactorization from './components/Matrixfactorization';
import Chat from './components/Chat';
import ConnectionPage from './components/ConnectionPage';
import Matrix from './components/Matrix';
import AdminPage from './components/AdminPage';
import PersonalPage from './components/PersonalPage';

function App() {
  const [formData, setFormData] = useState(null);

  return (
    <Router>
      <div className="App">
        <Route component={Header}/>
        <Route component={LeftSideBar}/>
        <main>
          <Switch> 
            <ProtectedRoute path="/home" component={HomePage}/>
            <Route exact path="/">
              <IndexPage />
              {/* <IndexPage setFormData={setFormData} /> */}
            </Route>
            <ProtectedRoute path="/chat" component={Chat}/>
            <ProtectedRoute path="/connections" component={ConnectionPage}/>
            <ProtectedRoute path="/admin" component={AdminPage}/>
            <ProtectedRoute path="/personal" component={PersonalPage}/>
            <Route path="/register">
              <FormPage />
              {/* <FormPage setFormData={setFormData} /> */}
            </Route>
            <Route path="/matrix/createdb">
              <Matrix/>
              {/* <FormPage setFormData={setFormData} /> */}
            </Route>
            
            <Route path="/matrix_factorization" component={Matrixfactorization}/>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
