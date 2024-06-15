import create from "zustand";
interface State {
  contract: any;
  setContract: (contract: any) => void;
  provider: any;
  setProvider: (provider: any) => void;
  signer: any;
  setSigner: (signer: any) => void;
}

export const useStore = create<State>((set) => ({
  contract: null,
  setContract: (contract) => set({ contract }),
  provider: null,
  setProvider: (provider) => set({ provider }),
  signer: null,
  setSigner: (signer) => set({ signer }),
}));
