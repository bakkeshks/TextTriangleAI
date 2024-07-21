import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import instance from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AddYoutube() {
  const [userData, setUserData] = useState({
    userName: "",
    secondsRemaining: 0,
  });
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await instance.get("/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData({
          userName: response.data.userName,
          secondsRemaining: response.data.secondsRemaining,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        router.push("/login");
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const response = await instance.post(
        "/upload/addyoutube",
        { youtubeUrl },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage({ type: "success", content: response.data.message });
    } catch (error) {
      setMessage({
        type: "error",
        content: error.response?.data?.error || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold">TextTriangleAI</h1>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
          <span>
            <b>
              Credits Remaining: {userData.secondsRemaining.toFixed(2)} seconds
            </b>
          </span>
          <span>Welcome! {userData.userName}</span>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="container mx-auto mt-8 p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">
              Enter YouTube Video or Shorts URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Enter YouTube URL"
                required
              />
              <div className="flex justify-center">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Blog Post...
                    </>
                  ) : (
                    "Generate Blog Post"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500 ">
            <b>Maximum video length is 10 minutes</b>
          </CardFooter>
        </Card>

        {message.content && (
          <Alert
            className={`mt-4 max-w-md mx-auto ${
              message.type === "error" ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <AlertTitle>
              {message.type === "error" ? "Error" : "Success"}
            </AlertTitle>
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}
