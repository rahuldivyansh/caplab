
import { useState } from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";

export default function Switch(props) {
  return (
    <HeadlessSwitch
      checked={props.enabled}
      onChange={()=>props.setEnabled(!props.enabled)}
      className={`${props.enabled ? "bg-primary" : "bg-gray-400"}
          relative inline-flex items-center h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span
        aria-hidden="true"
        className={`${props.enabled ? "translate-x-8" : "translate-x-0"}
            pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </HeadlessSwitch>
  );
}
Switch.defaultProps = {
    enabled: false,
    setEnabled: () => {},
}
