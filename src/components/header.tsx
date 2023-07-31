import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { GithubIcon } from "@/components/github-icon";
import { PanelRight, PlusCircle } from "lucide-react";
import { newIdea, toggleRightbarView } from "@/stores/config-store";

export function Header() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="pl-8 pr-8 flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <p className="font-bold">Title Crafters</p>
            <Button onClick={newIdea} size="sm">
              <PlusCircle className="w-4 h-4 mr-2" /> New Idea
            </Button>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <a
              href="https://github.com/ahmadrosid/TitleCrafters"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "link" }),
                "gap-2 w-full justify-start"
              )}
            >
              <GithubIcon className="text-black w-4" />
              <span>Github</span>
            </a>

            <Button size="sm" variant="ghost" onClick={toggleRightbarView}>
              <PanelRight className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
