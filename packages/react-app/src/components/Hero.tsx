import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
// import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useStore } from "../store/store";
import { useEffect, useState } from "react";
import { ethers, BrowserProvider, Contract, formatUnits } from "ethers";
import DataContractFactory from "../../artifacts/contracts/DataContractFactory.sol/DataContractFactory.json";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { HeroCards } from "./HeroCards";

export const Hero = () => {
  const {
    setContract,
    setProvider,
    setSigner,
    setPurchase,
    contract,
    setUpload,
    upload,
    purchase,
  } = useStore();
  const { walletProvider } = useWeb3ModalProvider();
  const [rerender, setRerender] = useState<boolean>(false);

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

    if (contract == null) {
      setRerender(!rerender);
    }
  }, [rerender]);

  return (
    <section
      className="container grid place-items-center py-20 md:py-32 gap-10 m-32"
      style={{
        display: !upload && !purchase ? "block" : "none",
        position: "absolute",
        visibility: !upload && !purchase ? "visible" : "hidden",
      }}
    >
      <div className="flex flex-row w-full">
        <div className="text-center lg:text-start space-y-6 w-2/3">
          <main className="text-5xl md:text-6xl font-bold">
            <h1 className="inline">
              <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
                Unlock
              </span>{" "}
              the Value of Your
            </h1>{" "}
            <h2 className="inline">
              <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                Data
              </span>{" "}
              with Xchange
            </h2>
          </main>

          <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
            Xchange is a secure and decentralized platform that empowers users
            to upload and monetize their data on the 0G chain.
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button
              className="w-full md:w-1/3"
              onClick={() => {
                if (!upload) setUpload(true);
              }}
            >
              Get Started
            </Button>

            <a
              rel="noreferrer noopener"
              href="https://github.com/capGoblin/Xchange"
              target="_blank"
              className={`w-full md:w-1/3 ${buttonVariants({
                variant: "outline",
              })}`}
            >
              Github Repository
              <GitHubLogoIcon className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="w-1/3 justify-end ml-40 hidden sm:flex">
          <HeroCards />
        </div>
      </div>

      {/* Hero cards sections */}

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
