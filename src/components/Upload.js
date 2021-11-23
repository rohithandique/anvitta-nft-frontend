import React, { useRef } from "react"
import { ethers } from "ethers";
import abi from "../utils/abi.json";
import {
  FormControl, FormLabel, Input, Button, Container
} from "@chakra-ui/react"
import { ipfsCid } from "../helpers/ipfsCid";

function Upload() {

    const contract_address = "0x73d4Ebde470A7C8ec36612a23594a5Aa1f27660d";
    const fileInputRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    let cid = ""

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
            console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
    
          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          console.log(error)
        }
      }

    const onUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append(  
        "file",
        fileInputRef.current.files[0],
        );

        const hash = await ipfsCid(fileInputRef.current.files[0]);
        console.log(hash._baseCache.get('b'));
        const NFTname = nameRef.current.value;
        const NFTdescription = descriptionRef.current.value;
        const NFTurl = hash._baseCache.get('b');

        fetch("https://api.nft.storage/upload", {
        method: "POST",
        body: formData,
        headers: {
            'Authorization': 'Bearer '+process.env.REACT_APP_TEST_API_KEY
        }
        })
        .then(response => response.json())
        .then(() => {

          const data = {
            "name": nameRef.current.value,
            "description": descriptionRef.current.value,
            "image": "ipfs://"+hash._baseCache.get('b'),
          } ;
          
          let formData  = new FormData();

          formData.append("name",nameRef.current.value);
          formData.append("description",descriptionRef.current.value);
          formData.append("image", "ipfs://"+hash._baseCache.get('b'));

          console.log(formData)

          /*fetch("https://api.nft.storage/store",{
            method: "POST",
            body: formData, 
            headers: {
              'Authorization': 'Bearer '+process.env.REACT_APP_TEST_API_KEY,
            }
          }).then(response => response.json())
          .then((json)=>{
            console.log(json)
            
            //mintNft();
          })*/
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
