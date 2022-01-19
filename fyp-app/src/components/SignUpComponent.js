import React, { Component } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Row
  } from 'reactstrap';

class SignUp extends Component {
    render() {
        return (
            <div className="form-wrapper">
                <h2>Sign Up</h2>
                <Form className="form">
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        />
                    </FormGroup>
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
                    <Row className='center'><Button>Sign Up</Button></Row><br/>
                </Form>
            </div>
        )
    }
}
export default SignUp;