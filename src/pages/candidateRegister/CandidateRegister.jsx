import { useContext } from "react";
import PropTypes from "prop-types";
import CandidateDisplay from "../../components/candidateDisplay/CandidateDisplay";
import Navigation from "../../components/navigation/Navigation";
import { WalletContext } from "../../components/Wallet";
import "./CandidateRegister.css";
import { toast } from "react-hot-toast";

const CandidateRegister = ({ account }) => {
  const { contract } = useContext(WalletContext);
  const candidateRegistration = async (event) => {
    event.preventDefault();
    const name = document.querySelector("#name").value;
    const gender = document.querySelector("#gender").value;
    const party = document.querySelector("#party").value;
    const age = document.querySelector("#age").value;
    const partyDate = {
      gender,
      party,
    };
    try {
      const res = await fetch("http://localhost:3000/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partyDate),
      });

      const data = await res.json();
      console.log(data);
      if (data.message === "Registration sucessfully done") {
        await contract.methods
          .candidateRegister(name, party, age, gender)
          .send({ from: account, gas: 480000 });
        toast.success("Registration successful");
      } else if (data.message === "Failed to register party") {
        throw new Error("Failed to register party");
      } else {
        throw new Error("Failed to register candidate");
      }
    } catch (error) {
      console.log(error);
    }

    //   try {

    //   } catch (error) {
    //     toast.error("Registration Failed");
    //   }
  };
  return (
    <>
      <Navigation account={account} />
      <div className="reg-cand-wrapper">
        <div className="reg-img-wrapper">
          <h1>Welcome to Candidate Register</h1>
          <p>Make your votes count towards the voter you like</p>
          <img src="/register.png" width={300}></img>
        </div>
        <form className="can-reg-form" onSubmit={candidateRegistration}>
          <h3>Register</h3>
          <label htmlFor="name">Name</label>
          <input type="text" id="name"></input>

          <label className="label1" htmlFor="party">
            Party
          </label>
          <input type="text" id="party"></input>

          <label htmlFor="age">Age</label>
          <input type="text" id="age"></input>

          <label htmlFor="gender">Gender</label>
          <input type="text" id="gender"></input>

          <button className="regBtn" type="submit">
            Register
          </button>
        </form>
      </div>
      <CandidateDisplay />
    </>
  );
};
CandidateRegister.propTypes = {
  account: PropTypes.node.isRequired,
};
export default CandidateRegister;
