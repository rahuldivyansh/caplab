import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
//import the component
const RichTextEditor = dynamic(() => import("react-rte"), { ssr: false });

const MyStatefulEditor = ({ onChange, initialValue,disabled }) => {
    const [value, setValue] = useState();
    const router = useRouter();
    useEffect(() => {
        const importModule = async () => {
            const module = await import("react-rte");
            setValue(module.createValueFromString(initialValue, "html"));
        };
        importModule();
    }, [router.pathname]);

    const handleOnChange = (value) => {
        setValue(value);
        if (onChange) {
            onChange(value.toString("html"));
        }
    };

    if (!value) {
        return null;
    }

    return <RichTextEditor value={value} onChange={handleOnChange} className="w-full" disabled={disabled}/>;
};

MyStatefulEditor.defaultProps = {
    initialValue: "",
    onChange: () => { },
    disabled: false,
}

MyStatefulEditor.propTypes = {
    onChange: PropTypes.func,
    initialValue: PropTypes.string,
    disabled: PropTypes.bool,
};

export default MyStatefulEditor;