import React from "react";

const QuizAnsModal = ({handleModal, quiz }) => {
    return (
        <div className="my-modal">
            <div onClick={handleModal}></div>
            <div>
                <ol>
                {quiz.map((ansKey) => (
                            <li>... {ansKey[0]} ...</li>
                ))}
                </ol>
                <button className="my-modal-button my-modal-button1" onClick={handleModal}>
                    Close
                </button>
            </div>
        </div>
    )
}

export default QuizAnsModal;