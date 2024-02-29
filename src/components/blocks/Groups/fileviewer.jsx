import Image from "next/image";
import { Document, Page } from "react-pdf";
import { useState, useEffect } from "react";
import supabaseClient from "@/src/services/supabase";
import { BUCKET_NAME } from "@/src/constants/storage";
import Editor, { useMonaco } from "@monaco-editor/react";
import {
  IMAGE_EXTENSIONS,
  PROGRAMMING_EXTENSIONS,
} from "@/src/constants/extensions";

const FileViewerBlock = ({ url, fileType, doc, groupId: group_id }) => {
  console.log(url, fileType, doc, group_id, "in file viewer");

  const [fileContent, setFileContent] = useState("");
  const [error, setError] = useState(null);

  const monaco = useMonaco();

  // Fetch file content
  useEffect(() => {
    const fetchFile = async () => {
      try {
        const PATH = `group_${group_id}/${doc.name}`;
        const { data: docData, error: docError } = await supabaseClient.storage
          .from(BUCKET_NAME)
          .getPublicUrl(PATH, {
            download: true,
          });

        if (error) {
          setError(error);
          console.log(error, 'error in file viewer');
          return;
        }
        console.log(fileContent, docData, "data and docData in file viewer");
        setFileContent(docData);
      } catch (error) {
        setError(error);
      }
    };

    fetchFile();
  }, []);

  const handleEditorChange = (value, event) => {
    setFileContent(value);
  };

  // Render file based on type
  const renderFile = () => {
    console.log(fileContent, "file content in file viewer" );
    if (PROGRAMMING_EXTENSIONS.includes(fileType)) {
      fileType = "code";
    }

    if (IMAGE_EXTENSIONS.includes(fileType)) {
      fileType = "img";
    }
    const fileExtensions = {
      img: <img src={url} alt="File" width={200} height={200} />,
      pdf: (
        <Document file={url}>
          <Page pageNumber={1} />
        </Document>
      ),
      docx: <p>Some docx file</p>,
      txt: <p>Some text file</p>,
      code: (
        // <Editor
        //   height="500px"
        //   defaultLanguage="plaintext"
        //   value={fileContent}
        //   onChange={handleEditorChange}
        //   theme="vs-dark"
        //   language={fileType}
        //   options={{
        //     wordWrap: "on",
        //     minimap: { enabled: false },
        //     readOnly: true,
        //   }}
        //   />
        <p>{`${fileContent.publicUrl}`}</p>
      ),
    };

    return fileExtensions[fileType] || <p>File type not supported</p>;
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {renderFile()}
    </div>
  );
};
export default FileViewerBlock;