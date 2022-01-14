import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Navbar,
    NavItem,
    NavbarToggler,
    Collapse,
    NavLink,
    Nav,
    NavbarBrand,
    Container,
    Row
} from 'reactstrap';

import {
  FormGroup, Label, Input,
  Button, Form, Col
} from 'reactstrap';
  
function App() {

    const [isOpen, setIsOpen] = React.useState(false);
  
    return (

      <div>
        <div className="header-div">
            <Navbar expand="md" className="app-nav">
                <NavbarBrand href="/">QuizIt!</NavbarBrand>
                <NavbarToggler onClick={() => { setIsOpen(!isOpen) }} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href="#">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">About</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">Sign Up</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">Log In</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
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
                    <img src='assets/images/home_image.png' class="img-fluid" width="300px"></img>
                  </div>
                </Col>
              </Row>
            </Container>
        </div>
        <div className="wrapper">
          <Row className="center"><h1>How it works</h1></Row>
          <br/>
          <Row className="center">
            <h5><big className="logo-font">QuizIt!</big> takes in a paragraph text and output questions relating to the paragraph. 
              For example:
            </h5>
          </Row>
          <Row>
            <Col sm={6}>
              <div className="home-col-left">
              <h2>Input Passage</h2>
              <p className="home-para"><small>Beyoncé's first solo recording was a feature on Jay Z's "'03 Bonnie &amp; Clyde" that was released
              in October 2002, peaking at <strong>number four</strong> on the U.S. Billboard Hot 100 chart. Her
              first solo album Dangerously in Love was released on June 24, 2003, after Michelle Williams and
              Kelly Rowland had released their solo efforts. The album sold 317,000 copies in its first week,
              debuted atop the Billboard 200, and has since sold 11 million copies worldwide. The album's lead
              single, "Crazy in Love", featuring Jay Z, became Beyoncé's first number-one single as a solo artist
              in the US. The single "Baby Boy" also reached number one, and singles, "Me, Myself and I" and
              "Naughty Girl", both reached the top-five. The album earned Beyoncé a then record-tying five awards
              at the 46th Annual Grammy Awards; Best Contemporary R&amp;B Album, Best Female R&amp;B Vocal Performance for
              "Dangerously in Love 2", Best R&amp;B Song and Best Rap/Sung Collaboration for "Crazy in Love", and Best
              R&amp;B Performance by a Duo or Group with Vocals for "The Closer I Get to You" with Luther
              Vandross.</small></p>
              <h2>Answer Key</h2>
              <p className="home-para"><strong>"number four"</strong></p>
              </div>
            </Col>
            <Col sm={6} className="home-col-right">
              <div>
              <h2>Quiz Generated</h2>
              <p className="home-ans">What was the highest Beyonce's first solo recording achieved in the Billboard Hot 100?</p>
              </div>
            </Col>
          </Row>
          <br/>
          <Row><hr></hr></Row>
          <Row className="center"><h1>Try it out!</h1></Row>
          <div className="home-form">
              <Form inline>
                  <FormGroup row className="mb-2 mr-sm-2 mb-sm-0">
                      <Col sm={6}>
                        <div className="home-col-left">
                          <h2><Label for="input_passage">Input passage: </Label></h2>
                          <Input type="textarea" name="input_passage" id="input_passage"
                              placeholder="Enter the text paragraph" />
                          <br/>
                          <h2><Label for="answer">Answer key:</Label></h2>
                          <Input type="textarea" name="answer" 
                              id="answer"
                              placeholder="Enter the answer key" />
                          <br/>
                          <Button>Submit</Button>
                        </div>
                      </Col>
                      <Col sm={6} className="home-col-right">
                          <h2>Question Generated</h2>
                          <p></p>
                      </Col>
                  </FormGroup>
                  <br></br>
              </Form>
          </div>
          <hr/>
        </div>
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
              <br/><a href="#">Home</a>
              <br/><a href="#">About</a>
              <br/><a href="#">Sign Up</a>
              <br/><a href="#">Log In</a>
              <br/><a href="#">Report a Problem</a>
            </p>
          </Col>
          <Col sm={3}>
            <p>
              <strong>Follow Us</strong>
              <br/><a className="btn btn-social-icon btn-facebook" href="http://www.facebook.com/profile.php?id="><i className="fa fa-facebook"></i></a>
              <a className="btn btn-social-icon btn-linkedin" href="http://www.linkedin.com/in/"><i className="fa fa-linkedin"></i></a>
              <br/><a className="btn btn-social-icon btn-twitter" href="http://twitter.com/"><i className="fa fa-twitter"></i></a>
              <a className="btn btn-social-icon btn-google" href="http://youtube.com/"><i className="fa fa-youtube"></i></a>
            </p>
          </Col>
          <Col sm={3}>
            <p>
              <strong>Subscribe</strong>
              <Form inline>
                <div>
                <Input bsSize="sm" type="email" name="subscribe" id="subscribe"
                    placeholder="Enter your email" />
                <Button className="btn-sm" type="submit" name="submit" id="submit">Submit</Button>
                </div>
              </Form>
            </p>
          </Col>
          </Row>
          <br/>
          <Row className="center"><p>Copyright &copy; 2022 by Tran Thuy Dung</p></Row>
        </div>
      </div>
        
    );
}
  
export default App;