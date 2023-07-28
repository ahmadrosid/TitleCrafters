import { Result } from "./result";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatProps = {
  apikey: string;
  body: RequestBody;
  controller: AbortController;
};

export type RequestBody = {
  model: string;
  temperature: number;
  messages: Message[];
};

export type Choice = {
  index: number;
  message: Message;
  finish_reason: string;
};

export type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export type ResponseBody = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
};

export async function fetchChat(
  props: ChatProps
): Promise<Result<ResponseBody>> {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${props.apikey}`,
    },
    body: JSON.stringify(props.body),
    signal: props.controller.signal,
  };

  return fetch("https://api.openai.com/v1/chat/completions", options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => err);
}
