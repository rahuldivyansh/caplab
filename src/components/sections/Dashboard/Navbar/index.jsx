import Logo from "../../../elements/Logo";
import styles from "./Navbar.module.css";
import Layout from "../../../ui/Layout";
import AccountAvatar from "../../../elements/Profile";
import Button from "@/src/components/ui/Button";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import { MenuIcon } from "lucide-react";
import { useDashboardLayout } from "@/src/providers/Dashboard";

const Navbar = (props) => {
    const dashboard = useDashboardLayout();
    const toggleDashboardSidebar = () => {
        dashboard.setSidebarCollapsed(prev => !prev);
    }
    return (
        <>
            <Layout.Row className="items-center">
                <Button className="btn-icon sm:hidden" onClick={toggleDashboardSidebar}><MenuIcon width={24} height={24} /></Button>
                {props.withLogo && <Logo />}
            </Layout.Row>
            <Layout.Row className={styles.navbar_row}>
                <AccountAvatar />
            </Layout.Row>
        </>
    )
}

export default Navbar;


Navbar.defaultProps = {
    withLogo: false
}