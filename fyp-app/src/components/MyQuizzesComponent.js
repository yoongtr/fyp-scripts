import React, {useState, useContext, useEffect} from 'react';
import { Row, Table } from 'reactstrap';
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const MyQuizzes = () => {

    const [token] = useContext(UserContext);
    const [quiz, setQuiz] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getQuizzes = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
        const response = await fetch("/api/quiz", requestOptions);
        if (!response.ok) {
            setErrorMessage("Something went wrong. Could not fetch quizzes.")
        } else {
            const data = await response.json();
            setQuiz(data);
            setLoaded(true);
        }
    }

    useEffect(() => {
        getQuizzes();
    }, []);


    return (
        <div className="wrapper">
            <Row>
                <h2>My Past Quizzes</h2>
            </Row><br/>
            {loaded && quiz ? (
                <table className='acc-table'>
                    <thead>
                    {console.log(quiz[0].quiz_qns.split('\n').slice(0,-1))}
                        <tr>
                            <th>Date</th>
                            <th>Context Paragraph</th>
                            <th>Questions and Answers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quiz.map((qz) => (
                            <tr key={qz.id}>
                                <td>{qz.quiz_date}</td>
                                <td>{qz.quiz_context}</td>
                                {/* {console.log(qz.quiz_context)} */}
                                <td>
                                    <tr>
                                    {qz.quiz_qns.split('\n').slice(0,-1).map(str => <td>{str}</td>)}
                                    </tr>
                                    <tr>
                                    {qz.quiz_ans.split('\n').slice(0,-1).map(str => <td>{str}</td>)}
                                    </tr>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            ) : (
                <p>No quizzes found!</p>
            )}
            <ErrorMessage message={errorMessage} />
            <p>Go back to <a href="/myaccount">My Account</a>.</p>
        </div>
    )
}
export default MyQuizzes;