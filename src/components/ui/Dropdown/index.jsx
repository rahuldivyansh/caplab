import { Menu } from '@headlessui/react';
import React, { Fragment } from 'react'

const Dropdown = (props) => {
    return (
        <Menu className="flex flex-col relative items-end justify-end left-0" as="div">
            <Menu.Button className="w-full" as={Fragment}>{props.MenuBtn}</Menu.Button>
            <Menu.Items className="flex flex-col overflow-hidden absolute divide-y divide-white/10 z-[1000] right-0 top-12 bg-background-light dark:bg-background-dark border dark:border-white/10 rounded-lg min-w-[12rem] sm:min-w-[16rem]">
                {props.children}
            </Menu.Items>
        </Menu>
    )
}

export default Dropdown;