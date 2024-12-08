"use client";

import React, { useEffect, useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Camera, PenSquare } from "lucide-react";
import { User } from "@/lib/types";
import axios from 'axios';

interface CloudinaryUploadWidgetInfo {
    secure_url: string;
}

const formSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name is must_be_a_string",
        }
        )
        .min(2, {
            message: "Username must be at least 2 characters long",
        })
        .max(50),
})

const Profile = () => {
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const userId = "675598555d7a00d7fdf154ee"; // hard coded id for now
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>, e: any) => {
        try {
            if (values) {
                const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/name`, {
                    name: values.name,
                    userId: userId,
                });
                if (response.status === 201) {
                    console.log(response.status);
                }
            }
        } catch (error: any) {
            console.error("Error updating profile:", error);
        }
        setIsOpen(false);
    };

    return (
        <div className='flex justify-between rounded-lg border border-slate-100 shadow-inner drop-shadow-md w-full h-full p-3 lg:mt-20'>
             {user && (
                    <div className='flex flex-row items-center justify-left ml-7 space-x-5'>
                        <Avatar className='w-16 h-16'>
                            <AvatarImage src={profileImage || user.image || "https://res.cloudinary.com/dcyqrcuf3/image/upload/v1711878461/defaultImages/default-profile-image_grcgcd.png"} alt={user.name || "User"} />
                        </Avatar>
                        <div className='flex flex-col'>
                            <h1>{user.name || "User"}</h1>
                            <p className='text-xs font-light text-gray-700'>@{user.username}</p>
                        </div>
                    </div>
                )}
            <div className='flex flex-col items-center'>
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
                        variant="ghost"
                            onClick={() => {
                                open();
                            }}
                        >
                            <Camera />
                        </Button>
                    )}
                </CldUploadWidget>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <PenSquare className="w-4 h-4" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Profile Name</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">
                                    Save
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
                </div>
        </div>
    );
};

export default Profile;