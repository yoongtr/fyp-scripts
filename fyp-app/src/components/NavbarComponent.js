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
import '../App.css';

class NavbarHeader extends Component {

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

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    };

    render() {
        return (
            <div className="header-div">
                <Navbar dark expand="md" class="app-nav">
                    <NavbarBrand href="/">QuizIt!</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNav} />
                    <Collapse isOpen={this.state.isNavOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href='/home' activeClassName="active"><span className="fa fa-home fa-sm"></span> Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href='/about'><span className="fa fa-info fa-sm"></span> About</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/signup"><span className="fa fa-pencil fa-sm"></span> Sign Up</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/login"><span className="fa fa-sign-in fa-sm"></span> Log In</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
            
        )
    }
}

export default NavbarHeader;