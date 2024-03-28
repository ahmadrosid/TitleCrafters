import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OptionModel, setModel, useConfigStore } from "@/stores/config-store";

export function SelectModel() {
  const model = useConfigStore((state) => state.model);
  return (
    <Select
      defaultValue={model}
      onValueChange={(e) => setModel(e as OptionModel)}
    >
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Model</SelectLabel>
          <SelectItem value="gpt-4">gpt-4</SelectItem>
          <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
          <SelectItem value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
