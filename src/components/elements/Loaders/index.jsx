import React from 'react';
import Layout from '@/src/components/ui/Layout';
import { ScaleLoader } from 'react-spinners';

const LoadingWrapper = ({ children }) => {
    return <Layout.Col className="items-center justify-center h-full w-full">
        {children}
    </Layout.Col>
}

export const LoaderElement = () => {
    return <LoadingWrapper>
        <ScaleLoader width={4} />
    </LoadingWrapper>
}