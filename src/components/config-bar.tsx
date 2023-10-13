import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectModel } from "@/components/select-model";
import { Slider } from "@/components/ui/slider";
import {
  newIdea,
  setApikey,
  setTemperature,
  useConfigStore,
} from "@/stores/config-store";
import { PlusCircle } from "lucide-react";

export function ConfigSidebar() {
  const { apikey, temperature } = useConfigStore((state) => ({
    ...state,
    data: state.titles.get(state.activeId),
  }));
  return (
    <div className="w-full max-w-[16rem] p-4 space-y-4">
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
  );
}
