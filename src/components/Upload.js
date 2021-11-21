import React, { useRef } from "react"
import {api_key, test_api_key} from "../secrets";
import { ethers } from "ethers";
import abi from "../utils/abi.json";
import {
  FormControl, FormLabel, Input, Button, Container, Image
} from "@chakra-ui/react"


function Upload() {

    const contract_address = "0xbf4987BD601b9B80C1b5269EE19F9ca81Ff7E27d";
    const fileInputRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();

    const mintNft = async (_name, _description, _url) => {
        try {
          const { ethereum } = window; //injected by metamask
    
          if (ethereum) {
    
            //connect to an ethereum node
            const provider = new ethers.providers.Web3Provider(ethereum); 
            //gets the account
            const signer = provider.getSigner(); 
            //connects with the contract
            const connectedContract = new ethers.Contract(contract_address, abi.abi, signer);
    
            console.log("Going to pop wallet now to pay gas...")
            //call the mintNFT function of the contract
            let nftTxn = await connectedContract.mintNFT(_name, _description, _url);
    
            console.log("Mining...please wait.")
            console.log(nftTxn);
            console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`);
    
          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          console.log(error)
        }
    }  

    const onUpload = (e) => {
        e.preventDefault();
        console.log(fileInputRef.current.files[0])
        const formData = new FormData();
        formData.append(  
        "file",
        fileInputRef.current.files[0],
        );

        fetch("https://api.nft.storage/upload", {
        method: "POST",
        body: formData,
        headers: {
            'Authorization': 'Bearer '+test_api_key
        }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            const NFTname = nameRef.current.value;
            const NFTdescription = descriptionRef.current.value;
            const NFTurl = json.value.cid + "/" + fileInputRef.current.files[0].name;
            console.log(NFTname)
            console.log(NFTdescription)
            mintNft(NFTname, NFTdescription, NFTurl);
        });
    }

    return (
        <Container mt={40}>
        <form onSubmit={onUpload}>
        <FormControl>
            <FormLabel>Upload File</FormLabel>
            <Input type="file" ref={fileInputRef}/>
        </FormControl>
        <FormControl id="name">
            <FormLabel>NFT name</FormLabel>
            <Input type="name" ref={nameRef}/>
        </FormControl>
        <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Input type="text" ref={descriptionRef}/>
        </FormControl>
        <Button type="submit" > Submit </Button>
        </form>
        </Container>
    );
}

export default Upload;
