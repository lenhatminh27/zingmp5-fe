import React from "react";

const TrackCardSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            <div className="aspect-square w-full bg-[#1f1f1f] rounded-2xl"/>
            <div className="mt-2 space-y-2">
                <div className="h-3 w-3/4 bg-[#1f1f1f] rounded"/>
                <div className="h-4 w-1/2 bg-[#1f1f1f] rounded"/>
            </div>
        </div>
    );
};

export default TrackCardSkeleton;