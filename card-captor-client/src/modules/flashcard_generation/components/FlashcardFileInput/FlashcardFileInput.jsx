import './flashcardfileinput.css';
import { useState } from 'react'
import { pdfjs, Document } from 'react-pdf';
import PageNumberInput from '../PageNumberInput/PageNumberInput.jsx';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function FlashcardFileInput({inputFile, setInputFile}){
    const [totalPages, setTotalPages] = useState(1);

    function handleChange(event){
        if(event.target.files[0]){
            setInputFile(event.target.files[0]);   
        }     
    }

    function onDocumentLoadSuccess({numPages}){
        setTotalPages(numPages);
    }
    return(
        <>
            <label className='custom-file-input'>
                <input className="d-none" type="file" name="upload" accept="application/pdf" onChange={handleChange} /> 
                <span className="material-symbols-outlined">
                    upload_file
                </span>
                <p>{inputFile ? inputFile.name : 'Click to Upload (PDF Files Only)'}</p>                
            </label>
            {inputFile && 
                <Document file = {inputFile} onLoadSuccess={onDocumentLoadSuccess}>
                    <PageNumberInput totalPages = {totalPages} />
                </Document>
            }
        </>
    )
}