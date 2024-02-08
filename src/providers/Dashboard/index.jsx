import React, { useContext } from 'react'

export const DashboardLayoutContext = React.createContext(null)

export const useDashboardLayout = () => useContext(DashboardLayoutContext)

const DashboardLayoutProvider = (props) => {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
    return (
        <DashboardLayoutContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed }}>
            {props.children}
        </DashboardLayoutContext.Provider>
    )
}

export default DashboardLayoutProvider