import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useConfigStore } from "@/stores/config-store";
import { Label } from "@radix-ui/react-label";
import { useCallback, useState } from "react";

const sampleData = `Stale while revalidate is a caching strategy used in web development. It allows a cached response to be served to a user while simultaneously revalidating the cached response with the server to check if it is still valid. If the cached response is still valid, it is served to the user. If it is no longer valid, the server provides an updated response, which is then stored in the cache for future use. This strategy helps improve performance by reducing the need for frequent server requests while ensuring that the cached data remains up to date.`;

export default function Outline() {
  // const { apikey, model, temperature } = useConfigStore();
  const [controller, setController] = useState<AbortController | null>(null);
  const [data, setData] = useState("");
  const abortChat = useCallback(() => {
    controller?.abort();
  }, [controller]);

  const submitMessage = useCallback(async () => {
    const controller = new AbortController();
    setController(controller);
    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const datas = sampleData.split(" ");
    for (let i = 0; i < datas.length; i++) {
      if (controller !== null && controller.signal.aborted) {
        break;
      }
      setData((prev) => prev + datas[i] + " ");
      const randomMs = Math.floor(Math.random() * 100);
      await wait(randomMs);
    }
    setController(null);
    // const resultChat = await fetchChat({
    //   apikey: apikey,
    //   controller: controller,
    //   body: {
    //     model: model,
    //     temperature: temperature,
    //     messages: [
    //       {
    //         role: "system",
    //         content:
    //           "You are healine generator. Generate title using selected frameworks and writing style. Format in csv with column Framework, Title",
    //       },
    //       {
    //         role: "system",
    //         content: `Selected frameworks: \n${data?.frameworks
    //           .map((item) => item.label + " : " + item.description)
    //           .join("\n")}}`,
    //       },
    //       {
    //         role: "system",
    //         content: `Writing style: ${data?.style.content}. Language: ${data?.idea.language}`,
    //       },
    //       {
    //         role: "user",
    //         content: data?.idea.title || "",
    //       },
    //     ],
    //   },
    // });
    // setController(null);
  }, []);

  const handleSubmitMessage = useCallback(() => {
    if (controller !== null) {
      abortChat();
      return;
    }

    submitMessage();
  }, [abortChat, submitMessage, controller]);

  return (
    <div className="px-8 py-6">
      <h1 className="font-bold text-5xl p-8">Generate outline</h1>
      <div className="container mx-auto min-h-[93dvh]">
        <div className="space-y-2">
          <Label htmlFor="message">What is the outline about?</Label>
          <Input name="idea" placeholder="Type a message" id="message" />
        </div>
        <div className="py-4">
          <Button onClick={handleSubmitMessage}>
            {controller !== null ? "Stop..." : "Generate"}
          </Button>
        </div>
        <div className="py-8">
          <Editor content={data} fileName="data.txt" />
        </div>
      </div>
    </div>
  );
}
