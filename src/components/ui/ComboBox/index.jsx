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

    return (
        <Combobox value={value} onChange={onChange} as={Layout.Col} className="relative z-10 rounded-md border shadow-sm bg-white text-sm" multiple={props.multiple}>
            <Layout.Row className="rounded overflow-hidden justify-between">
                <Combobox.Input name="combobox_name" placeholder={props.placeholder} className="border-none bg-transparent p-2 capitalize flex-grow" onChange={onInputChange} />
                <Combobox.Button><ChevronUpDownIcon className='w-6 h-6' /></Combobox.Button>
            </Layout.Row>
            <Combobox.Options onBlur={() => setQuery("")} className="absolute max-h-[200px] overflow-y-scroll top-10 border shadow-md divide-y  bg-black overflow-hidden inset-x-0 rounded-md">
                {filteredList.length == 0 && query !== "" ? <Typography.Body>Nothing found</Typography.Body>
                    :
                    filteredList.map((item, index) => <Combobox.Option order={index} className="p-2 bg-white hover:bg-secondary cursor-pointer" value={item} key={item.value}>
                        {({ selected, active }) => <Layout.Row>
                            <Layout.Col className="flex-grow">
                                <Typography.Caption className="capitalize">{item?.displayValue || `disp_${index}`}</Typography.Caption>
                                <Typography.Caption className="text-xs">{item?.value || `val_${index}`}</Typography.Caption>
                            </Layout.Col>
                            {selected && <CheckIcon className="w-4 h-4 text-primary" />}
                        </Layout.Row>
                        }
                    </Combobox.Option>)}

            </Combobox.Options>
        </Combobox>
    )
}

export default memo(CustomComboBox);

CustomComboBox.defaultProps = {
    placeholder: "Combobox placeholder",
    list: [{ value: "item 1", displayValue: "item1" }],
    onChange: (currValue) => null,
    value: "query",
    multiple: false
}