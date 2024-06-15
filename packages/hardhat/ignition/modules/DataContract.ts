import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DataModule = buildModule("XchangeModule", (m) => {
  const DataContractFactory = m.contract("DataContractFactory", []);

  return {
    DataContractFactory,
  };
});

export default DataModule;
