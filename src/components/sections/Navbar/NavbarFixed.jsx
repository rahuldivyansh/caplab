import React from 'react';
import styles from "./NavbarFixed.module.css";
import Navbar from '.';
import Layout from '../../ui/Layout';

const NavbarFixed = () => {
    return (
        <Layout.Row className={styles.main}>
            <Layout.Container className={styles.main_container}>
                <Layout.Row className={styles.navbar_row}>
                    <Navbar withLogo/>
                </Layout.Row>
            </Layout.Container>
        </Layout.Row>
    )
}

export default NavbarFixed;