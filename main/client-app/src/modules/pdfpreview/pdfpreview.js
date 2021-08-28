
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

export function PdfPreview(props) { 

	pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
	
	const [numPages, setNumPages] = useState(null); 
	const [pageNumber, setPageNumber] = useState(1); 

	function onDocumentLoadSuccess({ numPages }) { 
		setNumPages(numPages); 
		setPageNumber(1); 
	} 
	return ( 
		<> 
			<div className="main"> 
				<Document file={props.url} onLoadSuccess={onDocumentLoadSuccess}> 
					<Page pageNumber={pageNumber} width={150}/> 
				</Document> 
			</div> 
		</>); 
}
