import React, { memo, useState } from 'react'
import { Combobox } from '@headlessui/react';
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon';
import Layout from '../Layout';
import Typography from '../Typography';
import { CheckIcon } from '@heroicons/react/20/solid';

const CustomComboBox = (props) => {
    const [value, setValue] = useState(props.multiple ? [] : props.value);
    const [query, setQuery] = useState("")
    const onChange = (currValue) => {
        setValue(currValue)
        props.onChange(currValue);
    }
    const onInputChange = (e) => {
        setQuery(e.target.value);
    }
    const filteredList = query === '' ? props.list : props.list.filter((item) => item.displayValue.toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.toLowerCase().replace(/\s+/g, '')));
        console.log(value);
    return (
        <>
            <Combobox value={value} onChange={onChange} as={Layout.Col} className="relative z-10 rounded-md border dark:border-white/10 shadow-sm bg-background-light dark:bg-background-dark text-sm w-full" multiple={props.multiple}>
                <Layout.Row className="rounded overflow-hidden justify-between">
                    <Combobox.Input name="combobox_name" placeholder={props.placeholder} className="border-none bg-transparent p-2 capitalize flex-grow" onChange={onInputChange} />
                    <Combobox.Button><ChevronUpDownIcon className='w-6 h-6 dark:text-white' /></Combobox.Button>
                </Layout.Row>
                <Combobox.Options onBlur={() => setQuery("")} className="absolute max-h-[200px] overflow-y-scroll top-10 border dark:border-white/5 shadow-md divide-y dark:divide-white/5 bg-background-light dark:bg-background-dark overflow-hidden inset-x-0 rounded-md">
                    {filteredList.length == 0 && query !== "" ? <Typography.Caption>Nothing found</Typography.Caption>
                        :
                        filteredList.map((item, index) => <Combobox.Option order={index} className="p-2 bg-background-light dark:bg-background-dark text-black dark:text-white hover:bg-secondary dark:hover:bg-white/5 cursor-pointer" value={item} key={item.value}>
                            {({ selected, active }) => <Layout.Row>
                                <Layout.Col className="flex-grow">
                                    <Typography.Caption className="capitalize font-semibold">{item?.displayValue || `disp_${index}`}</Typography.Caption>
                                    {props.showValue && <Typography.Caption className="text-xs">{item?.value || `val_${index}`}</Typography.Caption>}
                                </Layout.Col>
                                {selected && <CheckIcon className="w-4 h-4 text-primary" />}
                            </Layout.Row>
                            }
                        </Combobox.Option>)}

                </Combobox.Options>
            </Combobox>
            <Layout.Row className="gap-2 flex-wrap">
                {props.multiple && value.map((item, index) => <Typography.Caption key={index} className="capitalize text-xs bg-primary/10 px-2 py-1 font-medium rounded-full text-primary">{item.displayValue}</Typography.Caption>)}
                {!props.multiple && value.value !== "value" &&  <Typography.Caption className="capitalize text-xs bg-primary/10 px-2 py-1 font-medium rounded-full text-primary">{value.displayValue}</Typography.Caption>}
            </Layout.Row>
        </>
    )
}

export default memo(CustomComboBox);

CustomComboBox.defaultProps = {
    placeholder: "Combobox placeholder",
    list: [{ value: "item 1", displayValue: "item1" }],
    onChange: (currValue) => null,
    value: {value:"value",displayValue:"displayValue"},
    showValue: false,
    multiple: false
}