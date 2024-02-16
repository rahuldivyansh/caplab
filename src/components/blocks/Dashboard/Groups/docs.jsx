import React, { useRef, useState } from 'react'
import FileIconH from "@heroicons/react/24/outline/DocumentIcon";
import Button from '@/src/components/ui/Button'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import useFetch from '@/src/hooks/general/useFetch'
import Link from 'next/link';
import { toast } from 'react-toastify';
import { LoaderElement } from '@/src/components/elements/Loaders';
import moment from 'moment';
import Modal from '@/src/components/ui/Modal';
import { byteToMb } from '@/src/utils/converters';
import EmptyElement from '@/src/components/elements/Empty';
import { FileIcon, defaultStyles } from 'react-file-icon';

const FileUploader = ({ groupId, getDocs }) => {
    const uploaderRef = useRef(null);
    const uploadFile = useFetch({ method: "POST", url: `/api/docs/${groupId}/upload` })
    const handleChange = async (e) => {
        const [file] = e.target.files;
        const formData = new FormData();
        const size = byteToMb(file.size);
        if (size > 50) {
            toast.error("File size should be less than 50MB");
            return;
        }
        formData.append("file", file);
        const { data, error } = await uploadFile.dispatch(formData);
        if (error) {
            toast.error("Error uploading file");
        }
        if (data) {
            getDocs && getDocs();
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
const DownloadButton = ({ doc, groupId }) => {
    const getDocUrl = useFetch({ method: "GET", url: `/api/docs/${groupId}/${doc.name}/url`, get_autoFetch: false })
    const handleDownload = async () => {
        const { data, error } = await getDocUrl.dispatch();
        if (error) {
            toast.error("Error fetching doc url");
        }
        if (data && window !== undefined) {
            window.open(data.publicUrl, "_blank");
        }
    }
    return <Button className="btn-primary" onClick={handleDownload}>Download</Button>
}
const RemoveButton = ({ doc, groupId, closeModal, getDocs }) => {
    const removeDoc = useFetch({ method: "DELETE", url: `/api/docs/${groupId}/${doc.name}` })
    const handleRemove = async () => {
        const { data, error } = await removeDoc.dispatch();
        if (error) {
            toast.error("Error removing document");
        }
        if (data) {
            toast.success("Document removed successfully");
            closeModal();
            getDocs()
        }

    }
    return <Button className="btn-secondary" onClick={handleRemove} loading={removeDoc.loading}>Remove</Button>
}

const DocsList = ({ docs, groupId, getDocs }) => {
    const [currentDoc, setCurrentDoc] = useState(null)

    const docsList = Array.from(docs).sort((doc1, doc2) => moment(doc2.created_at).diff(moment(doc1.created_at)));

    return <Layout.Col className="border divide-y rounded">
        <Modal open={currentDoc !== null} onClose={() => setCurrentDoc(null)} title={currentDoc?.name}>
            <Layout.Col className="p-4 gap-2">
                <Layout.Col className="gap-2 bg-gray-50 border justify-center items-center p-4">
                    <Layout.Row className="gap-2 items-center justify-center w-16 h-24 overflow-hidden"  >
                        <FileIcon extension={currentDoc?.name.split(".")[1]} {...defaultStyles[currentDoc?.name.split(".")[1] || "txt"]} />
                    </Layout.Row>
                </Layout.Col>
                <Typography>Size - {byteToMb(currentDoc?.metadata.size).toFixed(2)}MB</Typography>
                <Typography>Uploaded at - {moment(currentDoc?.created_at).format("MMMM Do YYYY, h:mm a")}</Typography>
                <DownloadButton doc={currentDoc} groupId={groupId} />
                <RemoveButton doc={currentDoc} groupId={groupId} closeModal={() => setCurrentDoc(null)} getDocs={getDocs} />
            </Layout.Col>
        </Modal>
        {
            docsList.map((doc, _) => {
                return (
                    <Layout.Row onClick={() => { setCurrentDoc(doc) }} key={`group-doc-${doc.id}`} className="px-2 justify-between items-center gap-2 hover:bg-gray-200 active:bg-gray-300 transition-all cursor-pointer select-none">
                        <Layout.Row className="gap-2 items-center text-wrap overflow-hidden">
                            <Layout.Row className="gap-2 items-center justify-center w-8 h-12 scale-90 overflow-hidden"  >
                                <FileIcon extension={doc.name.split(".")[1]} {...defaultStyles[doc.name.split(".")[1] || "txt"]} />
                            </Layout.Row>
                            <Typography.Caption className="font-semibold text-gray-600">{doc.name}</Typography.Caption>
                        </Layout.Row>
                        <Typography.Caption className="hidden md:flex">Uploaded {moment(doc.created_at).fromNow()}</Typography.Caption>
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
    if (!docs.loading && docs.data !== null && Array.from(docs.data).length === 0) return <Wrapper groupId={groupId}><EmptyElement /></Wrapper>
    if (!docs.data) return null;
    return (
        <Wrapper groupId={groupId} getDocs={docs.dispatch}>
            <DocsList docs={docs.data} groupId={groupId} getDocs={docs.dispatch} />
        </Wrapper>
    )
}

export default GroupDocsBlock