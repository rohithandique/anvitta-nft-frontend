import React, { useState, useEffect } from "react";
import Upload from "./components/Upload";
import {
   Button, Container
} from "@chakra-ui/react"

function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
    } else {
        console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)

    } else {
        console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error)
    }
  }

  const renderConnectedUI = () => (
    <Button onClick={()=>{connectWallet()}}>
      Connect to Wallet
    </Button>
  );

  const renderMintUI = () => (
    <Upload />
  )

  return (
    <Container mt={40}>
      {(currentAccount) ? renderMintUI() : renderConnectedUI()}
    </Container>
  );
}

export default App;
