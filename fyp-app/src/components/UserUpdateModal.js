import React, { useEffect, useState } from "react";
// import "bulma/css/bulma.min.css";

const UserUpdateModal = ({handleModal, token, id, setErrorMessage }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(`/api/users/me`, requestOptions);

      if (!response.ok) {
        setErrorMessage("Could not get the user");
      } else {
        const data = await response.json();
        setFirstName(data.first_name);
        setLastName(data.last_name);
      }
    };

    if (id) {
      getUser();
    }
  }, [id, token]);

  const cleanFormData = () => {
    setFirstName("");
    setLastName("");
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    // console.log(id, token, firstName, lastName);
    const firstName_str = String(firstName);
    const lastName_str = String(lastName);
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        email: "string",
        first_name: firstName_str,
        last_name: lastName_str,
        practice_count: 0,
        ranking: "string",
        hashed_password: "string"
      }),
    };
    
    const response = await fetch(`/api/users/${id}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong when updating user.");
    } else {
      cleanFormData();
      handleModal();
    }
  };

  return (
    <div className="my-modal">
      <div onClick={handleModal}></div>
      <div>
        <header>
          <h1>
            Update Your Name
          </h1>
        </header>
        <section>
          <form>
            <div className="field">
              <label className="label">First Name</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Last Name</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </section>
        <footer>
          <button className="my-modal-button my-modal-button1" onClick={handleUpdateUser}>
            Update
          </button>
          <button className="my-modal-button my-modal-button1" onClick={handleModal}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UserUpdateModal;