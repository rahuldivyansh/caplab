import React from 'react'
import styles from "./AccountAvatar.module.css";
import Layout from '@/src/components/ui/Layout'
import { Menu } from '@headlessui/react'
import Avatar from '../Avatar'
import { useAuth } from '@/src/providers/Auth'
import Typography from '@/src/components/ui/Typography'
import Link from 'next/link';
import { REV_ROLES } from '@/src/constants/roles';
import { twMerge } from 'tailwind-merge';

const AccountAvatarWithName = () => {
    const auth = useAuth();
    const name = auth.data?.app_meta?.name;
    return (
        <Menu.Item>
            <Link href={`/${auth.data?.username}`}>
                <Layout.Row className={twMerge(styles.with_name_row,"dark:bg-background-dark dark:border-white/10")}>
                    <Avatar seed={name} />
                    <Layout.Col className="justify-start">
                        <Typography className={styles.with_name_name}>
                            {name}
                        </Typography>
                        <Typography.Caption className={styles.with_name_email}>
                            {auth?.data?.email}
                        </Typography.Caption>
                        <Typography.Caption className={styles.with_name_role}>
                            {REV_ROLES[auth.data?.app_meta?.role]}
                        </Typography.Caption>
                    </Layout.Col>
                </Layout.Row>
            </Link>
        </Menu.Item>
    )
}

export default AccountAvatarWithName