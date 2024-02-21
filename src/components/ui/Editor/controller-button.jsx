import React from 'react'
import Button from '../Button'

const ControllerButton = (props) => {
    const { active, ...restProps } = props
    return (
        <Button {...restProps} className={`font-extrabold btn-icon border ${active ? 'is-active' : ''}`} />
    )
}

export default ControllerButton

ControllerButton.defaultProps = {
    active: false,
    activeTarget: '',
    editor: null
}