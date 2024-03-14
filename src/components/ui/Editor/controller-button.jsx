import React from 'react'
import Button from '../Button'
import { twMerge } from 'tailwind-merge'

const ControllerButton = (props) => {
    const { active, ...restProps } = props
    return (
        <Button type="button" {...restProps} className={twMerge("remove-all text-xs font-extrabold btn-icon border dark:border-white/10", active ? 'bg-primary hover:bg-primary text-white' : "text-black dark:text-white")} />
    )
}

export default ControllerButton

ControllerButton.defaultProps = {
    active: false,
    activeTarget: '',
    editor: null
}