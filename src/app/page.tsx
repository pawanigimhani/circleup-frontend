"use client";

import { Avatar } from "@/components/ui/avatar"; 
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"; 
import { Heart } from "lucide-react"; 
import { formatDistanceToNow } from "date-fns"; 

export default function HomePage() {
  const feedData = [
    {
      id: 1,
      username: "healthy_unicorn23",
      fullName: "John Doe",
      profileImage: "/profile1.jpg",
      postImage: "/post1.jpg",
      likes: 23,
      createdAt: new Date("2024-12-05T12:00:00Z"),
    },
    {
      id: 2,
      username: "nature_lover42",
      fullName: "Jane Smith",
      profileImage: "/profile2.jpg",
      postImage: "/post2.jpg",
      likes: 45,
      createdAt: new Date("2024-12-06T14:00:00Z"),
    },
  ];

  return (
    <div className="flex">

      <div className="w-1/4 p-4">
        <h1 className="text-2xl font-bold">Logo</h1>
      </div>

      <div className="w-1/2 p-4 space-y-6 overflow-y-auto h-screen">
        {feedData.map((post) => (
          <Card key={post.id} className="border border-gray-200 shadow-sm">
            <CardHeader className="flex items-center space-x-4 p-4">
              <Avatar className="h-10 w-10">
                <img src={post.profileImage} alt={`${post.username}'s profile`} />
              </Avatar>
              <div>
                <p className="font-bold">{post.fullName}</p>
                <p className="text-sm text-gray-500">@{post.username}</p>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </div>
            </CardHeader>
            <CardContent>
              <img
                src={post.postImage}
                alt={`Post by ${post.username}`}
                className="w-full h-auto rounded-lg"
              />
            </CardContent>
            <CardFooter className="flex items-center space-x-4 p-4">
              <Heart className="h-5 w-5 text-red-500" />
              <span>{post.likes}</span>
              <span className="text-sm text-gray-500">likes</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="w-1/4 p-4">
        <Avatar className="h-16 w-16 mb-4">
          <img src="/profile1.jpg" alt="Profile Avatar" />
        </Avatar>
        <p className="text-lg font-bold">Profile full name</p>
        <p className="text-sm text-gray-500">@profile_username</p>
      </div>
    </div>
  );
}
