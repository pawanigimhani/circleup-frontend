"use client";

import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
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
    const [isOpen, setIsOpen] = React.useState(false);
    const [caption, setCaption] = React.useState<string>("");
    const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);

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

    const openCaptionModal = (id: string) => {
        setSelectedFeedId(id);
        setIsOpen(true);
    }

    const addCaption = async () => {
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/feed/caption`, {
                feedId: selectedFeedId,
                caption: caption,
            });
            setFeedImages((prevFeedImage) => {
                return prevFeedImage.map((image) => {
                    if (image.id === selectedFeedId) {
                        return {
                            ...image,
                            caption: caption,
                        };
                    }
                    return image;
                });
            });
            setIsOpen(false);
            setCaption("");
        } catch (error: any) {
            console.log('Error adding caption:', error);
        }
    }

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
                                <Button
                                    variant={null}
                                    role="save"
                                    size="sm"
                                    className="flex items-center justify-center gap-2"
                                    onClick={() => openCaptionModal(feedImage.id)}
                                >
                                    <MoreVertical size={32} color="#ffffff" className="sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
                                </Button>
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
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="mb-2">Add a Caption</DialogTitle>
                        <DialogDescription>
                            Add a caption to your image to give it more context.<br />
                            (Maximum 15 characters.)
                        </DialogDescription>
                        <div className="flex flex-wrap">
                            <Input
                                type="text"
                                placeholder="Add a caption"
                                className="w-full mb-4"
                                value={caption}
                                onChange={(e) => {
                                    const maxLength = 15;
                                    let newCaption = e.target.value.slice(0, maxLength);
                                    setCaption(newCaption);
                                }
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace') {
                                        setCaption((prevCaption) => prevCaption.slice(0, -1));
                                    }
                                }
                                }
                            />
                            <Button
                                className="w-auto bg-black text-gray-200" onClick={() => addCaption()}>
                                Add Caption
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FeedComponent;
