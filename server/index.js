const express = require("express");
const { Web3 } = require("web3");
const ABI = require("./ABI.json");
const cors = require("cors");

const app = express();
app.use(cors());
const web3 = new Web3("HTTP://127.0.0.1:7545");
const contractAddress = "0xe703944A00F60E50D3c423a29e117Ad5DeF94320";
const contract = new web3.eth.Contract(ABI, contractAddress);

app.use(express.json());
const GenderVerification = (gender) => {
  const genderValue = gender.toLowerCase();

  if (
    genderValue === "male" ||
    genderValue === "female" ||
    genderValue === "others"
  ) {
    return true;
  }
  return false;
};
const PartyClash = async (party) => {
  // Fetch the list of candidates from the smart contract.
  const CandidateList = await contract.methods.candidateList().call();

  // Check if there are candidates with a matching party name (case-insensitive).
  const exists = CandidateList.some(
    (e) => e.party.toLowerCase() === party.toLowerCase()
  );

  // Return a boolean value indicating whether candidates with the specified party name exist.
  return exists;
};

app.post("/api/verify", async (req, res) => {
  const { gender, party } = req.body;

  const genderStatus = GenderVerification(gender);
  const partyclash = await PartyClash(party);
  if (genderStatus === true && partyclash === false) {
    res.status(200).json({
      status: "success",
      message: "Registration sucessfully done",
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "Failed to register party",
    });
  }
});
app.post("/api/register", (req, res) => {
  const { gender } = req.body;
  const genderStatus = GenderVerification(gender);
  if (genderStatus === true) {
    res.status(200).json({
      status: "sucessful",
      message: "Successfully registered",
      gender: gender,
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "Failed to register Voter",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
