import React, { Component } from 'react';
import {
    Navbar,
    NavItem,
    NavbarToggler,
    Collapse,
    NavLink,
    Nav,
    NavbarBrand,
} from 'reactstrap';
import { UserContext } from "../context/UserContext";

class NavbarHeader extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
    
        this.toggleNav = this.toggleNav.bind(this);
        this.state = {
            isNavOpen: false
        };
    };

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    };

    render() {

        const [token, setToken] = this.context;

        const handleLogout = () => {
            setToken(null);
            // this.props.history.push("/home"); 
        };

        return (
            <div className="header-div">
                <Navbar dark expand="md" className="app-nav">
                    <NavbarBrand href="/">QuizIt!</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNav} />
                    <Collapse isOpen={this.state.isNavOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href='/home' activeclassname="active"><span className="fa fa-home fa-sm"></span> Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href='/about'><span className="fa fa-info fa-sm"></span> About</NavLink>
                            </NavItem>
                            {!token && (
                                <NavItem>
                                    <NavLink href="/signup"><span className="fa fa-pencil fa-sm"></span> Sign Up</NavLink>
                                </NavItem>
                            )}
                            {!token && (
                                <NavItem>
                                    <NavLink href="/login"><span className="fa fa-sign-in fa-sm"></span> Log In</NavLink>
                                </NavItem>
                            )}
                            {token && (
                                <button className='transparent-button' onClick={handleLogout}><span className="fa fa-sign-out fa-sm"></span>Logout</button>
                            )}
                            {token && (
                                <NavItem>
                                    <NavLink href='/myaccount'><span className="fa fa-user fa-sm"></span> My Account</NavLink>
                                </NavItem>
                            )}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
            
        )
    }
}

export default NavbarHeader;