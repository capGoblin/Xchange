import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStore } from "../store/store";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import DataContract from "../../artifacts/contracts/DataContract.sol/DataContract.json";
import { ethers } from "ethers";

interface DataItem {
  _name: string;
  _description: string;
  _dataUrl: string;
  _priceWei: string;
  _keywords: string[];
  _size: string;
}

const Purchase = () => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const { dataItems, setDataItems, contract, provider, signer, setUpload } =
    useStore();
  const [dataContracts, setDataContracts] = useState<string[]>([]);

  useEffect(() => {
    setUpload(false);
    // if (!address) return;
    console.log(address);

    async function fetchUserContracts(userAddress: string) {
      try {
        const contracts = await contract.getContractsByOwner(userAddress);
        console.log(`Contracts for user ${userAddress}:`, contracts);
        setDataContracts(contracts);

        displayPurchase(contracts);
      } catch (error) {
        console.error("Error fetching user contracts:", error);
      }
    }

    fetchUserContracts(address!);
    // setDataItems([
    //   {
    //     _name: "John Doe",
    //     _description: "This is a sample description",
    //     _dataUrl: "https://example.com/data",
    //     _priceWei: "1000000000000000000", // 1 ETH in Wei
    //     _keywords: ["keyword1", "keyword2"],
    //     _size: "1MB",
    //   },
    //   {
    //     _name: "Jane Smith",
    //     _description: "Another sample description",
    //     _dataUrl: "https://example.com/data2",
    //     _priceWei: "2000000000000000000", // 2 ETH in Wei
    //     _keywords: ["keyword3", "keyword4"],
    //     _size: "2MB",
    //   },
    //   {
    //     _name: "Alice Johnson",
    //     _description: "Yet another description",
    //     _dataUrl: "https://example.com/data3",
    //     _priceWei: "1500000000000000000", // 1.5 ETH in Wei
    //     _keywords: ["keyword5", "keyword6"],
    //     _size: "1.5MB",
    //   },
    //   {
    //     _name: "Bob Brown",
    //     _description: "Description for Bob",
    //     _dataUrl: "https://example.com/data4",
    //     _priceWei: "500000000000000000", // 0.5 ETH in Wei
    //     _keywords: ["keyword7", "keyword8"],
    //     _size: "500KB",
    //   },
    //   {
    //     _name: "Charlie Davis",
    //     _description: "Charlie's description",
    //     _dataUrl: "https://example.com/data5",
    //     _priceWei: "3000000000000000000", // 3 ETH in Wei
    //     _keywords: ["keyword9", "keyword10"],
    //     _size: "3MB",
    //   },
    // ]);
  }, []);

  const displayPurchase = async (contractAddress: string[]) => {
    const purchaseArr: DataItem[] = [];
    for (const contractAdd of contractAddress) {
      const contract = new ethers.Contract(
        contractAdd,
        DataContract.abi,
        signer
      );

      const name = await contract.name();
      const description = await contract.description();
      const priceWei = await contract.priceWei();
      const priceEth = ethers.formatEther(priceWei);
      const keywords = await contract.keywords();
      const size = await contract.size();

      purchaseArr.push({
        _name: name,
        _description: description,
        _dataUrl: "",
        _priceWei: priceEth,
        _keywords: keywords,
        _size: size,
      });

      // setDataItems([
      //   ...dataItems,
      //   {
      //     _name: name,
      //     _description: description,
      //     _dataUrl: "",
      //     _priceWei: priceWei,
      //     _keywords: keywords,
      //     _size: size,
      //   },
      // ]);
    }

    setDataItems(purchaseArr);
    // try {
    //   await contract.purchaseDataContract(contractAddress, {
    //     value: ethers.utils.parseEther("0.0001"),
    //   });
    // } catch (error) {
    //   console.error("Error purchasing data contract:", error);
    // }
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 overflow-auto p-6 md:p-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dataItems!.map((input, index) => (
            <Card key={index}>
              <CardHeader className="flex items-center gap-4">
                <Avatar>
                  <img src="/placeholder.svg" alt="User Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-semibold">{input._name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {input._description}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* <div> */}
                {/* <div className="text-sm font-semibold">Data URL</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <a
                      href={input._dataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {input._dataUrl}
                    </a>
                  </div> */}
                {/* </div> */}
                <div>
                  <div className="text-sm font-semibold">Price (A0GI)</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {input._priceWei}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Keywords</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {input._keywords.includes(",")
                      ? input._keywords.join(", ")
                      : input._keywords}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Size</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {input._size}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* <FaLinkedin className="h-6 w-6" /> */}
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* <FaGithub className="h-6 w-6" /> */}
                  </a>
                </div>
              </CardContent>
              <div className="flex justify-evenly space-x-12 mb-8 mr-5">
                <Button className="w-1/2 mx-5 bg-green-600">Purchase</Button>
                <Button variant="destructive" className="w-1/2 mx-5">
                  Flag
                </Button>
              </div>
              {/* <div className="flex justify-center -mt-4 mb-4">
              <Button variant="secondary" className="w-full mx-5">
                Close
              </Button>
            </div> */}
            </Card>
          ))}
          {/* )) */}
          {/* } */}
        </div>
      </main>
    </div>
  );
};

export default Purchase;
