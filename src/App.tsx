import { useCallback, useState } from "react";
import { Button, buttonVariants } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import toast from "react-hot-toast";
import { fetchChat } from "./lib/openai";
import { SelectModel } from "./components/select-model";
import { Slider } from "./components/ui/slider";
import { isError } from "./lib/result";
import { Loader2 } from "lucide-react";
import { TableTitle } from "./components/table-title";
import {
  setApikey,
  setIdea,
  setResults,
  setStyle,
  setTemperature,
  useConfigStore,
} from "./stores/config-store";
import { SelectFrameworks } from "./components/select-frameworks";
import { GithubIcon } from "./components/github-icon";
import { cn } from "./lib/utils";
import { SelectTone } from "./components/select-tone";

export default function App() {
  const { apikey, idea, temperature, model, results, style, frameworks } =
    useConfigStore((state) => state);

  const [controller, setController] = useState<AbortController | null>(null);

  const abortChat = useCallback(() => {
    controller?.abort();
  }, [controller]);

  const handleSubmitGenerate = useCallback(async () => {
    if (apikey === "") {
      toast.error("Please enter your OpenAI apikey");
      return;
    }

    if (frameworks.length === 0) {
      toast.error("Please select at least one framework");
      return;
    }

    setResults([]);
    const controller = new AbortController();
    setController(controller);

    const resultChat = await fetchChat({
      apikey: apikey,
      controller: controller,
      body: {
        model: model,
        temperature: temperature,
        messages: [
          {
            role: "system",
            content: `Selected frameworks: \n${frameworks
              .map((item) => item.label + " : " + item.description)
              .join("\n")}}`,
          },
          {
            role: "system",
            content: "Writing style: " + style.content,
          },
          {
            role: "system",
            content: `Generate title using selected frameworks and writing style. Please use language ${idea.language}. Format in csv with column Framework, Title`,
          },
          {
            role: "user",
            content: idea.title,
          },
        ],
      },
    });
    setController(null);

    if (isError(resultChat)) {
      toast.error(resultChat.message);
      return;
    }

    if (resultChat.choices.length === 0) {
      toast.error("No result");
      return;
    }

    setResults([resultChat.choices[0].message.content]);
  }, [
    apikey,
    frameworks,
    model,
    temperature,
    idea.title,
    idea.language,
    style.content,
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex min-h-[90dvh]">
        <div className="w-full max-w-[260px] p-4 space-y-4">
          <h1 className="text-3xl font-bold">Title Crafters</h1>
          <a
            href="https://github.com/ahmadrosid/TitleCrafters"
            target="_blank"
            className={cn(
              buttonVariants({ variant: "link" }),
              "px-0 gap-2 w-full justify-start"
            )}
          >
            <GithubIcon className="text-black w-4" />
            <span>Free opensource</span>
          </a>
          <div className="space-y-1">
            <Label>OpenAI apikey</Label>
            <Input
              defaultValue={apikey}
              onChange={(e) => setApikey(e.target.value)}
              type="password"
              placeholder="Enter OpenAI apikey"
            />
          </div>
          <div className="space-y-1">
            <Label>Model</Label>
            <SelectModel />
          </div>
          <div className="space-y-1">
            <Label className="justify-between flex items-center pb-2">
              <span>Temperature</span>
              <span>{temperature}</span>
            </Label>
            <Slider
              id="temperature"
              max={1}
              defaultValue={[temperature]}
              step={0.1}
              onValueChange={([val]) => setTemperature(val)}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Temperature"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="p-4 space-y-2">
            <Label>What is your idea?</Label>
            <Input
              defaultValue={idea.title}
              onChange={(e) => setIdea({ ...idea, title: e.target.value })}
              type="text"
              placeholder="Enter your general idea"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="grid gap-1 pt-1">
                <Label>Frameworks</Label>
                <SelectFrameworks />
              </div>
              <div>
                <Label>Language</Label>
                <Input
                  defaultValue={idea.language}
                  onChange={(e) =>
                    setIdea({ ...idea, language: e.target.value })
                  }
                  type="text"
                  placeholder="Enter Language"
                />
              </div>
              <div>
                <Label>Tone</Label>
                <SelectTone onValueChange={setStyle} />
              </div>
            </div>
            <Button
              onClick={() => {
                if (controller === null) handleSubmitGenerate();
                else abortChat();
              }}
            >
              {controller ? (
                <>
                  <Loader2 className="animate-spin w-4 mr-2" />
                  Stop
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
          <div className="p-4">
            <TableTitle data={results} />
          </div>
        </div>
      </div>

      <div className="p-6">
        Built by{" "}
        <a
          className="underline text-gray-900 hover:text-gray-950"
          href="https://ahmadrosid.com"
        >
          ahmadrosid
        </a>
        . Hosted on{" "}
        <a
          className="underline text-gray-900 hover:text-gray-950"
          href="https://vercel.com"
        >
          Vercel.
        </a>{" "}
        The source code is available on{" "}
        <a
          className="underline text-gray-900 hover:text-gray-950"
          href="https://github.com/ahmadrosid/TitleCrafters"
        >
          GitHub.
        </a>
      </div>
    </div>
  );
}
