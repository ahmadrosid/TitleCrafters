import { useCallback, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { fetchChat } from "@/lib/openai";
import { SelectModel } from "@/components/select-model";
import { Slider } from "@/components/ui/slider";
import { isError } from "@/lib/result";
import { Loader2, Trash2Icon } from "lucide-react";
import { TableTitle } from "@/components/table-title";
import {
  newIdea,
  removeTitle,
  setActiveId,
  setApikey,
  setIdea,
  setResults,
  setStyle,
  setTemperature,
  useConfigStore,
} from "./stores/config-store";
import { SelectFrameworks } from "./components/select-frameworks";
import { SelectTone } from "./components/select-tone";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { cn } from "./lib/utils";
import { PlusCircle } from "lucide-react";
import { Transition } from "@headlessui/react";

export default function App() {
  const { titles, activeId, apikey, temperature, model, rightbarView, data } =
    useConfigStore((state) => ({
      ...state,
      data: state.titles.get(state.activeId),
    }));
  const [controller, setController] = useState<AbortController | null>(null);

  const abortChat = useCallback(() => {
    controller?.abort();
  }, [controller]);

  const isValidForm = useCallback(() => {
    if (apikey === "") {
      toast.error("Please enter your OpenAI apikey");
      return false;
    }

    if (data?.frameworks.length === 0) {
      toast.error("Please select at least one framework");
      return false;
    }

    if (data?.idea.language === "") {
      toast.error("Please select your prefered language");
      return false;
    }

    if (data?.style.content === "") {
      toast.error("Please select tone");
      return false;
    }

    return true;
  }, [apikey, data]);

  const handleSubmitGenerate = useCallback(async () => {
    // TODO: validate form using zod
    if (!isValidForm()) return;

    setResults(activeId, []);
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
            content:
              "You are healine generator. Generate title using selected frameworks and writing style. Format in csv with column Framework, Title",
          },
          {
            role: "system",
            content: `Selected frameworks: \n${data?.frameworks
              .map((item) => item.label + " : " + item.description)
              .join("\n")}}`,
          },
          {
            role: "system",
            content: `Writing style: ${data?.style.content}. Language: ${data?.idea.language}`,
          },
          {
            role: "user",
            content: data?.idea.title || "",
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

    setResults(activeId, [resultChat.choices[0].message.content]);
  }, [apikey, data, model, temperature, activeId, isValidForm]);

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-[92dvh]">
        <div className="flex">
          <div className="w-full max-w-[260px] p-4 space-y-4">
            <Button onClick={newIdea} className="w-full justify-between">
              New Idea
              <PlusCircle className="w-4 h-4 mr-l" />
            </Button>
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
          <div className="flex-1 overflow-y-auto max-h-[92dvh]">
            <div className="p-4 space-y-2">
              <Label>What is your idea?</Label>
              <Input
                value={data?.idea.title}
                onChange={(e) =>
                  setIdea(activeId, {
                    language: data?.idea.language || "",
                    title: e.target.value,
                  })
                }
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
                    value={data?.idea.language}
                    onChange={(e) =>
                      setIdea(activeId, {
                        title: data?.idea.title || "",
                        language: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="Enter Language"
                  />
                </div>
                <div>
                  <Label>Tone</Label>
                  <SelectTone
                    activeId={activeId}
                    onValueChange={(val) => setStyle(activeId, val)}
                  />
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
            <div className="p-4 min-h-[58vh]">
              <TableTitle data={data?.results || []} />
            </div>
            <Footer />
          </div>
          <Transition
            show={rightbarView}
            enter="transition-all duration-300"
            enterFrom="-mr-[250px]"
            enterTo="mr-0"
            leave="transition-all duration-300"
            leaveFrom="-mr-0"
            leaveTo="-mr-[250px]"
            className="bg-white border-l overflow-y-auto max-w-[250px] "
          >
            <div className="w-full p-2 space-y-2">
              {Array.from(titles)
                .reverse()
                .map(([key, value]) => (
                  <div
                    key={key}
                    onClick={() => setActiveId(key)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-between pl-2 pr-0 cursor-pointer"
                    )}
                  >
                    <p className="truncate">
                      {value.name ? value.name : "Untitled"}
                    </p>
                    <Button
                      variant="ghost"
                      className="hover:text-red-500"
                      onClick={() => removeTitle(key)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
