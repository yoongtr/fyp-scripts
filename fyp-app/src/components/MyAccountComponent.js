import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import UserUpdateModal from "./UserUpdateModal";
import { Modal } from "reactstrap";

const MyAccount = () => {

    const [token] = useContext(UserContext);
    const [userMe, setUserMe] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [leaders, setLeaders] = useState(null);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);

    const toggle = () => setActiveModal(!activeModal);

    const handleUpdate = async (id) => {
        setId(id);
        setActiveModal(true);
    };

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
            setLoaded(true);
        }
    };

    const getLeaders = async () => { // Gets leaderboard of users by practice count
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
        const response = await fetch("api/users", requestOptions);
        if (!response.ok) {
            setErrorMessage("Something went wrong. Could not fetch leaderboard.")
        } else {
            const data = await response.json();
            setLeaders(data);
            setLoaded(true);
        }
    };

    useEffect(() => {
        getUser();
        getLeaders();
    }, []);

    const handleModal = () => {
        // setActiveModal(!activeModal);
        toggle();
        getUser();
        setId(null);
    };

    return (
        <div className="wrapper">
            <Modal isOpen={activeModal}
                toggle={toggle}>
                <UserUpdateModal
                    handleModal={handleModal}
                    token={token}
                    id={id}
                    setErrorMessage={setErrorMessage}
                />
            </Modal>
            <ErrorMessage message={errorMessage} />
            {loaded && userMe ? (
                <div className="center">
                <h3>Welcome, {userMe.first_name}!</h3><br/>
                <table className="acc-table">
                    <thead>
                    <tr>
                        <th colSpan='2'>MY STATS</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><strong>Username</strong></td>
                        <td>{userMe.email}</td>
                    </tr>
                    <tr>
                        <td><strong>Full Name</strong></td>
                        <td>
                            {userMe.first_name} {userMe.last_name}
                            <br></br>
                            <button
                                className="my-modal-button my-modal-button1"
                                onClick={() => handleUpdate(userMe.id)}
                            >
                                Update
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Practice Count</strong></td>
                        <td>{userMe.practice_count} (View <a href="/myquizzes">my past quizzes</a>)</td>
                    </tr>
                    <tr>
                        <td><strong>Rank</strong></td>
                        <td>{userMe.ranking}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <br />
            <ErrorMessage message={errorMessage} />
            {loaded && leaders ? (
                <table className="acc-table">
                    <thead>
                        <tr>
                            <th colSpan='4'>LEADERBOARD</th>
                        </tr>
                        <tr>
                        <td><strong>Username</strong></td>
                        <td><strong>Full Name</strong></td>
                        <td><strong>Practice Count</strong></td>
                        <td><strong>Rank</strong></td>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((leader) => (
                        <tr key={leader.id}>
                            <td>{leader.email}</td>
                            <td>{leader.first_name} {leader.last_name}</td>
                            <td>{leader.practice_count}</td>
                            <td>{leader.ranking}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
            <div className='center'>
                <br/><br/>
                <p>Tip: Practice more quizzes at your home page to increase your ranking!</p>
                <p>
                    <strong>Rank tiers</strong>
                    <br/>Noob: Less than 3 practices.
                    <br/>Apprentice: 3-5 practices.
                    <br/>Expert: 5-10 practices.
                    <br/>Master: More than 10 practices.
                </p>
            </div>
        </div>
    );
};

export default MyAccount;