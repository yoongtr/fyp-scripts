import React, { Component } from 'react';
import {
    Input,
    Button, Form, Col,
    Row
  } from 'reactstrap';

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <Row>
                <Col sm={3}>
                    <h3 className="logo-font">QuizIt!</h3>
                    <p>
                    A quiz generator tool for studying and comprehension.
                    <br/>Singapore, Singapore
                    <br/>+65 1234 5678
                    <br/>www.quizit.com
                    </p>
                </Col>
                <Col sm={3}>
                    <p>
                    <strong>Menu</strong>
                    <br/><br/><a href="/home">Home</a>
                    <br/><a href="/about">About</a>
                    <br/><a href="/signup">Sign Up</a>
                    <br/><a href="/login">Log In</a>
                    </p>
                </Col>
                <Col sm={3}>
                    <p>
                    <strong>Follow Us</strong>
                    <br/><br/><a className="btn btn-social-icon btn-facebook" href="http://www.facebook.com/profile.php?id="><i className="fa fa-facebook"></i></a>
                    <a className="btn btn-social-icon btn-linkedin" href="http://www.linkedin.com/in/"><i className="fa fa-linkedin"></i></a>
                    <br/><a className="btn btn-social-icon btn-twitter" href="http://twitter.com/"><i className="fa fa-twitter"></i></a>
                    <a className="btn btn-social-icon btn-google" href="http://youtube.com/"><i className="fa fa-youtube"></i></a>
                    </p>
                </Col>
                <Col sm={3}>
                    <div>
                    <p><strong>Subscribe to our Newsletter!</strong></p>
                    <Form inline>
                        <div>
                        <Input bsSize="sm" type="email" name="subscribe" id="subscribe"
                            placeholder="Enter your email" />
                        <Button className="btn-sm" type="submit" name="submit" id="submit">Submit</Button>
                        </div>
                    </Form>
                    </div>
                </Col>
                </Row>
                <br/>
                <Row className="center"><p>Copyright &copy; 2022 by Tran Thuy Dung</p></Row>
            </div>
        )
    }
}
export default Footer;