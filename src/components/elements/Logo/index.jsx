import React from 'react'
import Link from 'next/link';
import styles from "./Logo.module.css";
import { LOGOTEXT } from '@/src/constants';
import { twMerge } from 'tailwind-merge';

const Logo = () => {
  return (
    <Link href="/" className={twMerge(styles.logo,"dark:text-white")}>{LOGOTEXT}</Link>
  )
}

export default Logo;