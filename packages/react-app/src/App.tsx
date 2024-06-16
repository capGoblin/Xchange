import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import "./App.css";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import Purchase from "./components/Purchase";
import { ScrollToTop } from "./components/ScrollToTop";
import Upload from "./components/Upload";

// 1. Get projectId
const projectId = "YOUR_PROJECT_ID";

// 2. Set chains
const zg = {
  chainId: 16600,
  name: "0g Newton Testnet",
  currency: "A0GI",
  explorerUrl: "https://chainscan-newton.0g.ai",
  rpcUrl: "https://rpc-testnet.0g.ai",
};

// 3. Create a metadata object
const metadata = {
  name: "Xchange",
  description: "Your description",
  url: "https://example.com",
  icons: ["icon1.png", "icon2.png"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [zg],
  projectId,
});

function App() {
  // const { upload, purchase } = useStore();
  return (
    <>
      <Navbar />
      <Hero />
      <Upload />
      <Purchase />
      {/* 
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ /> */}
      {/* <Footer /> */}
      <ScrollToTop />
    </>
  );
}

export default App;
