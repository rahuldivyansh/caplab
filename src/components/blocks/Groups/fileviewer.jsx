import { useState, useEffect } from "react";
import supabaseClient from "@/src/services/supabase";
import { BUCKET_NAME } from "@/src/constants/storage";
import {
  IMAGE_EXTENSIONS,
  PROGRAMMING_EXTENSIONS,
  VIDEO_EXTENSIONS,
} from "@/src/constants/extensions";
import axios from "axios";
import Button from "../../ui/Button";
import { Save } from "lucide-react";
import Layout from "../../ui/Layout";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import PdfViewer from "../../ui/PdfViewer";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const fileParser = {
  json: (data) => JSON.stringify(data, null, 2),
};

const CustomEditor = ({ fileContent, fileType, path, fetchFile }) => {
  const [currentFileContent, setCurrentFileContent] = useState(fileContent);

  const handleEditorChange = (value, event) => {
    setCurrentFileContent(value);
  };
  const handleSave = async () => {
    if (currentFileContent === fileContent) {
      return;
    }
    try {
      const { data: uploadData, error: uploadError } =
        await supabaseClient.storage
          .from(BUCKET_NAME)
          .upload(path, currentFileContent, {
            upsert: true,
          });
      if (uploadError) {
        console.log(uploadError, "error in file viewer");
      }
      toast.success("File updated successfully");
      fetchFile();
      console.log(uploadData, "response in file viewer");
    } catch (error) {
      console.log(error, "error in file viewer");
    }
  };

  useEffect(() => {
    setCurrentFileContent(fileContent);
  }, [fileContent]);
  return (
    <Layout.Col className="relative w-full h-full">
      <Editor
        height="90%"
        defaultLanguage={fileType}
        value={currentFileContent}
        onChange={handleEditorChange}
        language={fileType}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          readOnly: false,
        }}
        style={{ width: "100%", height: "100%" }}
      />
      <Button onClick={handleSave} className="btn-primary absolute right-1 bottom-20">save<Save size={24} className="ml-2" /></Button>
    </Layout.Col >
  );
};

const FileViewerBlock = ({ url, fileType, doc, groupId: group_id }) => {
  const [fileContent, setFileContent] = useState("");
  const [error, setError] = useState(null);

  const fetchFile = async () => {
    try {
      const PATH = `group_${group_id}/${doc.name}`;
      const { data: docData, error: docError } = await supabaseClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(PATH, {
          download: false,
        });

      const response = await axios.get(`${docData.publicUrl}?t=${Date.now()}`);
      let data = await response.data;
      if (typeof data === "object") {
        data = JSON.stringify(data);
      }

      if (docError) {
        setError(error);
        console.log(error, "error in file viewer");
        return;
      }
      setFileContent(data);
    } catch (error) {
      setError(error);
      console.log(error, "error in file viewer");
    }
  };

  useEffect(() => {
    fetchFile();
  }, []);

  const renderFile = () => {
    let type = fileType;
    if (PROGRAMMING_EXTENSIONS.includes(fileType)) {
      type = "code";
    }
    if (VIDEO_EXTENSIONS.includes(fileType)) {
      type = "video"
    }
    if (IMAGE_EXTENSIONS.includes(fileType)) {
      type = "img";
    }
    const fileExtensions = {
      img: <img src={url} alt="File" />,
      pdf: (
        <PdfViewer file={url} />
      ),
      video: (
        <video controls>
          <source src={url} type={`video/${fileType}`} />
        </video>
      ),
      docx: <p>Some docx file</p>,
      txt: <p>{fileContent} </p>,
      code: (
        <CustomEditor
          fileContent={fileContent}
          fileType={fileType}
          path={`group_${group_id}/${doc.name}`}
          fetchFile={fetchFile}
        />
        // <p>{`${fileContent.publicUrl}`}</p>
      ),
    };

    return fileExtensions[type] || <p>File type not supported</p>;
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {renderFile()}
    </div>
  );
};
export default FileViewerBlock;
