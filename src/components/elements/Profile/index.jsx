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
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/router';
import { Settings } from 'lucide-react';


const ThemeSwitcher = () => {
    const { switchTheme, theme } = useTheme();
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
                    <Switch enabled={enabled} setEnabled={switchTheme} key={theme} />
                </>
            )}
        </Menu.Item>
    )
}

const AccountAvatar = () => {
    const auth = useAuth();
    const { theme } = useTheme();
    if (!auth.data) return null;
    const router = useRouter();
    const handleOnClick = () => {
        router.push('/settings');
    }
    return (
        <>
            <Menu className={styles.main} as="div" key={theme}>
                <Menu.Button>
                    <Avatar seed={auth.data?.app_meta?.name} />
                </Menu.Button>
                <Menu.Items className={twMerge(styles.main_menu_items, "bg-background-light dark:bg-background-dark dark:border-white/10 divide-secondary/50 dark:divide-secondary/10")}>
                    <AccountAvatarWithName />
                    {/* {links.map((item, index) => <AccountAvatarLink {...item} key={index} />)} */}
                    <ThemeSwitcher />
                    <Menu.Item onClick={handleOnClick} as="div" className="p-2 flex flex-wrap justify-between items-center cursor-pointer">
                        <Typography.Caption>
                            Settings
                        </Typography.Caption>
                        <Settings size={20} />
                    </Menu.Item>
                    <AccountAvatarSignoutHandler />
                </Menu.Items>
            </Menu>
        </>
    );
};


export default AccountAvatar