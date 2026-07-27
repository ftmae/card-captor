import pdfToText from 'react-pdftotext';
import * as pdfjsLib from 'pdfjs-dist';


pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default async function extractText(file, start, end){
    if(!file) return
    let finalText = '';
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask  = await pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;

    for(let i = start; i<=end; i++){
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        finalText += textContent.items.map(item=>item.str).join();
    }
    return finalText;
}