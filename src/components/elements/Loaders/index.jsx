import React from 'react';
import Layout from '@/src/components/ui/Layout';
import { PuffLoader } from 'react-spinners';
import Typography from '../../ui/Typography';

const LoadingWrapper = ({ children }) => {
    return <Layout.Col className="items-center justify-center h-full w-full py-16">
        {children}
    </Layout.Col>
}

export const LoaderElement = () => {
    return <LoadingWrapper>
        <PuffLoader width={4} color='#1170f8' />
        <Typography.Body className="text-gray-500 font-medium">wait a second...</Typography.Body>
    </LoadingWrapper>
}