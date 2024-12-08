"use client";

import React, { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
  likedUserIds: string[];
  comments: Comment[];
  createdAt: string;
}

const formatCount = (count: number) => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    if (count % 1000 === 0) {
      return (count / 1000) + 'K';
    } else {
      return (count / 1000).toFixed(1) + 'K';
    }
  } else {
    if (count % 1000000 === 0) {
      return (count / 1000000) + 'M';
    } else {
      return (count / 1000000).toFixed(1) + 'M';
    }
  }
};

const formSchema = z.object({
  text: z.string().min(2, {
    message: "Comment must be at least 2 characters.",
  }),
})

export default function HomePage() {

  const [feedData, setFeedData] = React.useState<FeedImage[]>([]);
  const sessionUserId = "675598555d7a00d7fdf154ee"; // hard coded id for now
  const [isLikingMap, setIsLikingMap] = React.useState<Record<string, boolean>>({});
  const [selectedComments, setSelectedComments] = React.useState<Comment[]>([]);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = React.useState(false);
  const [selectedFeedId, setSelectedFeedId] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchFeedImages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/home/posts`);
        setFeedData(response.data);
      } catch (error: any) {
        console.error("Error fetching feed images:", error);
      }
    };
    fetchFeedImages();
  }, []);

  const handleLike = async (imageId: string, isLiked: boolean, userId: string) => {
    if (sessionUserId === null) {
      console.error("Session is null");
      return;
    }
    setIsLikingMap(prevMap => ({
      ...prevMap,
      [imageId]: true,
    }));
    try {
      const updatedFeedImages = [...feedData];
      const index = updatedFeedImages.findIndex(image => image.id === imageId);
      if (index !== -1) {
        updatedFeedImages[index] = {
          ...updatedFeedImages[index],
          likeCount: isLiked ? updatedFeedImages[index].likeCount - 1 : updatedFeedImages[index].likeCount + 1,
          likedUserIds: isLiked
            ? updatedFeedImages[index].likedUserIds.filter(id => id !== sessionUserId)
            : [...updatedFeedImages[index].likedUserIds, sessionUserId],
        };
        setFeedData(updatedFeedImages);
      }
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/feed/like`, {
        feedId: imageId,
        userId: sessionUserId,
        like: !isLiked
      });
      setIsLikingMap(prevMap => ({
        ...prevMap,
        [imageId]: false,
      }));
    } catch (error: any) {
      console.error("Error updating like:", error);
    }
  }

  const openCommentsModal = (comments: Comment[], id: string) => {
    setSelectedComments(comments);
    setIsCommentsModalOpen(true);
    setSelectedFeedId(id);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comment/create`, {
        feedId: selectedFeedId,
        userId: sessionUserId,
        text: data.text,
      });
      setSelectedComments((prevComments) => [
        ...prevComments,
        {
          id: response.data.id,
          text: data.text,
          user: {
            name: "You",
          },
        },
      ]);
      form.reset();
    } catch (error: any) {
      console.error("Error adding comment:", error);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 p-4 space-y-6 overflow-y-auto h-screen mt-1">
        {feedData.map((post) => (
          <Card key={post.id} className="border border-gray-200 shadow-sm bg-slate-100">
            <CardHeader className="flex items-center space-x-4 p-4">
              <div className="flex flex-row items-center justify-center gap-x-2">
                <Avatar className="h-10 w-10">
                  <img src={post.user.image || ''} alt={`${post.user.name}'s profile`} />
                </Avatar>
                <div>
                  <p className="font-bold">{post.user.name}</p>
                </div>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </div>
            </CardHeader>
            <CardContent>
              <img
                src={post.imageUrl}
                alt={`Post by ${post.user.name}`}
                className="w-full h-auto rounded-lg"
              />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div>
                  {post.caption && (
                    <p className="mt-4 text-base text-gray-700">{post.caption}</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex flex-row items-center justify-center">
                    <div className="pl-0">
                      <Button
                        variant={null}
                        role="heart"
                        size="sm"
                        className="flex items-center justify-center gap-2 hover:scale-110 transform transition duration-500"
                        onClick={() => handleLike(post.id, post.likedUserIds != null && post.likedUserIds.includes(sessionUserId), sessionUserId)}
                        disabled={isLikingMap[post.id]}
                      >
                        {post.likedUserIds != null && post.likedUserIds.includes(sessionUserId) ? (
                          <Heart fill="#cb1a1a" strokeWidth={0} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 " />
                        ) : (
                          <Heart color="#cb1a1a" strokeWidth={2} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 " />
                        )}
                      </Button>
                    </div>
                    <span className="text-slate-600 text-sm sm:text-xs lg:text-sm">{formatCount(post.likeCount)}</span>
                  </div>
                  <div className="flex flex-row items-center justify-center">
                    <Button
                      variant={null}
                      size="sm"
                      className="flex items-center justify-center gap-2 hover:scale-110 transform transition duration-500"
                      onClick={() => openCommentsModal(post.comments, post.id)}
                    >
                      <MessageCircle
                        color="#cb1a1a"
                        strokeWidth={2}
                        className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                      />
                    </Button>
                    <span className="text-slate-600 text-sm sm:text-xs lg:text-sm">
                      {post.comments.length}
                    </span>
                  </div>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={isCommentsModalOpen} onOpenChange={setIsCommentsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your Comment Here." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit"> Add Comment
              </Button>
            </form>
          </Form>
          <Separator />
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
}
