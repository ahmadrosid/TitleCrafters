import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryParams } from "@/hooks/useQueryParams";
import { fetchStreamChat, readStream } from "@/lib/openai";
import { useConfigStore } from "@/stores/config-store";
import { Label } from "@radix-ui/react-label";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

export default function Outline() {
  const params = useQueryParams();
  const [title, setTitle] = useState(params.get("title") || "");
  const { apikey, model, temperature } = useConfigStore();
  const [controller, setController] = useState<AbortController | null>(null);
  const [data, setData] = useState("");
  const abortChat = useCallback(() => {
    controller?.abort();
  }, [controller]);

  const submitMessage = useCallback(async () => {
    try {
      console.log("Start chat");
      const controller = new AbortController();
      setController(controller);
      const resultChat = await fetchStreamChat({
        apikey: apikey,
        controller: controller,
        body: {
          model: model,
          temperature: temperature,
          messages: [
            {
              role: "system",
              content:
                "You are outline generator. Generate outline using the BAB copy writing style",
            },
            // {
            //   role: "system",
            //   content: `Selected frameworks: \n${data?.frameworks
            //     .map((item) => item.label + " : " + item.description)
            //     .join("\n")}}`,
            // },
            // {
            //   role: "system",
            //   content: `Writing style: ${data?.style.content}. Language: ${data?.idea.language}`,
            // },
            {
              role: "user",
              content: title,
            },
          ],
        },
      });
      console.log("Succes connect");
      if (resultChat instanceof Error) {
        console.log(resultChat);
        toast.error(resultChat.message);
        setController(null);
        return;
      }
      await readStream(resultChat, (delta) => {
        console.log("delta", delta);
        setData((prev) => prev + delta.content);
      });
    } catch (error: any) {
      console.log(error);
    } finally {
      setController(null);
    }
  }, [apikey, model, temperature, title]);

  const handleSubmitMessage = useCallback(async () => {
    if (controller !== null) {
      abortChat();
      return;
    }

    await submitMessage();
  }, [abortChat, submitMessage, controller]);

  return (
    <div className="px-8">
      <h1 className="font-bold text-5xl p-8">Generate outline</h1>
      <div className="container mx-auto min-h-[93dvh]">
        <div className="space-y-2">
          <Label htmlFor="message">What is the outline about?</Label>
          <Input
            name="idea"
            placeholder="Type a message"
            id="message"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="py-4">
          <Button onClick={handleSubmitMessage}>
            {controller !== null ? "Stop..." : "Generate"}
          </Button>
        </div>
        <div className="py-8">
          <Editor content={data} fileName="outline.txt" />
        </div>
      </div>
    </div>
  );
}
