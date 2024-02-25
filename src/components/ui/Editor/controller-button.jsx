import React from 'react'
import Button from '../Button'

const ControllerButton = (props) => {
    const { active, ...restProps } = props
    return (
        <Button type="button" {...restProps} className={`remove-all font-extrabold btn-icon border ${active ? 'bg-primary hover:bg-primary text-white' : 'text-black'}`} />
    )
}

export default ControllerButton

ControllerButton.defaultProps = {
    active: false,
    activeTarget: '',
    editor: null
}