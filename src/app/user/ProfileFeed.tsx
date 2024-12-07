"use client";

import React, { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import axios from "axios";

interface Comment {
    id: string;
    text: string;
    user: {
        name: string;
    };
}

interface FeedImage {
    id: string;
    imageUrl: string;
    likeCount: number;
    caption: string | null;
    userId: string;
    user: {
        name: string;
        image: string | null;
    };
    comments: Comment[];
}

const FeedComponent = () => {
    const [feedImages, setFeedImages] = useState<FeedImage[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const userId = "6753cc74434b01335f093c19"; // hard coded id for now
    const [selectedComments, setSelectedComments] = useState<Comment[]>([]);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

    useEffect(() => {
        const fetchFeedImages = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/feed`
                );
                setFeedImages(response.data);
            } catch (error: any) {
                console.error("Error fetching feed images:", error);
            }
            setIsLoading(false);
        };
        fetchFeedImages();
    }, [userId]);

    const openCommentsModal = (comments: Comment[]) => {
        setSelectedComments(comments);
        setIsCommentsModalOpen(true);
    };

    return (
        <div>
            {feedImages.map((feedImage) => (
                <div key={feedImage.id}>
                    <div className="relative flex flex-col justify-end items-center overflow-hidden w-[345px] h-auto lg:h-auto lg:w-[345px] rounded-[40px] mx-auto  my-4">
                        <Image
                            src={feedImage.imageUrl}
                            alt="Background Image"
                            width={345}
                            height={0}
                            style={{ height: "auto", width: "345px" }}
                            quality={100}
                            className="rounded-[35px] h-auto w-[400px] hover:scale-110 transform transition duration-500"
                        />
                        <div className="absolute z-10 grid grid-cols-6 items-center justify-center w-full bg-gradient-to-t from-black to-transparent rounded-b-[40px]">
                            <div className="col-span-4 flex flex-start items-center justify-start pl-4">
                                <Avatar className="w-14 h-14 sm:w-10 sm:h-10 lg:w-14 lg:h-14 border-2 border-white mr-3">
                                    <AvatarImage
                                        src={feedImage.user.image ?? ""}
                                        alt={feedImage.user.name ?? "User"}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start justify-center">
                                    <span className="text-white text-xs lg:text-base font-normal">
                                        {feedImage.user.name}
                                    </span>
                                    <p className="text-xs italic font-medium text-slate-200">
                                        {feedImage.caption ?? "No caption"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 col-span-2 pr-4">
                                <Button
                                    variant={null}
                                    size="sm"
                                    className="flex items-center justify-center gap-2 hover:scale-110 transform transition duration-500"
                                >
                                    <Heart
                                        color="#ffffff"
                                        strokeWidth={2}
                                        className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                                    />
                                </Button>
                                <span className="text-white text-sm sm:text-xs lg:text-sm">
                                    {feedImage.likeCount}
                                </span>
                                <Button
                                    variant={null}
                                    size="sm"
                                    className="flex items-center justify-center gap-2 hover:scale-110 transform transition duration-500"
                                    onClick={() => openCommentsModal(feedImage.comments)}
                                >
                                    <MessageCircle
                                        color="#ffffff"
                                        strokeWidth={2}
                                        className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                                    />
                                </Button>
                                <span className="text-white text-sm sm:text-xs lg:text-sm">
                                    {feedImage.comments.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Dialog open={isCommentsModalOpen} onOpenChange={setIsCommentsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Comments</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                        {selectedComments.length > 0 ? (
                            selectedComments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex items-center justify-start gap-4"
                                >
                                    <Avatar className="w-10 h-10">
                                        <AvatarFallback>
                                            {comment.user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <span className="font-medium">{comment.user.name}</span>
                                        <p className="text-sm">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No comments yet.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FeedComponent;
