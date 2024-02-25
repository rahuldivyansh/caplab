import { avataaarsNeutral, funEmoji, initials } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
import Image from 'next/image'
import React from 'react'

const Avatar = (props) => {
    const avatar = createAvatar(initials, {
        backgroundType: ["solid"],
        seed: props.seed,
        size: 96,
    })
    const uri = avatar.toDataUriSync();
    return (
        <Image src={uri} width={props.dimensions[0]} title={props.seed} height={props.dimensions[1]} className='rounded-full' alt="ace-sql-user" />
    )
}

export default Avatar;

Avatar.defaultProps = {
    dimensions: [32, 32],
    seed: "avatar"
}