import React, { useRef, useState } from "react";
import FileIconH from "@heroicons/react/24/outline/DocumentIcon";
import Button from "@/src/components/ui/Button";
import Layout from "@/src/components/ui/Layout";
import Typography from "@/src/components/ui/Typography";
import useFetch from "@/src/hooks/general/useFetch";
import Link from "next/link";
import { toast } from "react-toastify";
import { LoaderElement } from "@/src/components/elements/Loaders";
import moment from "moment";
import Modal from "@/src/components/ui/Modal";
import { byteToMb } from "@/src/utils/converters";
import EmptyElement from "@/src/components/elements/Empty";
import { FileIcon, defaultStyles } from "react-file-icon";
import FileViewerBlock from "@/src/components/blocks/Groups/fileviewer";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";

const getExtension = (filename) => {
  if (!filename || !filename.includes(".")) return "txt";
  return filename.split(".").pop();
};

const FileUploader = ({ groupId, getDocs }) => {
  const uploaderRef = useRef(null);
  const uploadFile = useFetch({
    method: "POST",
    url: `/api/docs/${groupId}/upload`,
  });
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
  };
  const toggleUpload = async () => {
    if (uploaderRef.current) uploaderRef.current.click();
  };
  return (
    <Layout.Col className="gap-2 md:flex-row md:justify-end">
      <Button
        className="btn-primary"
        onClick={toggleUpload}
        loading={uploadFile.loading}
      >
        Upload
      </Button>
      {!uploadFile.loading && (
        <input
          type="file"
          onChange={handleChange}
          ref={uploaderRef}
          className="hidden"
        />
      )}
    </Layout.Col>
  );
};
const Wrapper = ({ children, groupId, getDocs }) => {
  return (
    <Layout.Col className="p-4 gap-2 min-h-screen">
      <Layout.Col>
        <FileUploader groupId={groupId} getDocs={getDocs} />
      </Layout.Col>
      {children}
    </Layout.Col>
  );
};
const DownloadButton = ({ doc, groupId }) => {
  const getDocUrl = useFetch({
    method: "GET",
    url: `/api/docs/${groupId}/${doc.name}/url`,
    get_autoFetch: false,
  });
  const handleDownload = async () => {
    const { data, error } = await getDocUrl.dispatch();
    if (error) {
      toast.error("Error fetching doc url");
    }
    if (data && window !== undefined) {
      window.open(data.publicUrl, "_blank");
    }
  };
  return (
    <Button className="btn-primary" onClick={handleDownload}>
      Download
    </Button>
  );
};
const RemoveButton = ({ doc, groupId, closeModal, getDocs }) => {
  const removeDoc = useFetch({
    method: "DELETE",
    url: `/api/docs/${groupId}/${doc.name}`,
  });
  const handleRemove = async () => {
    const { data, error } = await removeDoc.dispatch();
    if (error) {
      toast.error("Error removing document");
    }
    if (data) {
      toast.success("Document removed successfully");
      closeModal();
      getDocs();
    }
  };
  return (
    <Button
      className="btn-secondary"
      onClick={handleRemove}
      loading={removeDoc.loading}
    >
      Remove
    </Button>
  );
};

const ViewButton = ({ doc, groupId, changeViewButton }) => {
  const viewDoc = useFetch({
    method: "GET",
    url: `/api/docs/${groupId}/${doc.name}/url`,
    get_autoFetch: true,
  });
  const handleView = async () => {
    const { data, error } = await viewDoc.dispatch();
    if (error) {
      toast.error("Error fetching doc url");
    }
    if (data && window !== undefined) {
      // window.open(data.publicUrl, "_blank");
      changeViewButton(data.publicUrl);
    }
  };
  return (
    <Button className="btn-secondary" onClick={handleView}>
      View
    </Button>
  );
};

