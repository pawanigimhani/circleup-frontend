"use client";

import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { User } from "@/lib/types";


const Navbar = () => {

    const userId = "675598555d7a00d7fdf154ee"; // hard coded id for now
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
        <nav className="w-full bg-slate-900 shadow-md p-1">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="h-18 w-20"
                    />
                </Link>
                {user ? (
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex flex-col text-right">
                        <span className="font-medium text-white">{user.name}</span>
                        <span className="text-sm text-slate-400">@{user.username}</span>
                    </div>
                    <Link href="/user">
                        <Avatar className="h-10 w-10">
                            <Image
                                src={user.image || "https://res.cloudinary.com/dcyqrcuf3/image/upload/v1711878461/defaultImages/default-profile-image_grcgcd.png"}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
                ) : (
                <Link href="/login" className="text-gray-900">
                    Login
                </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
