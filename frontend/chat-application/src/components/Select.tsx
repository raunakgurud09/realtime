import { Combobox } from "@headlessui/react";

import { RiExpandUpDownLine } from "react-icons/ri";
import { CiCircleCheck } from "react-icons/ci";



import React, { useEffect, useState } from "react";
import { classNames } from "../utils";

const Select: React.FC<{
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: { value: string; label: string }) => void;
  placeholder: string;
}> = ({ options, value, placeholder, onChange }) => {
  const [localOptions, setLocalOptions] = useState<typeof options>([]);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  return (
    <Combobox
      className={"w-full"}
      as="div"
      value={options.find((o) => o.value === value)}
      onChange={(val: any) => onChange(val)}
    >
      <div className="relative mt-2">
        <Combobox.Button className="w-full">
          <Combobox.Input
            placeholder={placeholder}
            className='"block w-full h-10 rounded-md outline outline-[1px] text-white/80  focus:ring-1  drop-shadow-xl placeholder:text-sm placeholder:text-white/30  outline-zinc-400/30  px-5 bg-zinc-800/30 text-white  placeholder:text-white/70",'
            onChange={(e: any) => {
              setLocalOptions(
                options.filter((op) => op.label.includes(e.target.value))
              );
            }}
            displayValue={(option: (typeof options)[0]) => option?.label}
          />
        </Combobox.Button>
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <RiExpandUpDownLine
            className="h-5 w-5 text-zinc-400"
            aria-hidden="true"
          />

        </Combobox.Button>

        {localOptions.length > 0 && (
          <Combobox.Options className="outline outline-[1px] outline-zinc-400 absolute z-10 mt-2 p-2 max-h-60 w-full overflow-auto rounded-md bg-black text-base shadow-lg ring-opacity-5 focus:outline-none sm:text-sm">
            {localOptions.map((option) => (
              <Combobox.Option
                key={option.value}
                value={option}
                className={({ active }: any) =>
                  classNames(
                    "cursor-pointer relative rounded-md select-none hover:bg-white hover:text-black py-2 pl-3 pr-9",
                    active ? "bg-dark text-white" : "text-white"
                  )
                }
              >
                {({ active, selected }: any) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected ? "font-semibold" : ""
                      )}
                    >
                      {option.label}
                    </span>
                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CiCircleCheck className="h-5 w-5" aria-hidden="true" />
                        
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default Select;
