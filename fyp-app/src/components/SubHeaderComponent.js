import React, { Component } from 'react';
import {
    Container,
    Row,
    Col
} from 'reactstrap';

class SubHeader extends Component {
    render() {
        return (
            <Container className="sub-header">
            <Row>
                <Col sm={6}>
                <div className="header-col-left">
                <p><strong className="logo-font">QuizIt!</strong> is a NLP Machine Learning model that gives questions based on an input paragraph.
                    <br />It is based on T5 model by Google.
                </p>
                </div>
                </Col>
                <Col sm={6}>
                <div className="header-col-right">
                    <img src='assets/images/home_image.png' alt='learning-logo' class="img-fluid" width="300px"></img>
                </div>
                </Col>
            </Row>
            </Container>
        )
    }
}

export default SubHeader;