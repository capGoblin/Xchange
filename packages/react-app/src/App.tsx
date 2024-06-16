import { About } from "./components/About";
import { Cta } from "./components/Cta";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { Newsletter } from "./components/Newsletter";
import { Pricing } from "./components/Pricing";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./components/Services";
import { Sponsors } from "./components/Sponsors";
import { Team } from "./components/Team";
import Upload from "./components/Upload";
import { Testimonials } from "./components/Testimonials";
import "./App.css";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import Purchase from "./components/Purchase";
import { useStore } from "./store/store";

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
  const { upload, purchase } = useStore();
  return (
    <>
      <Navbar />
      {upload == false && purchase == false ? (
        <Hero />
      ) : upload == true && purchase == false ? (
        <Upload />
      ) : purchase == true && upload == false ? (
        <Purchase />
      ) : null}
      {/* {upload ? <Upload /> : null}  */}
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
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
