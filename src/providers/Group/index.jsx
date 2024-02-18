import React, { useContext } from 'react'

export const GroupContext = React.createContext(null)

export const useGroup = () => useContext(GroupContext)

const GroupProvider = (props) => {
    return (
        <GroupContext.Provider value={props.group}>
            {props.children}
        </GroupContext.Provider>
    )
}

export default GroupProvider