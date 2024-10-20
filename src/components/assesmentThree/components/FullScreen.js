import { Tooltip } from '@mui/material';
import React from 'react';
import { RiFullscreenFill } from "react-icons/ri";

function FullScreen() {
    const [fullScreen, setFullScreen] = React.useState(true);

    const Fullscreen = () => {
        setFullScreen(!fullScreen);
        if (fullScreen) {
            document.body.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <Tooltip title="Full Screen" arrow>
            <div className='mt-1.5 mr-5'>
                <RiFullscreenFill size={32} className='cursor-pointer' onClick={Fullscreen} />
            </div>
        </Tooltip>
    )
}

export default FullScreen