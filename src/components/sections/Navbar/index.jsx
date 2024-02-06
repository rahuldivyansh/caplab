import { useAuth } from "@/src/providers/Auth"; 
import Logo from "../../elements/Logo";
import styles from "./Navbar.module.css";
import Layout from "../../ui/Layout";
import Link from "next/link";
import Button from "../../ui/Button";

const Navbar = () => {
    const auth = useAuth();
    return (
        <>
            <Logo />
            <Layout.Row className={styles.navbar_row}>
                {!auth.data && <>
                    <Link href="/register"><Button className="btn-icon">Register</Button></Link>
                    <Link href="/login"><Button className="btn-primary">Login</Button></Link>
                </>}
            </Layout.Row>
        </>
    )
}

export default Navbar;