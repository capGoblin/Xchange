import create from "zustand";
interface DataItem {
  _name: string;
  _description: string;
  _dataUrl: string;
  _priceWei: string;
  _keywords: string[];
  _size: string;
}

interface State {
  contract: any;
  setContract: (contract: any) => void;
  provider: any;
  setProvider: (provider: any) => void;
  signer: any;
  setSigner: (signer: any) => void;
  dataItems: DataItem[];
  setDataItems: (dataItems: DataItem[]) => void;
  upload: boolean;
  setUpload: (upload: boolean) => void;
  purchase: boolean;
  setPurchase: (purchase: boolean) => void;
}

export const useStore = create<State>((set) => ({
  contract: null,
  setContract: (contract) => set({ contract }),
  provider: null,
  setProvider: (provider) => set({ provider }),
  signer: null,
  setSigner: (signer) => set({ signer }),
  dataItems: [],
  setDataItems: (dataItems) => set({ dataItems }),
  upload: false,
  setUpload: (upload) => set({ upload }),
  purchase: false,
  setPurchase: (purchase) => set({ purchase }),
}));
