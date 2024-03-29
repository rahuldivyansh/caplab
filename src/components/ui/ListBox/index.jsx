import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useFetch from "@/src/hooks/general/useFetch";

const status = [
  { name: "Backlog" },
  { name: "In Progress" },
  { name: "In Review" },
  { name: "Completed" },
];

const ListBox = ({
  status_id,
  group_id,
  currentTodo,
  getTask,
  onModalClose,
}) => {
  const [selected, setSelected] = useState(currentTodo.type + 1);

  const updateStatusType = useFetch({
    url: `/api/status/${group_id}/${status_id}`,
    method: "PUT",
    get_autoFetch: true,
  });

  // Update the todo (status) type.
  useEffect(() => {
    const updateStatus = async () => {
      const change = currentTodo.type + 1 - selected;
      if (change == 0) return;
      const payload = {
        type: selected - 1,
      };
      try {
        const response = await updateStatusType.dispatch(payload);
        if (response.data) {
          await getTask();
          onModalClose();
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateStatus();
    console.log(selected);
  }, [selected]);

  return (
    <div className=" top-16 w-full">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="border relative w-full cursor-default rounded-lg bg-background-light dark:bg-background-dark  py-2 pl-3 pr-10 text-left shadow-sm font-semibold focus:outline-none focus-visible:border-indigo-500 dark:border-white/10 dark:text-white focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate text-left">{status[selected].name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-background-light dark:bg-background-dark border dark:border-white/10 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {status.map((statusVal, statusIdx) => (
                <Listbox.Option
                  key={statusIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-primary/10 text-primary" : "text-gray-900 dark:text-white"
                    }`
                  }
                  value={statusIdx}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"
                          }`}
                      >
                        {statusVal.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default ListBox;

ListBox.defaultProps = {
  placeholder: "Select"
}
