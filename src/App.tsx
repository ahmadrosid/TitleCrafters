import { useCallback, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  setApikey,
  setIdea,
  setResults,
  setTemperature,
  useConfigStore,
} from "./stores/config-store";
import toast from "react-hot-toast";
import { fetchChat } from "./lib/openai";
import { SelectModel } from "./components/select-model";
import { Slider } from "./components/ui/slider";
import { isError } from "./lib/result";
import { Loader2 } from "lucide-react";
import { TableTitle } from "./components/table-title";
function App() {
  const { apikey, idea, temperature, model, results } = useConfigStore(
    (state) => state
  );

  const [loading, setLoading] = useState(false);

  const handleSubmitGenerate = useCallback(async () => {
    if (apikey === "") {
      toast.error("Please enter your OpenAI apikey");
    }

    setLoading(true);
    setResults([]);

    const resultChat = await fetchChat({
      apikey: apikey,
      body: {
        model: model,
        temperature: temperature,
        messages: [
          {
            role: "system",
            content: `Generate title about "${idea.title}" with copywriting frameworks AIDA, PAS, BAB, 4 P's. Please use bahasa ${idea.language}.`,
          },
          {
            role: "user",
            content: "Please generate title in csv format.",
          },
        ],
      },
    });
    setLoading(false);

    if (isError(resultChat)) {
      toast.error(resultChat.message);
      return;
    }

    if (resultChat.choices.length === 0) {
      toast.error("No result");
      return;
    }

    setResults([resultChat.choices[0].message.content]);
  }, [apikey, model, temperature, idea.title, idea.language]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        <div className="w-full max-w-[260px] p-4 space-y-4">
          <h1 className="text-3xl font-bold">Title Crafters</h1>
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
            <Input
              defaultValue={idea.title}
              onChange={(e) => setIdea({ ...idea, title: e.target.value })}
              type="text"
              placeholder="Enter your general idea"
            />
            <Input
              defaultValue={idea.language}
              onChange={(e) => setIdea({ ...idea, language: e.target.value })}
              type="text"
              placeholder="Enter Language"
            />
            <Button onClick={handleSubmitGenerate}>
              {loading ? <Loader2 className="animate-spin w-4 mr-2" /> : null}
              Generate
            </Button>
          </div>
          <div className="p-4">
            <TableTitle data={results} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
