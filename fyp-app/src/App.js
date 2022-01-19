import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import NavbarHeader from './components/NavbarComponent';
import SubHeader from './components/SubHeaderComponent';
import Home from './components/HomeComponent';  
import Footer from './components/FooterComponent';
import About from './components/AboutComponent';
import SignUp from './components/SignUpComponent';
import Login from './components/LoginComponent';

function App() {

    // const [isOpen, setIsOpen] = React.useState(false);
  
    return (

      <BrowserRouter>
      <div>
        <div className="header-div">
          <NavbarHeader />
          <SubHeader />
        </div>
        <TransitionGroup>
        <CSSTransition classNames="page" timeout={300}>
        <Routes>
          <Route exact path='/home' element={<Home/>} />
          <Route exact path='/about' element={<About/>} />
          <Route exact path='/signup' element={<SignUp/>} />
          <Route exact path='/login' element={<Login/>} />
          <Route
            path="*"
            element={<Navigate to="/home" />}
          />
        </Routes>
        </CSSTransition>
        </TransitionGroup>
        <Footer />
      </div>
      </BrowserRouter>
        
    );
}
  
export default App;