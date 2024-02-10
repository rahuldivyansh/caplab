import Logo from "../../../elements/Logo";
import styles from "./Navbar.module.css";
import Layout from "../../../ui/Layout";
import AccountAvatar from "../../../elements/Profile";

const Navbar = (props) => {
    return (
        <>
            {props.withLogo && <Logo />}
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