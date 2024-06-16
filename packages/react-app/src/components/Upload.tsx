import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { ethers, BrowserProvider, Contract, formatUnits } from "ethers";
import axios from "axios";
import DataContractFactory from "../../artifacts/contracts/DataContractFactory.sol/DataContractFactory.json";
import { useStore } from "../store/store";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { FaPlus } from "react-icons/fa6";
import CreateData from "./CreateData";

const Upload = () => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [rootHex, setRootHex] = useState<String>("");
  const [createData, setCreateData] = useState<boolean>(false);

  const { setContract, setProvider, setSigner, setPurchase, upload, purchase } =
    useStore();
  useEffect(() => {
    if (purchase) setPurchase(false);
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
          "0x94018d8436f5A2ae49132aCf1C835e0AA05029E7",
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
      console.log(response.data);
      const str = extractRootHex(response.data);
      console.log(str);
      // if (!str) throw new Error("Root hex not found");
      if (str) setRootHex(str);
      setOpen(true);
      setCreateData(true);
    } catch (error) {
      console.error("There was an error uploading the file!", error);
    }
  };

  const extractRootHex = (data: string) => {
    const match = data.match(/root=(0x[a-fA-F0-9]+)/);
    const root = match ? match[1] : null;
    return root;
  };
  return (
    <div className="flex justify-center items-center m-48">
      <div
        className="grid items-center justify-center gap-1.5 h-max w-max"
        style={{
          display: upload && !purchase ? "block" : "none",
          // position: "absolute",
          visibility: upload && !purchase ? "visible" : "hidden",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full w-full items-center justify-center space-y-20"
        >
          <Label htmlFor="file" className="flex space-x-4 justify-center">
            <FaPlus className="h-7 w-7" />
            <div className="text-lg h-8">Add files here</div>
          </Label>
          <div className="space-y-4">
            <Input
              id="file"
              type="file"
              className="h-10 border-spacing-2 rounded-md"
              onChange={handleFileChange}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                className="h-10 w-2/4 border-spacing-2 rounded-md"
              >
                Upload Listing
              </Button>
            </div>
          </div>
        </form>
        {createData && (
          <CreateData rootHex={rootHex} open={open} setOpen={setOpen} />
        )}
      </div>
    </div>
  );
};

export default Upload;
