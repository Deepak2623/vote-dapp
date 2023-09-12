import { useContext } from "react";
import PropTypes from "prop-types";
import Navigation from "../../components/navigation/Navigation";
import { WalletContext } from "../../components/Wallet";
import VoterDisplay from "../../components/voterDisplay/VoterDisplay";
import Vote from "../../components/vote/Vote";
import VotingStatus from "../../components/VotingStatus";
import "./VoterRegister.css";
import toast from "react-hot-toast";

const VoterRegister = ({ account }) => {
  const { contract } = useContext(WalletContext);
  const voterRegistration = async (event) => {
    event.preventDefault();
    const name = document.querySelector("#name").value;
    const gender = document.querySelector("#gender").value;
    const age = document.querySelector("#age").value;
    const partyDate = {
      gender,
    };

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partyDate),
      });

      const data = await res.json();
      if (data.message === "Successfully registered") {
        await contract.methods
          .voterRegister(name, age, gender)
          .send({ from: account, gas: 480000 });
        toast.success("Voter Registration sucessfull");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

  };
  return (
    <>
      <Navigation account={account} />
      <div className="status-nav">
        <VotingStatus />
      </div>
      <div className="voter-reg-wrapper ">
        <form className="voter-form" onSubmit={voterRegistration}>
          <h1>Register as Voter</h1>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name"></input>

          <label htmlFor="age">Age:</label>
          <input type="text" id="age"></input>

          <label htmlFor="gender">Gender:</label>
          <input type="text" id="gender"></input>

          <button className="regBtn" type="submit">
            Register
          </button>
        </form>
        <Vote account={account} />
      </div>
      <VoterDisplay />
    </>
  );
};
VoterRegister.propTypes = {
  account: PropTypes.node.isRequired,
};
export default VoterRegister;
