import { create } from "zustand";

type State = {
  version: string;
};

type AuthStore = {
  GET_VERSION: () => State['version'];
} & State;

export const useSettingsStore = create<AuthStore>((set, get) => ({
  version: '1.0.0',

  GET_VERSION: () => {
    const { version } = get();

    return version;
  },
}));
