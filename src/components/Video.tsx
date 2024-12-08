import React, { useMemo } from 'react';
import { makeStyles } from '@mui/styles';

type VideoProps = {
    url: string;
    aspectRatio?: number;
    maxWidth?: number;
}

const Video = ({ 
    url, 
    aspectRatio = 16/9, 
    maxWidth = 600 
}: VideoProps) => {
    const useStyles = makeStyles((theme) => ({
        maxWidth: {
            maxWidth: maxWidth,
            margin: '20px auto'
        },
        container: {
            position: 'relative',
            paddingBottom: `${(1/aspectRatio) * 100}%`,
            height: 0,
            overflow: 'hidden',

            '& iframe': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            }
        },
    }));

    const classes = useStyles();

    // Memoize YouTube ID extraction
    const videoId = useMemo(() => {
        if (!url) return null;
        
        const regExps = [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&]+)/,
            /(?:https?:\/\/)?(?:youtu\.be\/)?([^&]+)/
        ];

        for (const regex of regExps) {
            const match = url.match(regex);
            if (match) return match[1];
        }

        return null;
    }, [url]);

    if (!videoId) return null;

    return (
        <div className={classes.maxWidth}>
            <div className={classes.container}>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
};

export default Video;