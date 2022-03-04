import React, {useState} from 'react';
import {
  FormGroup, Label, Input,
  Button, Form, Col, Row
} from 'reactstrap';

const Home = () => {
    
    const [spinner, setSpinner] = useState(false);
    const [input_passage, setInputPassage] = useState("");
    const submitPassage = async () => {
        document.getElementById('generated').innerHTML = "";
        document.getElementById('anskey').innerHTML = "";
        setSpinner(true);
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_passage: input_passage }),
        };
        const response = await fetch("/api/prediction", requestOptions);
        const data = await response.json();
        setSpinner(false);
        document.getElementById('generated').innerHTML = "Generated question: " + data[1].toString();
        document.getElementById('anskey').innerHTML = "Answer key: ..." + data[0].toString() + "...";
        console.log(data);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        submitPassage();
    }

    return (
        <div className="wrapper">
            <Row className="center"><h1>How it works</h1></Row>
            <br/>
            <Row className="center">
                <h5><big className="logo-font-dark">QuizIt!</big> takes in a paragraph text and output questions relating to the paragraph. 
                Try it out!
                </h5>
            </Row>
            <hr/>
            <div className="home-form">
                <Form inline onSubmit={handleSubmit}>
                    <FormGroup row className="mb-2 mr-sm-2 mb-sm-0">
                        <Row>
                            <Col sm={6}>
                                <div className="home-col-left">
                                <h3><Label for="input_passage">Input passage</Label></h3>
                                <Input 
                                    type="textarea" 
                                    name="input_passage" 
                                    value={input_passage}
                                    onChange={(e) => setInputPassage(e.target.value)}
                                    id="input_passage"
                                    rows="5"
                                    placeholder="E.g. In physics, mathematics, and related fields, 
                                    a wave is a propagating dynamic disturbance of one or more quantities, 
                                    sometimes as described by a wave equation. In physical waves, at least two field 
                                    quantities in the wave medium are involved." />
                                <br/>
                                <Button>Submit</Button>
                                </div>
                            </Col>
                            <Col sm={6} className="home-col-right">
                                <h3>Model Predictions</h3>
                                < br/>
                                {spinner && (
                                    <p><img src='assets/images/loader.gif' alt='loader' className="img-fluid" width="150px"></img></p>
                                )}
                                <p id='generated'></p>
                                <p id='anskey'></p>
                            </Col>
                        </Row>
                    </FormGroup>
                    <br></br>
                </Form>
            </div>
            <hr/>
        </div>
    )
}
export default Home;