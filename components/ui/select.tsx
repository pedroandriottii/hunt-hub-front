"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

const MultiSelect = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
}) => {
  const handleToggle = (option: string) => {
    const selected = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onChange(selected);
  };

  return (
    <SelectPrimitive.Root>
      <SelectPrimitive.Trigger
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>
          {value.length > 0 ? value.join(", ") : "Selecione as tags"}
        </span>
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content className="relative z-50 max-h-96 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
        <SelectPrimitive.Viewport className="p-1">
          {options.map((option) => (
            <SelectPrimitive.Item
              key={option}
              value={option}
              onClick={() => handleToggle(option)}
              className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm focus:bg-accent focus:text-accent-foreground"
            >
              <SelectPrimitive.ItemIndicator>
                {value.includes(option) && <CheckIcon className="h-4 w-4" />}
              </SelectPrimitive.ItemIndicator>
              <SelectPrimitive.ItemText>{option}</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  );
};

export default MultiSelect;
