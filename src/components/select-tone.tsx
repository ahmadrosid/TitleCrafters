import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfigStore } from "@/stores/config-store";

export function SelectTone({
  onValueChange,
  activeId,
}: {
  activeId: string;
  onValueChange: (value: string) => void;
}) {
  const selectedValue = useConfigStore((state) => {
    return state.titles.get(activeId)?.style || { content: "" };
  });
  const options = [
    "Professional",
    "Academic",
    "Casual",
    "Informative",
    "Storytelling",
  ];
  return (
    <Select onValueChange={onValueChange} defaultValue={selectedValue.content}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select tone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tone</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
