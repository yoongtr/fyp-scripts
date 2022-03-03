import React, { useState, useContext } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Row
  } from 'reactstrap';
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);
    const navigate = useNavigate();

    const submitLogin = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(
                `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
            ),
        };
    
        const response = await fetch("/api/token", requestOptions);
        const data = await response.json();
    
        if (!response.ok) {
          setErrorMessage(data.detail);
        } else {
          setToken(data.access_token);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin();
        navigate('/home');
    };

    return (
        <div className="form-wrapper">
            <h2>Log In</h2>
            <Form className="form" onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </FormGroup>
                < br/><ErrorMessage message={errorMessage} />
                <Row className='center'><Button>Login</Button></Row><br/>
                <Row className='center'><p>Don't have an account? <a href='/signup'>Sign Up.</a></p></Row>
            </Form>
        </div>
    )
}
export default Login;