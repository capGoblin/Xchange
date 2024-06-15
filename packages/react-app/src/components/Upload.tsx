import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const initialize = async () => {
      window;
      if ((window as any).ethereum == null) {
        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed,
        // so they only have read-only access
        console.log("MetaMask not installed; using read-only defaults");
        // setProvider(ethers.getDefaultProvider());
      } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        const providerT = new ethers.BrowserProvider((window as any).ethereum);
        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.

        // "0x966efc9A9247116398441d87085637400A596C3F",
        const signerT = await providerT.getSigner();
        // const contractT = new ethers.Contract(
        //   "0xCfB9fCb9b6395B92673C4B15fA8aaDA81dC450b4",
        //   SkillVouchContract.abi,
        //   signerT
        // );

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
