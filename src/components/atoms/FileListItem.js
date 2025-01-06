// src/components/atoms/FileListItem.js
import React, {useEffect, useState} from 'react';
import Icon from './Icon';

function FileListItem({ file, onRemove, index }) {
     const [show, setShow] = useState(false)
    const [remove, setRemove] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, index * 150)
        return () => clearTimeout(timer);
    }, [index])

     const handleRemove = () => {
         setRemove(true)
          setTimeout(() => {
              onRemove();
          }, 300)
     }
    return (
            <li className={`${show ? 'show' : ''} ${remove ? 'remove' : ''}`}>
                <span>{file.name}</span>
              <button type="button" onClick={handleRemove}><Icon name={'trash'}/> </button>
            </li>
     );
}
export default FileListItem;