import "./index.css";
import { enableMapSet } from "immer";
import { createRoot } from "react-dom/client";
import { Routes } from "@generouted/react-router";
enableMapSet();

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");
createRoot(root).render(<Routes />);
