import React, { Component } from 'react';
import {
  FormGroup, Label, Input,
  Button, Form, Col, Row
} from 'reactstrap';

class Home extends Component {

    render() {
        return (
            <div className="wrapper">
                <Row className="center"><h1>How it works</h1></Row>
                <br/>
                <Row className="center">
                    <h5><big className="logo-font-dark">QuizIt!</big> takes in a paragraph text and output questions relating to the paragraph. 
                    Try it out!
                    </h5>
                </Row>
                <div className="home-form">
                    <Form inline>
                        <FormGroup row className="mb-2 mr-sm-2 mb-sm-0">
                            <Col sm={6}>
                                <div className="home-col-left">
                                <h3><Label for="input_passage">Input passage</Label></h3>
                                <Input type="textarea" name="input_passage" id="input_passage"
                                    rows="5"
                                    placeholder="E.g. In physics, mathematics, and related fields, 
                                    a wave is a propagating dynamic disturbance of one or more quantities, 
                                    sometimes as described by a wave equation. In physical waves, at least two field 
                                    quantities in the wave medium are involved." />
                                <br/>
                                <h3><Label for="answer">Answer key</Label></h3>
                                <Input type="textarea" name="answer" 
                                    id="answer"
                                    placeholder="E.g. propagating dynamic disturbance" />
                                <br/>
                                <Button>Submit</Button>
                                </div>
                            </Col>
                            <Col sm={6} className="home-col-right">
                                <h3>Question Generated</h3>
                                <p></p>
                            </Col>
                        </FormGroup>
                        <br></br>
                    </Form>
                </div>
                <hr/>
            </div>
        )
    }
}
export default Home;