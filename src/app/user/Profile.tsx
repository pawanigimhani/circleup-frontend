"use client";

import React, { useEffect, useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { User } from "@/lib/types";
import axios from 'axios';
import { useParams } from "next/navigation";

interface CloudinaryUploadWidgetInfo {
    secure_url: string;
}

const Profile = () => {
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const userId = "6753cc74434b01335f093c19"; // hard coded id for now
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/userDetails`);
                setUser(response.data);
            } catch (error: any) {
                console.error('Error fetching details:', error);
            }
        };

        fetchUser();
    }, [userId]);

    return (
        <div>
            <CldUploadWidget
                uploadPreset={`${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`}
                onSuccess={(results) => {
                    const uploadedResult = results.info as CloudinaryUploadWidgetInfo;
                    if (uploadedResult && uploadedResult.secure_url) {
                        setProfileImage(uploadedResult.secure_url);
                    } else {
                        console.error("Upload result is undefined or missing secure_url");
                    }
                    async function Update() {
                        try {
                          await axios.patch(
                            `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/profile/image`,
                            {
                              image: uploadedResult.secure_url,
                              userId: userId,
                            }
                          );
                        } catch (error: any) {
                            console.error("Error updating profile image:", error);
                        }
                      }
                      Update();
                }}
            >
                {({ open }) => (
                    <Button
                    variant="default"
                    className="mt-5 ml-3 lg:ml-5 lg:mt-8 rounded-full"
                    onClick={() => {
                      open();
                    }}
                  >
                    <Camera />
                  </Button>
                )}
            </CldUploadWidget>
            {user && (
                <div>
                    <Avatar>
                        <AvatarImage src={profileImage || user.image || ""} alt={user.name || "User"} />
                    </Avatar>
                    <h1>{user.name || "User"}</h1>
                </div>
            )}
        </div>
    );
};

export default Profile;