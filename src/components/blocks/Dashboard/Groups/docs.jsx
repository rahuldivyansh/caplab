import Button from '@/src/components/ui/Button'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import useFetch from '@/src/hooks/general/useFetch'
import React from 'react'

const Wrapper = ({ children }) => {
    return (
        <Layout.Col className="p-4 gap-2">
            {children}
        </Layout.Col>
    )
}

const FileUploader = ({ groupId }) => {
    const uploadFile = useFetch({ method: "POST", url: `/api/docs/${groupId}/upload` })
    const handleChange = async (e) => {
        const [file] = e.target.files;
        const formData = new FormData();
        formData.append("file", file);
        if (file) {
            console.log(file);
        }
        await uploadFile.dispatch(formData);
    }
    return (
        <Layout.Col className="gap-2">
            <Button className="btn-primary">Upload</Button>
            <input type="file" onChange={handleChange} />
        </Layout.Col>
    )
}

const GroupDocsBlock = ({ groupId }) => {
    const docs = useFetch({ method: "GET", url: `/api/docs/${groupId}`, get_autoFetch: false })
    if (docs.loading) return <Wrapper>Loading...</Wrapper>
    if (docs.error) return <Wrapper>Error fetching docs</Wrapper>
    if (!docs.loading && docs.data !== null && Array.from(docs.data).length === 0) return <Wrapper>No docs found</Wrapper>
    if (!docs.data) return null;
    return (
        <Wrapper>
            <Layout.Col><FileUploader groupId={groupId} /></Layout.Col>
            <Layout.Col className="border divide-y rounded">
                {
                    docs.data.map((doc, index) => {
                        return (
                            <Layout.Row key={`group-doc-${doc.id}`} className="p-2">
                                <Typography.Caption>{doc.name}</Typography.Caption>
                            </Layout.Row>
                        )
                    })
                }
            </Layout.Col>
        </Wrapper>
    )
}

export default GroupDocsBlock