const DocsList = ({ docs, groupId, getDocs }) => {
  const [currentDoc, setCurrentDoc] = useState(null);
  const [viewButtonClicked, setViewButtonClicked] = useState(null);

  const changeViewButton = (publicUrl) => {
    setViewButtonClicked(publicUrl);
  };

  const docsList = Array.from(docs).sort((doc1, doc2) =>
    moment(doc2.created_at).diff(moment(doc1.created_at))
  );

  return (
    <Layout.Grid className="grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-0 sm:divide-y">
      <Modal
        open={currentDoc !== null}
        onClose={() => {
          setCurrentDoc(null);
          setViewButtonClicked(null);
        }}
        title={currentDoc?.name}
      >
        <Layout.Grid
          // className={`grid-cols-1 lg:w-screen ${
          //   viewButtonClicked ? "sm:grid-cols-4" : "sm:grid-cols-1"
          // } gap-2`}
          className={twMerge(`grid-cols-1 gap-2`, viewButtonClicked ? "sm:grid-cols-4 lg:w-screen h-screen" : "sm:grid-cols-1")  }
        >
          {viewButtonClicked && (
            <Layout.Col className="p-4 gap-2 items-center col-span-3">
              <FileViewerBlock
                url={viewButtonClicked}
                fileType={getExtension(currentDoc?.name)}
                doc = {currentDoc}
                groupId = {groupId}
              />
            </Layout.Col>
          )}
          <Layout.Col className="p-4 gap-2">
            <Layout.Col className="gap-2 bg-gray-50 border justify-center items-center p-4">
              <Layout.Row className="gap-2 items-center justify-center w-16 h-24 overflow-hidden">
                <FileIcon
                  extension={getExtension(currentDoc?.name)}
                  {...defaultStyles[getExtension(currentDoc?.name)]}
                />
              </Layout.Row>
            </Layout.Col>
            <Typography>
              Size - {byteToMb(currentDoc?.metadata.size).toFixed(2)}MB
            </Typography>
            <Typography>
              Uploaded at -{" "}
              {moment(currentDoc?.created_at).format("MMMM Do YYYY, h:mm a")}
            </Typography>
            <Typography.Title className="mb-2">Actions</Typography.Title>
            <Layout.Col className="gap-2">
              <DownloadButton doc={currentDoc} groupId={groupId} />
              <RemoveButton
                doc={currentDoc}
                groupId={groupId}
                closeModal={() => setCurrentDoc(null)}
                getDocs={getDocs}
              />
              {!viewButtonClicked && (
                <ViewButton
                  doc={currentDoc}
                  groupId={groupId}
                  changeViewButton={changeViewButton}
                />
              )}
            </Layout.Col>
          </Layout.Col>
        </Layout.Grid>
      </Modal>
      {docsList.map((doc, _) => {
        return (
          <Layout.Col
            onClick={() => {
              setCurrentDoc(doc);
            }}
            key={`group-doc-${doc.id}`}
            className="px-2 py-2 sm:py-0 border sm:border-x-0 rounded sm:rounded-none overflow-hidden aspect-square sm:aspect-auto sm:flex-row justify-between items-center gap-2 hover:bg-gray-200 active:bg-gray-300 transition-all cursor-pointer select-none"
          >
            <Layout.Col className="sm:flex-row gap-2  w-full sm:w-auto h-full justify-center items-center overflow-hidden">
              <Layout.Row className="gap-2 items-center justify-center w-16 h-24 sm:w-8 sm:h-12 scale-90 overflow-hidden">
                <FileIcon
                  extension={getExtension(doc.name)}
                  {...defaultStyles[getExtension(doc.name)]}
                />
              </Layout.Row>
              <Typography.Caption className="font-semibold w-full text-gray-600 line-clamp-1">
                {doc.name}
              </Typography.Caption>
            </Layout.Col>
            <Typography.Caption className="hidden md:flex text-center">
              Uploaded {moment(doc.created_at).fromNow()}
            </Typography.Caption>
          </Layout.Col>
        );
      })}
    </Layout.Grid>
  );
};

const GroupDocsBlock = ({ groupId }) => {
  const docs = useFetch({
    method: "GET",
    url: `/api/docs/${groupId}`,
    get_autoFetch: true,
  });
  if (docs.loading)
    return (
      <Wrapper groupId={groupId}>
        <LoaderElement />
      </Wrapper>
    );
  if (docs.error)
    return <Wrapper groupId={groupId}>Error fetching docs</Wrapper>;
  if (!docs.loading && docs.data !== null && Array.from(docs.data).length === 0)
    return (
      <Wrapper groupId={groupId}>
        <EmptyElement />
      </Wrapper>
    );
  if (!docs.data) return null;
  return (
    <Wrapper groupId={groupId} getDocs={docs.dispatch}>
      <DocsList docs={docs.data} groupId={groupId} getDocs={docs.dispatch} />
    </Wrapper>
  );
};

export default GroupDocsBlock;
