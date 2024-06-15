import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ethers, BrowserProvider, Contract, formatUnits } from "ethers";
import axios from "axios";
import DataContractFactory from "../../artifacts/contracts/DataContractFactory.sol/DataContractFactory.json";
import { useStore } from "../store/store";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";

const Upload = () => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [file, setFile] = useState<File | null>(null);
  const { setContract, setProvider, setSigner } = useStore();
  useEffect(() => {
    const initialize = async () => {
      window;
      if ((window as any).ethereum == null) {
        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed,
        // so they only have read-only access
        console.log("MetaMask not installed; using read-only defaults");
        setProvider(ethers.getDefaultProvider());
      } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        const providerT = new BrowserProvider(walletProvider!);
        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.

        // "0x966efc9A9247116398441d87085637400A596C3F",
        const signerT = await providerT.getSigner();
        const contractT = new ethers.Contract(
          "0x9624480dd377F15E910Cd85eCc2982DB86b771B4",
          DataContractFactory.abi,
          signerT
        );

        setContract(contractT);
        setSigner(signerT);
        setProvider(providerT);

        console.log(providerT);
        console.log(signerT);
        console.log(contractT);

        // await contractT.mintTokensToNewUsers();
      }
    };

    initialize();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("There was an error uploading the file!", error);
    }
  };
  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <form onSubmit={handleSubmit}>
          <Label htmlFor="file">Add files here</Label>
          <Input id="file" type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      </div>
      <div>Upload</div>
    </>
  );
};

export default Upload;
