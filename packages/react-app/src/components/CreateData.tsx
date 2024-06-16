import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useStore } from "../store/store";

const CreateData = ({
  rootHex,
  open,
  setOpen,
}: {
  rootHex: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [dataUrl, setDataUrl] = useState("");
  const [priceWei, setPriceWei] = useState("");
  const [keywords, setKeywords] = useState("");
  const [size, setSize] = useState("");

  // const { address, chainId, isConnected } = useWeb3ModalAccount();

  const { contract } = useStore();

  const handleSubmit = async () => {
    // Handle the form submission here
    console.log({ name, description, rootHex, priceWei, keywords, size });
    console.log(contract);
    await contract.createDataContract(
      name,
      description,
      rootHex,
      Number(priceWei),
      keywords,
      size,
      {
        value: ethers.parseEther("0.0001"),
      }
    );
    // Add your form submission logic
    setOpen(false); // Close the dialog after submission
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button>
          <FaPlus className="mr-5" /> Create New Request
        </Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Request</DialogTitle>
          <DialogDescription>
            Draft changes to your request here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="ml-5 w-60 max-w-lg"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              className="ml-5 w-60 max-w-lg"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataUrl" className="text-right">
              Data URL
            </Label>
            <Input
              id="dataUrl"
              className="ml-5 w-60 max-w-lg"
              placeholder="Enter data URL"
              value={dataUrl}
              onChange={(e) => setDataUrl(e.target.value)}
            />
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priceWei" className="text-right">
              Price (Wei)
            </Label>
            <Input
              id="priceWei"
              className="ml-5 w-60 max-w-lg"
              placeholder="Enter price in Wei"
              value={priceWei}
              onChange={(e) => setPriceWei(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keywords" className="text-right">
              Keywords
            </Label>
            <Input
              id="keywords"
              className="ml-5 w-60 max-w-lg"
              placeholder="Enter keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">
              Size
            </Label>
            <Input
              id="size"
              className="ml-5 w-60 max-w-lg"
              placeholder="Enter size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateData;
