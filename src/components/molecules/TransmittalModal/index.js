import React, { useState } from 'react';
import Button from '../../atoms/Button';
import IconWithText from '../IconWithText';

function TransmittalModal({ open, onClose, onSubmit, documentName, setDocumentName, transmittalNumber, setTransmittalNumber, csvName, setCsvName  }) {
    const [step, setStep] = useState(1);
   const handleSubmit = (e) => {
        e.preventDefault();
         onSubmit({
            documentName,
             transmittalNumber,
            csvName
        });
   };


  if(!open)
    return null;
    return (
    <div id="transmittalModal"  className="modal-container">
    <div className="modal-content">
      <button onClick={onClose} className="modal-close">
        <IconWithText icon="times" text="" />
      </button>

      <div className="modal-body">
          <ol className="flex items-center w-full mb-4 sm:mb-5">
              <li class={`flex w-full items-center  after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800 ${step >= 1 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  <div class={`flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0 ${step >= 1 ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      <i className="fa fa-file-text-o" />
                   </div>
              </li>
              <li class={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700 ${step >= 2 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  <div class={`flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0 ${step >= 2 ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      <i className="fa fa-list-ol" />
                  </div>
              </li>
              <li class={`flex items-center w-full ${step >= 3 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  <div class={`flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0 ${step >= 3 ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      <i className="fa fa-file-csv" />
                  </div>
              </li>
        </ol>
          <form onSubmit={handleSubmit} >
              {step === 1 && (
                  <div>
                        <div className="field">
                              <label htmlFor="documentName">Document Name</label>
                                <input
                                    type="text"
                                    id="documentName"
                                    placeholder="Document Name"
                                    value={documentName}
                                    onChange={(e) => setDocumentName(e.target.value)}
                                    required
                                />
                         </div>
                           <Button onClick={()=>setStep(step+1)}>
                                Next
                           </Button>
                  </div>
              )}
                 {step === 2 && (
                  <div>
                        <div className="field">
                              <label htmlFor="transmittalNumber">Transmittal Number</label>
                                <input
                                    type="text"
                                    id="transmittalNumber"
                                     placeholder="Transmittal Number"
                                    value={transmittalNumber}
                                   onChange={(e) => setTransmittalNumber(e.target.value)}
                                    required
                                />
                            </div>
                             <Button onClick={()=>setStep(step+1)}>
                                Next
                           </Button>
                  </div>
              )}
               {step === 3 && (
                  <div>
                         <div className="field">
                              <label htmlFor="csvFileName">File CSV Name</label>
                            <input
                                type="text"
                                id="csvFileName"
                                placeholder="File CSV Name"
                                value={csvName}
                                onChange={(e) => setCsvName(e.target.value)}
                                required
                            />
                        </div>
                       <Button type="submit">
                               Generate
                            </Button>
                  </div>
              )}
         </form>
    </div>
        </div>
    </div>
  );
}

export default TransmittalModal;