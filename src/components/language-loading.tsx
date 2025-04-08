import { Suspense, lazy } from 'react';

const VideoPlayer: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <video
                src={videoUrl}
                onLoadStart={() => setIsLoading(true)}
                onLoadedData={() => setIsLoading(false)}
                preload="metadata"
                playsInline
                controls
            >
                <track kind="captions" src={`${videoUrl}/captions.vtt`} />
            </video>
            {isLoading && <LoadingSpinner />}
        </Suspense>
    );
};

export default VideoPlayer;