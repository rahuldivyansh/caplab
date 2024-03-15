import React from 'react';
import styles from "./NavbarFixed.module.css";
import Navbar from '.';
import Layout from '../../ui/Layout';
import { twMerge } from 'tailwind-merge';

const NavbarFixed = () => {
    return (
        <Layout.Row className={twMerge(styles.main,"dark:border-white/10")}>
            <Layout.Container className={twMerge(styles.main_container,"dark:border-x dark:border-white/10")}>
                <Layout.Row className={styles.navbar_row}>
                    <Navbar withLogo/>
                </Layout.Row>
            </Layout.Container>
        </Layout.Row>
    )
}

export default NavbarFixed;