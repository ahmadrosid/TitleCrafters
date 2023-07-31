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

export type TitleStore = {
  name: string;
  idea: Idea;
  suggestions: OptionIdea[];
  results: any[];
  style: Message;
  frameworks: CopyFramework[];
};

interface ConfigStore {
  titles: Map<string, TitleStore>;
  apikey: string;
  model: OptionModel;
  temperature: number;
  activeId: string;
  rightbarView: boolean;
}

const storeKey = "config_store";
const localStoreJson = window.localStorage.getItem(storeKey);
const initialTitles: TitleStore = {
  name: "",
  idea: {
    title: "",
    language: "",
  },
  suggestions: [],
  results: [],
  style: {
    role: "system",
    content: "",
  },
  frameworks: [],
};

const titles = new Map<string, TitleStore>();
titles.set(crypto.randomUUID(), initialTitles);
const defaultInitialState: ConfigStore = {
  titles,
  apikey: "",
  model: "gpt-4",
  temperature: 0.0,
  activeId: "",
  rightbarView: false,
};

export const useConfigStore = create<ConfigStore>()(
  immer(() =>
    localStoreJson ? deserializeStore(localStoreJson) : defaultInitialState
  )
);

function reviver(key: string, value: any): any {
  if (key === "titles" && Array.isArray(value)) {
    return new Map(
      value.map(([id, chatbot]) => {
        return [id, chatbot];
      })
    );
  }
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

export function deserializeStore(json: string): ConfigStore {
  const cache = JSON.parse(json, reviver);
  const store = merge(defaultInitialState, cache);

  // migrate old format
  if ("idea" in store) {
    const id = crypto.randomUUID();
    if (cache.frameworks.length > 0) {
      if (!cache.frameworks[0].label) {
        // migrate old format
        cache.frameworks = cache.frameworks.map((framework: any) => {
          return { label: framework, description: "" };
        });
      }
    }
    delete store.idea;
    delete store.suggestions;
    delete store.results;
    delete store.style;
    delete store.frameworks;
    cache.name = cache.idea.title || "";
    store.titles = new Map<string, TitleStore>();
    store.titles.set(id, cache);
    store.activeId = id;
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

function parseMapValue(_key: string, value: any): any {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}

export function replaceStore(newStore: ConfigStore) {
  useConfigStore.setState(() => newStore);
}

export function serializeStore(store: ConfigStore): string {
  return JSON.stringify(store, parseMapValue);
}

export function setApikey(apikey: string) {
  useConfigStore.setState((state) => {
    state.apikey = apikey;
  });
}

export function setIdea(id: string, idea: Idea) {
  useConfigStore.setState((state) => {
    const title = state.titles.get(id);
    if (title) {
      title.name = idea.title;
      title.idea = idea;
    }
  });
}

export function setSuggestions(id: string, suggestions: OptionIdea[]) {
  useConfigStore.setState((state) => {
    const title = state.titles.get(id);
    if (title) {
      title.suggestions = suggestions;
    }
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

export function setResults(id: string, results: any[]) {
  useConfigStore.setState((state) => {
    const title = state.titles.get(id);
    if (title) {
      title.results = results;
    }
  });
}

export function setStyle(id: string, content: string) {
  useConfigStore.setState((state) => {
    const title = state.titles.get(id);
    if (title) {
      title.style = { ...title.style, content };
    }
  });
}

export function setFrameworks(id: string, frameworks: CopyFramework[]) {
  useConfigStore.setState((state) => {
    const title = state.titles.get(id);
    if (title) {
      title.frameworks = frameworks;
    }
  });
}

export function setActiveId(id: string) {
  useConfigStore.setState((state) => {
    state.activeId = id;
  });
}

export function newIdea() {
  useConfigStore.setState((state) => {
    const id = crypto.randomUUID();
    state.titles.set(id, initialTitles);
    state.activeId = id;
  });
}

export function removeTitle(id: string) {
  useConfigStore.setState((state) => {
    if (!state.titles.get(id)) return;
    state.titles.delete(id);
    if (state.titles.size === 0) {
      state.activeId = "";
    } else {
      state.activeId = state.titles.keys().next().value;
    }
  });
}

export function toggleRightbarView() {
  useConfigStore.setState((state) => {
    state.rightbarView = !state.rightbarView;
  });
}
