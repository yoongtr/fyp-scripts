import React, { Component } from 'react';
import { Row, Table } from 'reactstrap';

class About extends Component {
    render() {
        return (
            <div className="wrapper">
                <Row>
                    <h5><big className="logo-font-dark">QuizIt!</big> is a Final Year Project under NTU EEE.</h5>
                </Row><br/>
                <Row><h5>About the Authors</h5></Row>
                <Row>
                    <Table>
                        <tr>
                            <td><img src='assets/images/profandy.jpeg' alt='profandy' className="img-fluid" width="200px"></img></td>
                            <td>
                                <p>
                                Andy Khong is currently an Associate Professor in the School of Electrical and Electronic Engineering, 
                                Nanyang Technological University, Singapore.
                                </p>
                                <p>
                                He is the supervisor of this Final Year Project.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td><img src='assets/images/yoong.png' alt='yoong' className="img-fluid" width="200px"></img></td>
                            <td>
                                <p>
                                Thuy Dung Tran (Yoong) is currently a Final Year Student in the School of Electrical and Electronic Engineering, 
                                Nanyang Technological University, Singapore.
                                </p>
                                <p>
                                She is the main author of this project.
                                </p>
                            </td>
                        </tr>
                    </Table>
                </Row><br/>
                <Row><h5>About the AI model</h5></Row>
                <Row><img src='assets/images/t5.gif' alt='t5model' className="img-fluid" width="200px"></img></Row>
            </div>
        )
    }
}
export default About;