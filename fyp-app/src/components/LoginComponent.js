import React, { Component } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Row
  } from 'reactstrap';

class Login extends Component {
    render() {
        return (
            <div className="form-wrapper">
                <h2>Log In</h2>
                <Form className="form">
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        />
                    </FormGroup>
                    <Row className='center'><Button>Login</Button></Row><br/>
                    <Row className='center'><p>Don't have an account? <a href='/signup'>Sign Up.</a></p></Row>
                </Form>
            </div>
        )
    }
}
export default Login;