import Image from "next/image";
import { Document, Page } from "react-pdf";

const FileViewerBlock = ({ url, fileType }) => {
    console.log(url, fileType, "in file viewer");

    switch (fileType) {
        case "jpg":
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
        case "code":
            // Handle code file
            break;
        default:
            return <p>Unsupported file type</p>;
    }
};

export default FileViewerBlock;

// import Image from 'next/image';
// import { Document, Page } from 'react-pdf';

// const FileViewerBlock = ({ url, fileType }) => {
//   const [fileData, setFileData] = useState(null);

//   useEffect(() => {
//     const fetchFile = async () => {
//       const response = await fetch(url);
//       const data = await response.blob();
//       setFileData(data);
//     };

//     fetchFile();
//   }, []);

//   if (fileType === 'jpg' || fileType === 'png') {
//     return <Image src={URL.createObjectURL(fileData)} alt="File" />;
//   } else if (fileType === 'pdf') {
//     return (
//       <Document file={URL.createObjectURL(fileData)}>
//         <Page pageNumber={1} />
//       </Document>
//     );
//   } else {
//     return <p>Unsupported file type</p>;
//   }
// };

// export default FileViewerBlock;
