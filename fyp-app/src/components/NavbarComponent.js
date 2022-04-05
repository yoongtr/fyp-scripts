import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';

const NavbarHeader = () => {

    const navigate = useNavigate();
    const [token, setToken] = useContext(UserContext);

    const handleLogout = () => {
        setToken(null);
        navigate('/login');
    };

    return (
        <div className="header-div">
            <Navbar collapseOnSelect expand="sm" className="app-nav">
                <Container>
                <Navbar.Brand href="/">QuizIt!</Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav variant="dark">
                        <Nav.Item>
                            <Nav.Link href='/home'><span className="fa fa-home fa-sm"></span> Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/about'><span className="fa fa-info fa-sm"></span> About</Nav.Link>
                        </Nav.Item>
                        {!token && (
                            <Nav.Item>
                                <Nav.Link href="/signup"><span className="fa fa-pencil fa-sm"></span> Sign Up</Nav.Link>
                            </Nav.Item>
                        )}
                        {!token && (
                            <Nav.Item>
                                <Nav.Link href="/login"><span className="fa fa-sign-in fa-sm"></span> Log In</Nav.Link>
                            </Nav.Item>
                        )}
                        {token && (
                            <Nav.Item>
                                <Nav.Link href='/myaccount'><span className="fa fa-user fa-sm"></span> My Account</Nav.Link>
                            </Nav.Item>
                        )}
                        {token && (
                            <button className='transparent-button' onClick={handleLogout}><span className="fa fa-sign-out fa-sm"></span>Logout</button>
                        )}
                    </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
        
    )
}
// }

export default NavbarHeader;