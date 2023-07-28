import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import merge from "lodash.merge";
import { Message } from "@/lib/openai";
import { CopyFramework } from "@/lib/frameworks";

export type Idea = {
  title: string;
  language: string;
};

export type OptionIdea = Idea & {
  framework: string;
};

export type OptionModel = "gpt-3.5-turbo" | "gpt-4";

interface ConfigStore {
  apikey: string;
  idea: Idea;
  suggestions: OptionIdea[];
  model: OptionModel;
  temperature: number;
  results: any[];
  style: Message;
  frameworks: CopyFramework[];
}

const storeKey = "config_store";
const localStoreJson = window.localStorage.getItem(storeKey);
const defaultInitialState: ConfigStore = {
  apikey: "",
  idea: {
    title: "",
    language: "",
  },
  suggestions: [],
  model: "gpt-4",
  temperature: 0.0,
  results: [],
  style: {
    role: "system",
    content: "",
  },
  frameworks: [],
};

export const useConfigStore = create<ConfigStore>()(
  immer(() =>
    localStoreJson ? deserializeStore(localStoreJson) : defaultInitialState
  )
);

export function deserializeStore(json: string): ConfigStore {
  const store = merge(defaultInitialState, JSON.parse(json));
  if (store.frameworks.length > 0) {
    if (!store.frameworks[0].label) {
      // migrate old format
      store.frameworks = store.frameworks.map((framework: any) => {
        return { label: framework, description: "" };
      });
    }
  }
  return store;
}

// to prevent cycles only update local storage
// if the new store is different from existing
let existingStoreValue: string | undefined = undefined;

useConfigStore.subscribe((store) => {
  const storeValue = serializeStore(store);
  if (storeValue !== existingStoreValue) {
    window.localStorage.setItem(storeKey, storeValue);
  }
});

window.addEventListener("storage", (event: StorageEvent) => {
  if (
    event.key === "state" &&
    event.newValue &&
    event.oldValue !== event.newValue
  ) {
    existingStoreValue = event.newValue;
    replaceStore(deserializeStore(event.newValue));
  }
});

export function replaceStore(newStore: ConfigStore) {
  useConfigStore.setState(() => newStore);
}

export function serializeStore(store: ConfigStore): string {
  return JSON.stringify(store);
}

export function setApikey(apikey: string) {
  useConfigStore.setState((state) => {
    state.apikey = apikey;
  });
}

export function setIdea(idea: Idea) {
  useConfigStore.setState((state) => {
    state.idea = idea;
  });
}

export function setSuggestions(suggestions: OptionIdea[]) {
  useConfigStore.setState((state) => {
    state.suggestions = suggestions;
  });
}

export function setModel(model: OptionModel) {
  useConfigStore.setState((state) => {
    state.model = model;
  });
}

export function setTemperature(temperature: number) {
  useConfigStore.setState((state) => {
    state.temperature = temperature;
  });
}

export function setResults(results: any[]) {
  useConfigStore.setState((state) => {
    state.results = results;
  });
}

export function setStyle(content: string) {
  useConfigStore.setState((state) => {
    state.style = { ...state.style, content };
  });
}

export function setFrameworks(frameworks: CopyFramework[]) {
  useConfigStore.setState((state) => {
    state.frameworks = frameworks;
  });
}
