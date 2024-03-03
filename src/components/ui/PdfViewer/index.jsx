import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useWindowSize } from "react-use";
import Layout from "../Layout";
import Button from "../Button";
import { ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Typography from "../Typography";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfControls = ({ numPages, pageNumber, setPageNumber, setZoom }) => {
    const handlePrev = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    }
    const handleNext = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    }
    const handleZoomIn = () => {
        setZoom((prev) => prev + 0.5);
    }
    const handleZoomOut = () => {
        setZoom((prev) => {
            if (prev <= 1) return prev;
            return prev - 0.5
        });
    }
    return (
        <Layout.Row className="justify-center border max-w-[18rem] bg-black items-center rounded-full shadow-md sticky z-10 bottom-20 left-[50%] -translate-x-[50%] bg-opacity-50 backdrop-blur-sm text-white">
            <Layout.Row className="gap-2 items-center">
                <Button onClick={handlePrev} disabled={pageNumber === 1}><ArrowLeft /></Button>
                <Typography.Caption>Page {pageNumber} of {numPages}</Typography.Caption>
                <Button onClick={handleNext} disabled={pageNumber === numPages}><ArrowRight /></Button>
            </Layout.Row>
            <Button onClick={handleZoomIn}><ZoomIn /></Button>
            <Button onClick={handleZoomOut}><ZoomOut /></Button>
        </Layout.Row>
    );
}

const PdfViewer = ({ file }) => {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [zoom, setZoom] = useState(1);
    const deviceSize = useWindowSize();
    const onLoadSuccess = (payload) => {
        setNumPages(payload.numPages);
    }
    return (
        <div className="relative  items-center justify-center h-screen w-full overflow-scroll bg-secondary p-8">
            <Document file={file} onLoadSuccess={onLoadSuccess}>
                <Page pageNumber={pageNumber} scale={zoom} height={deviceSize.height} key={deviceSize.height} pageIndex={pageNumber} />
            </Document>
            <PdfControls numPages={numPages} pageNumber={pageNumber} setPageNumber={setPageNumber} setZoom={setZoom} />
        </div>
    );
}

export default PdfViewer;