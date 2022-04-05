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
import MyAccount from './components/MyAccountComponent';
import MyQuizzes from './components/MyQuizzesComponent';

const App = () => {

    // const [isOpen, setIsOpen] = React.useState(false);
  // const [message, setMessage] = React.useState("");

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      },
    };
    const response = await fetch("/api", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log("Some error happened");
    } else {
      console.log(data);
    }
  };

  React.useEffect(() => {
    getWelcomeMessage();
  }, []);
  
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
          <Route exact path='/myaccount' element={<MyAccount/>} />
          <Route exact path='/myquizzes' element={<MyQuizzes/>} />
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