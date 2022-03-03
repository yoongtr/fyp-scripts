import React, { useContext, useState } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Row
  } from 'reactstrap';
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const SignUp = () => {

    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);

    const submitRegistration = async () => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, hashed_password: password, first_name: firstname, last_name: lastname }),
        };
        const response = await fetch("/api/users", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmationPassword && password.length > 8) {
            submitRegistration();
        } else {
            setErrorMessage(
                "Ensure that the passwords match and greater than 8 characters!"
            );
        }
    };

    return (
        <div className="form-wrapper">
            <h2>Sign Up</h2>
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
                    <Label for="firstname">First Name</Label>
                    <Input
                    type="input"
                    name="firstname"
                    id="firstname"
                    placeholder="Enter your first name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="lastname">Last Name</Label>
                    <Input
                    type="input"
                    name="lastname"
                    id="lastname"
                    placeholder="Enter your last name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
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
                <FormGroup>
                    <Label for="confirmpassword">Confirm Password</Label>
                    <Input
                    type="password"
                    name="username"
                    id="username"
                    placeholder="Confirm your password"
                    value={confirmationPassword}
                    onChange={(e) => setConfirmationPassword(e.target.value)}
                    required
                    />
                </FormGroup>
                < br/><ErrorMessage message={errorMessage} />
                <Row className='center'><Button>Sign Up</Button></Row><br/>
            </Form>
        </div>
    )
}
export default SignUp;