"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { BiSolidPlusSquare } from "react-icons/bi";
import { CldUploadWidget } from 'next-cloudinary';
import axios from 'axios';

interface CloudinaryUploadWidgetInfo {
    secure_url: string;
}

const AddButton = () => {
    const userId = "675598555d7a00d7fdf154ee"; // hard coded id for now

    return (
        <CldUploadWidget
            uploadPreset={`${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`}
            onSuccess={(results) => {
                const uploadedResult = results.info as CloudinaryUploadWidgetInfo;
                if (uploadedResult && uploadedResult.secure_url) {
                    const FeedImageUrl = {
                        image: uploadedResult.secure_url,
                    };
                    async function handleUploadSuccess() {
                        await axios.post(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/feed/createFeed`, {
                            image: FeedImageUrl.image,
                            userId: userId,
                        });
                    }
                    handleUploadSuccess();
                } else {
                    console.error("Upload result is undefined or missing secure_url");
                }
            }}
        >
            {({ open }) => (
                <Button onClick={() => open()}>
                    <BiSolidPlusSquare />
                </Button>
            )}
        </CldUploadWidget>
    );
};

export default AddButton;