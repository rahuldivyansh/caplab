import Logo from "../../../elements/Logo";
import styles from "./Navbar.module.css";
import Layout from "../../../ui/Layout";
import AccountAvatar from "../../../elements/Profile";
import Button from "@/src/components/ui/Button";
import BellIcon from "@heroicons/react/24/outline/BellIcon";

const Navbar = (props) => {
    return (
        <>
            {props.withLogo && <Logo />}
            <Layout.Row className={styles.navbar_row}>
                <Button className="btn-icon"><BellIcon width={24} height={24}/></Button>
                <AccountAvatar />
            </Layout.Row>
        </>
    )
}

export default Navbar;


Navbar.defaultProps = {
    withLogo: false
}