import { useAuth } from "@/src/providers/Auth";
import Logo from "../../elements/Logo";
import styles from "./Navbar.module.css";
import Layout from "../../ui/Layout";
import Link from "next/link";
import Button from "../../ui/Button";
import AccountAvatar from "../../elements/Profile";

const Navbar = (props) => {
    const auth = useAuth();
    return (
        <>
            {props.withLogo && <Logo />}
            <Layout.Row className={styles.navbar_row}>
                {!auth.data && <>
                    <Link href="/login"><Button className="btn-primary">Login</Button></Link>
                </>}
                {
                    auth.data && <Link href="/dashboard"><Button className="btn-primary">Dashboard</Button></Link>
                }
                <AccountAvatar />
            </Layout.Row>
        </>
    )
}

export default Navbar;


Navbar.defaultProps = {
    withLogo: false
}