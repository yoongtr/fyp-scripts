import React, {useState, useContext} from 'react';
import { UserContext } from "../context/UserContext";
import {
  FormGroup, Label, Input,
  Button, Form, Col, Row, Modal
} from 'reactstrap';
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import QuizAnsModal from './QuizAnsModal';

const Home = () => {
    const [token] = useContext(UserContext);
    const [spinner, setSpinner] = useState(false);
    const [input_passage, setInputPassage] = useState("");
    const [noQn, setNoQn] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [activeModal, setActiveModal] = useState(false);
    const [userMe, setUserMe] = useState(null);

    const toggle = () => setActiveModal(!activeModal);

    const getUser = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
        const response = await fetch("/api/users/me", requestOptions);
        if (!response.ok) {
            setErrorMessage("Something went wrong. Could not fetch your data.")
        } else {
            const data = await response.json();
            setUserMe(data);
        }
    };

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
        // console.log(data);
    }

    const generateQuiz = async (noQn) => {
        setSpinner(true);
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_passage: input_passage }),
        };
        const response = await fetch(`/api/generatequiz/${noQn}`, requestOptions);
        setSpinner(false);
        if (!response.ok) {
            setErrorMessage("Something went wrong. Could not generate quiz.");
        } else {
            const data = await response.json();
            setQuiz(data);
            setLoaded(true);
            // console.log(data);
        }
    }

    const saveQuiz = async(quiz, input_passage) =>{
        var quiz_qns = "";
        var quiz_ans = "";
        quiz.forEach(qna => {
            quiz_qns = quiz_qns + String(qna[1]) + "\n";
            quiz_ans = quiz_ans + "... " + String(qna[0]) + " ..." + "\n";
        })
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ 
                quiz_context: input_passage,
                quiz_qns: quiz_qns,
                quiz_ans: quiz_ans
             }),
          };
        const response = await fetch("api/quiz", requestOptions);
        if (!response.ok) {
            setErrorMessage("Something went wrong. Could not save quiz.");
        } else {
            setSuccessMessage("Quiz Saved! You now can generate another quiz or go to My Account to check for past quizzes.")
        };
    }

    const updateRank = async(user_id) =>{
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
        const response = await fetch(`/api/users/${user_id}/newrank`, requestOptions);
        if (!response.ok) {
            setErrorMessage("Something went wrong. Could not update ranking.");
        };
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitPassage();
    }

    const handleQuiz = (e) => {
        e.preventDefault();
        generateQuiz(noQn);
        getUser();
    }

    const handleModal = () => {
        toggle();
    };

    const quizSubmit = (quiz, input_passage, usermeobj) => {
        // console.log(quiz);
        // console.log(input_passage);
        // console.log(usermeobj);
        const user_id = usermeobj.id
        saveQuiz(quiz, input_passage);
        updateRank(user_id);
    }

    return (
        <div className="wrapper">
            <Row className="center"><h1>How it works</h1></Row>
            <br/>
            <Row className="center">
                <h5><big className="logo-font-dark">QuizIt!</big> takes in a paragraph text and output questions relating to the paragraph. 
                <br/>👇 Try it out 👇
                </h5>
            </Row>
            <hr/>
            {!token && (
            <div>
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
                                    required
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
            </div>
            )}
            {token && (
            <div>
            <div className="home-form">
                <Form inline onSubmit={handleQuiz} id="registered-quiz">
                    <FormGroup row className="mb-2 mr-sm-2 mb-sm-0">
                        <Row>
                                <div className='center'>
                                <h3><Label for="input_passage">Input passage to generate quiz</Label></h3>
                                <Input 
                                    type="textarea" 
                                    name="input_passage" 
                                    value={input_passage}
                                    onChange={(e) => setInputPassage(e.target.value)}
                                    id="input_passage"
                                    rows="10"
                                    required
                                    placeholder="Type your input passage" />
                                <br/>
                                <Input
                                    type="number"
                                    step="1"
                                    min="1"
                                    max="5"
                                    name="no_questions"
                                    value={noQn}
                                    onChange={(e) => setNoQn(e.target.value)}
                                    id="no_questions"
                                    required
                                    placeholder='Input the number of questions to be generated, from 1-5'
                                    >
                                </Input>
                                <br/>
                                <Button>Generate Quiz</Button>
                                </div>
                        </Row>
                    </FormGroup>
                    <br></br>
                </Form>
            </div>
            <div>
                <Row className='center'>
                {spinner && (
                    <p><img src='assets/images/loader.gif' alt='loader' className="img-fluid" width="150px"></img></p>
                )}
                {loaded && quiz ? (
                    <div>
                        <Modal isOpen={activeModal}
                            toggle={toggle}>
                            <QuizAnsModal
                                handleModal={handleModal}
                                quiz={quiz}
                            ></QuizAnsModal>
                        </Modal>
                        <br/>
                        <hr/>
                        <Form>
                            <FormGroup row className="mb-2 mr-sm-2 mb-sm-0">
                                <table className='acc-table'>
                                    <thead>
                                        <tr>
                                            <th colSpan='2'>Quiz Paper</th>
                                        </tr>
                                        <tr>
                                        <td><strong>Question</strong></td>
                                        <td><strong>Your Answer</strong></td>
                                        {/* <td><strong>Answer Key</strong></td> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quiz.map((question) => (
                                            <tr>
                                                <td>{question[1]}</td>
                                                <td>
                                                    <Input
                                                        type="text"
                                                        placeholder='Input your answer'
                                                        required
                                                    ></Input>
                                                </td>
                                                {/* <td>
                                                    ... {question[0]} ...
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </FormGroup>
                            <br/>
                            <span>
                            <Button
                                onClick={() => setActiveModal(true)}
                            >Show Answer Keys</Button>
                            &nbsp;
                            <Button
                                onClick={() => quizSubmit(quiz, input_passage, userMe)}
                            >Save Quiz &amp; Stats</Button>
                            </span>
                            {/* {console.log(input_passage)}
                            {console.log(quiz_qns)}
                            {console.log(quiz_ans)} */}
                        </Form>
                        <br/>
                        <SuccessMessage message={successMessage}/>
                    </div>
                ) : (
                    <ErrorMessage message={errorMessage} />
                )}
                </Row>
            </div>
            </div>
            )}
            <hr/>
        </div>
    )
}
export default Home;