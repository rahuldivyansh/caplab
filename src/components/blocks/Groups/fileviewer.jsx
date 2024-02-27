import Image from "next/image";
import { Document, Page } from "react-pdf";
import { useState, useEffect } from "react";
import supabaseClient from "@/src/services/supabase";
import { BUCKET_NAME } from "@/src/constants/storage";
import MonacoEditor from "@monaco-editor/react";

const FileViewerBlock = ({ url, fileType, doc, groupId: group_id }) => {
  console.log(url, fileType, doc, group_id, "in file viewer");

  const [fileContent, setFileContent] = useState("");
  const [error, setError] = useState(null);

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
          return;
        }
        setFileContent(docData);
        console.log(fileContent, "data in file viewer");
      } catch (error) {
        setError(error);
      }
    };

    fetchFile();
  }, [url]);

  const handleEditorChange = (value) => {};

  switch (fileType) {
    case "jpg":
      return <img src={url} alt="File" width="200" height="200" />;
    case "png":
      return <img src={url} alt="File" width="200" height="200" />;
    case "pdf":
      return (
        <Document file={url}>
          <Page pageNumber={1} />
        </Document>
      );
    case "docx":
      // Handle docx file
      break;
    case "txt":
      // Handle text file
      break;
    case "java":
      const language = getLanguage(fileType);
      const options = {
        value: fileContent,
        language: language,
        theme: "vs-dark",
        readOnly: true,
      };

      //   const handleEditorChange = async (value) => {
      //     setFileContent(value);

      //     // Implement logic to save changes to Supabase
      //     if (onEdit) {
      //       try {
      //         const { error } = await onEdit(value); // Call the provided onEdit function and handle errors
      //         if (error) {
      //           console.error('Error saving changes:', error);
      //           // Optionally display an error message to the user
      //         } else {
      //           // Optionally update UI to indicate successful save (optimistic update)
      //           // You can implement UI updates like displaying a success message or disabling the save button
      //         }
      //       } catch (error) {
      //         console.error('Unexpected error:', error);
      //         // Optionally handle unexpected errors and display appropriate messages to the user
      //       }
      //     }
      //   };

      //   const onEdit = async (updatedContent) => {
      //     const { data, error } = await supabaseClient.storage
      //       .from('caplab_bucket')
      //       .upload('your_file_name.txt', updatedContent, {
      //         contentType: 'text/plain', // Adjust content type as needed for your file type
      //       });

      //     if (error) {
      //       throw new Error('Error saving file:', error.message);
      //     }

      //     return { data, error };
      //   };

      return (
        <div>
          {/* <MonacoEditor {...options} onDidChange = {handleEditorChange}/> */}
          <MonacoEditor {...options} />
        </div>
      );
      break;
    default:
      return <p>Unsupported file type</p>;
  }
};

const getLanguage = (fileType) => {
  switch (fileType.toLowerCase()) {
    case "java":
      return "java";
    case "py":
      return "python";
    case "cpp":
      return "cpp";
    // Add more language mappings as needed
    default:
      return "plaintext"; // Fallback for unknown types
  }
};

export default FileViewerBlock;
