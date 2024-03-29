import React from 'react'
import Typography from '../Typography'
import Layout from '../Layout'


const KeyValueData = ({ keyData = "key", value = "value" }) => {
    return (
        <>
            <Typography.Caption className="uppercase font-bold">{keyData}</Typography.Caption>
            <Typography.Caption className="opacity-70">{value}</Typography.Caption>
        </>
    )
}

const KeyValue = ({ direction = "column", keyData = "key", value = "value" }) => {
    if (direction === "column") {
        return (
            <Layout.Col>
                <KeyValueData keyData={keyData} value={value} />
            </Layout.Col>
        )
    }
    return (
        <Layout.Row className="flex-wrap justify-between">
            <KeyValueData keyData={keyData} value={value} />
        </Layout.Row>
    )
}

export default KeyValue