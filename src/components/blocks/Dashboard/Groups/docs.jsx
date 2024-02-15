import React, { useRef } from 'react'
import FileIcon from "@heroicons/react/24/outline/DocumentIcon";
import Button from '@/src/components/ui/Button'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import useFetch from '@/src/hooks/general/useFetch'
import Link from 'next/link';
import { toast } from 'react-toastify';
import { LoaderElement } from '@/src/components/elements/Loaders';
import moment from 'moment';

const FileUploader = ({ groupId, getDocs }) => {
    const uploaderRef = useRef(null);
    const uploadFile = useFetch({ method: "POST", url: `/api/docs/${groupId}/upload` })
    const handleChange = async (e) => {
        const [file] = e.target.files;
        const formData = new FormData();
        formData.append("file", file);
        const { data, error } = await uploadFile.dispatch(formData);
        if (error) {
            toast.error("Error uploading file");
        }
        if (data) {
            getDocs();
            toast.success("File uploaded successfully");
        }
    }
    const toggleUpload = async () => {
        if (uploaderRef.current) uploaderRef.current.click();
    }
    return (
        <Layout.Col className="gap-2 md:flex-row md:justify-end">
            <Button className="btn-primary" onClick={toggleUpload} loading={uploadFile.loading}>Upload</Button>
            {!uploadFile.loading && <input type="file" onChange={handleChange} ref={uploaderRef} className="hidden" />}
        </Layout.Col>
    )
}
const Wrapper = ({ children, groupId, getDocs }) => {
    return (
        <Layout.Col className="p-4 gap-2 min-h-screen">
            <Layout.Col><FileUploader groupId={groupId} getDocs={getDocs} /></Layout.Col>
            {children}
        </Layout.Col>
    )
}

const DocsList = ({ docs }) => {
    const docsList = Array.from(docs).sort((doc1, doc2) => moment(doc2.created_at).diff(moment(doc1.created_at)));
    return <Layout.Col className="border divide-y rounded">
        {
            docsList.map((doc, _) => {
                return (
                    <Layout.Row key={`group-doc-${doc.id}`} className="p-2 justify-between items-center gap-2 hover:bg-gray-200 active:bg-gray-300 transition-all cursor-pointer select-none">
                        <Layout.Row className="gap-2 items-center">
                            <FileIcon width={18} className="text-gray-800" />
                            <Typography.Caption>{doc.name}</Typography.Caption>
                        </Layout.Row>
                        <Typography.Caption>Uploaded {moment(doc.created_at).fromNow()}</Typography.Caption>
                    </Layout.Row>
                )
            })
        }
    </Layout.Col>
}


const GroupDocsBlock = ({ groupId }) => {
    const docs = useFetch({ method: "GET", url: `/api/docs/${groupId}`, get_autoFetch: true })
    if (docs.loading) return <Wrapper groupId={groupId}><LoaderElement /></Wrapper>
    if (docs.error) return <Wrapper groupId={groupId}>Error fetching docs</Wrapper>
    if (!docs.loading && docs.data !== null && Array.from(docs.data).length === 0) return <Wrapper groupId={groupId}>No docs found</Wrapper>
    if (!docs.data) return null;
    return (
        <Wrapper groupId={groupId} getDocs={docs.dispatch}>
            <DocsList docs={docs.data} />
        </Wrapper>
    )
}

export default GroupDocsBlock