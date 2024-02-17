import React from 'react'
import Layout from '../../ui/Layout'
import Typography from '../../ui/Typography'
import Information from "@heroicons/react/24/outline/InformationCircleIcon";
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';

const EmptyElement = () => {
    return (
        <Layout.Col className="h-full w-full items-center justify-center py-16">
            <InformationCircleIcon className="h-16 w-16 text-gray-400" />
            <Typography.Body className="font-semibold">It's empty in here.</Typography.Body>
        </Layout.Col>
    )
}

export default EmptyElement