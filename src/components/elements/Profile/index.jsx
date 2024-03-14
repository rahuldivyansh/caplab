import React, { useEffect, useState } from 'react'
import styles from "./AccountAvatar.module.css";
import { Menu } from '@headlessui/react';
import { useAuth } from '@/src/providers/Auth'
import Avatar from '../Avatar';
import AccountAvatarWithName from './AccountAvatarWithName';
import AccountAvatarSignoutHandler from './AccountAvatarSignoutHandler';
import AccountAvatarLink from './AccountAvatarLink';
import { links } from './constants';
import Button from '../../ui/Button';
import { useTheme } from '@/src/providers/Theme';
import Typography from '../../ui/Typography';
import Switch from '../../ui/General/Switch';


const ThemeSwitcher = () => {
    const { switchTheme,theme } = useTheme();
    const [enabled, setEnabled] = useState(theme === "dark");
    useEffect(() => {
        setEnabled(theme === "dark");
    }, [theme]);
    return (
        <Menu.Item onClick={switchTheme} as="div" className="flex flew-wrap p-2 justify-between">
            {({ active }) => (
                <>
                    <Typography.Caption>
                        Toggle theme
                    </Typography.Caption>
                    <Switch enabled={enabled} setEnabled={switchTheme} key={theme}/>
                </>
            )}
        </Menu.Item>
    )
}

const AccountAvatar = () => {
    const auth = useAuth();
    const {theme} = useTheme();
    if (!auth.data) return null;
    return (
        <>
            <Menu className={styles.main} as="div" key={theme}>
                <Menu.Button>
                    <Avatar seed={auth.data?.app_meta?.name} />
                </Menu.Button>
                <Menu.Items className="absolute w-72 right-0 bg-background-light dark:bg-background-dark backdrop-blur-sm border-secondary border rounded-xl shadow-md flex-col overflow-hidden divide-y divide-secondary/50">
                    <AccountAvatarWithName />
                    {links.map((item, index) => <AccountAvatarLink {...item} key={index} />)}
                    <ThemeSwitcher />
                    <AccountAvatarSignoutHandler />
                </Menu.Items>
            </Menu>
        </>
    );
};


export default AccountAvatar