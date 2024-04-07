import { Listbox } from '@headlessui/react';
import React, { Fragment, useState } from 'react'
import { twMerge } from 'tailwind-merge';

const GroupStatusListBoxElement = (props) => {
    const [selectedItem, setSelectedItem] = useState(props.currentItem);
    const handleSelect = (selectedItem) => {
        setSelectedItem(selectedItem);
        props.onItemSelect(selectedItem);
    }
    return (
        <Listbox value={selectedItem} onChange={handleSelect} className="relative" as="div">
            <Listbox.Button className="w-full" as="div">{props.ListBoxButton}</Listbox.Button>
            <Listbox.Options className="border z-10 overflow-hidden dark:border-white/10 divide-y dark:divide-white/10 absolute w-full bg-background-light dark:bg-background-dark rounded-md gap-2">
                {props.list.map((listItem) => (
                    <Listbox.Option
                        key={listItem.id}
                        value={listItem}
                        className={twMerge("cursor-pointer select-none p-2 text-sm hover:bg-gray-50  dark:hover:bg-white/10", selectedItem.id === listItem.id ? "bg-primary/10 text-primary":"text-black dark:text-white")}
                    >
                        <span>{listItem.title}</span>
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    )
}

GroupStatusListBoxElement.defaultProps = {
    list: [{ id: -1, title: "item1" }, { id: 0, title: "item2" }],
    currentItem: { id: -1, title: "item1" },
    onItemSelect: () => { },
    ListBoxButton: () => <>button</>,
}

export default GroupStatusListBoxElement;