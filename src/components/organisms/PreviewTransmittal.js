// src/components/organisms/PreviewTransmittal.js
import React, {useState, useEffect} from 'react';
import InputWithLabel from '../molecules/InputWithLabel';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import { useUpload } from '@/models/upload';


function PreviewTransmittal({ currentPage, totalPages, onPrev, onNext, onExport, onSaveLibrary, projectName}) {

    const {previewData, setPreviewData} = useUpload();
    const [project, setProject] = useState("");
    const [drawing, setDrawing] = useState("");
    const [revision, setRevision] = useState("");
    const [drawingCode, setDrawingCode] = useState("");


    useEffect(() => {
        setProject(projectName)
        setDrawing("")
        setRevision("")
        setDrawingCode("")
    }, [currentPage, projectName])

    const handlePreviewData = (e) => {
      const {id, value} = e.target
        switch (id) {
            case 'previewProjectName':
                setProject(value)
                break;
            case 'previewDrawingName':
                setDrawing(value)
                break;
            case 'previewRevision':
                setRevision(value)
                break;
            case 'previewDrawingCode':
                setDrawingCode(value)
                break;
            default:
                 break;
        }
        setPreviewData({
            project,
            drawing,
            revision,
            drawingCode
        })

    }


    return (
        <div className="preview-transmittal" id="previewTransmittal">
            <h3>Preview Transmittal</h3>
            <div className="field">
                <InputWithLabel
                    label="Project Name"
                    type="text"
                    placeholder="Project Name"
                    id="previewProjectName"
                    value={project}
                   onChange={handlePreviewData}
                />
            </div>
            <div className="field">
                <InputWithLabel
                    label="Judul Gambar"
                    type="text"
                    placeholder="Judul Gambar"
                    id="previewDrawingName"
                     value={drawing}
                   onChange={handlePreviewData}
                    />
            </div>
            <div className="field">
                <InputWithLabel
                    label="Revision"
                    type="text"
                    placeholder="Revision"
                     id="previewRevision"
                      value={revision}
                   onChange={handlePreviewData}
                />
            </div>
            <div className="field">
                <InputWithLabel
                    label="Drawing Code"
                    type="text"
                    placeholder="Drawing Code"
                    id="previewDrawingCode"
                     value={drawingCode}
                   onChange={handlePreviewData}
                />
            </div>

            <div className="pagination">
                <Button className="first">
                    <Icon name='angle-double-left'/>
                </Button>
                <Button id="prevBtn" onClick={onPrev} disabled={currentPage === 1}>
                    <Icon name="angle-left"/>
                </Button>
                <span id="pageInfo">{`${currentPage} / ${totalPages}`}</span>
                <Button id="nextBtn" onClick={onNext} disabled={totalPages === 0}>
                   <Icon name="angle-right"/>
                </Button>
                <Button className="last">
                  <Icon name="angle-double-right"/>
                </Button>
            </div>
            <div className="button-container">
                <Button id="exportButton" onClick={onExport}>Save & Export to CSV</Button>
               <Button id="saveLibraryButton" onClick={onSaveLibrary}>Save to Library</Button>
            </div>
        </div>
    );
}

export default PreviewTransmittal;