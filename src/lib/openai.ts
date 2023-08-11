import { Result } from "./result";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

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

const openaiUrl = "https://api.openai.com/v1/chat/completions";

async function request(props: ChatProps, stream: boolean) {
  return fetch(openaiUrl, {
    signal: props.controller.signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${props.apikey}`,
    },
    method: "POST",
    body: JSON.stringify({ ...props.body, stream }),
  });
}

export async function fetchChatCompletion(
  props: ChatProps
): Promise<Result<ResponseBody>> {
  return request(props, false)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => err);
}

export async function fetchStreamChat(
  props: ChatProps
): Promise<Result<ReadableStreamDefaultReader<Uint8Array>>> {
  const resp = await request(props, true);
  try {
    if (resp.status === 400) {
      const data = (await resp.json()) as {
        error: { message: string[]; type: string };
      };
      return Error(data.error.type + ": " + data.error.message.join("\n"));
    }
    if (resp.status !== 200) {
      return Error(
        resp.status + ": " + resp.statusText || `OpenAI ${resp.status} error`
      );
    }
    if (!resp.body) {
      return Error("Empty response from OpenAI");
    }
    return resp.body.getReader();
  } catch (e: any) {
    return Error(e.message);
  }
}

export async function readStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onDelta: (delta: { content?: string }) => void
): Promise<Result<true>> {
  const decoder = new TextDecoder();

  const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
    if (event.type === "event") {
      const data = event.data;
      try {
        if (data === "[DONE]") {
          return;
        }
        const json = JSON.parse(data);
        if (json.choices[0].finish_reason != null) {
          return;
        }
        onDelta(json.choices[0].delta);
      } catch (e) {
        console.error(e);
      }
    }
  });

  let done, value;
  while (!done) {
    ({ value, done } = await reader.read());
    if (done) {
      break;
    }
    parser.feed(decoder.decode(value));
  }
  return true;
}
