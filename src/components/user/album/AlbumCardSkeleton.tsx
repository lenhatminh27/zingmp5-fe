import React from 'react';

const AlbumCardSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            <div className="aspect-square w-full bg-neutral-800 rounded-lg"/>
            <div className="mt-2 space-y-2">
                <div className="h-4 bg-neutral-800 rounded w-3/4"/>
                {/* <div className="h-3 bg-neutral-800 rounded w-1/2"/> */}
                <div className="h-3 bg-neutral-800 rounded w-1/2"/>
            </div>
        </div>
    );
};

export default AlbumCardSkeleton;