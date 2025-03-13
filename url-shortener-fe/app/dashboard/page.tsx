"use client"
import { Suspense, useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LinkTable from "@/components/link-table"
import CreateLinkForm from "@/components/create-link-form"
import DashboardStats from "@/components/dashboard-stats"
import LoadingSpinner from "@/components/loading-spinner"
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); 
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
  const [links, setLinks] = useState([]);
  const [username, setUsername] = useState("John Smith");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      enqueueSnackbar("Please log in to access the dashboard.", { variant: "warning" });
      router.push("/");
    } else {
      const storedUsername = localStorage.getItem("user");
      if (storedUsername) {
        setUsername(JSON.parse(storedUsername));
      }
      fetchLinks(token);
    }
  }, [router, enqueueSnackbar]);

  const fetchLinks = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/api/urls", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      const formattedLinks = data.map(link => ({
        id: link.id,
        originalUrl: link.longUrl,
        shortUrl: `localhost:8080/api/${link.shortCode}`,
        clicks: link.clicks,
        createdAt: link.createdAt,
      }));
      setLinks(formattedLinks);

      // Calculate total clicks and total links
      const totalClicks = formattedLinks.reduce((sum, link) => sum + link.clicks, 0);
      const totalLinks = formattedLinks.length;

      setTotalClicks(totalClicks);
      setTotalLinks(totalLinks);
    } catch (error) {
      enqueueSnackbar("Error fetching links.", { variant: "error" });
    }
  };


  const handleProfileClick = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      enqueueSnackbar("No token found. Please log in again.", { variant: "error" });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setIsProfileModalOpen(false);
        enqueueSnackbar("Logged out successfully!", { variant: "success" });
        // Redirect to login or home page
        window.location.href = "/";
      } else {
        enqueueSnackbar("Logout failed. Please try again.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred during logout. Please try again later.", { variant: "error" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-white border-r border-gray-200 p-4 md:flex">
        <div className="flex items-center mb-8">
          <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center mr-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 8H13M13 8L8 3M13 8L8 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold">URL shortener</h1>
        </div>

        <nav className="space-y-1">
          {["Dashboard", "Links", "QR Codes", "Custom Domains", "Campaigns", "Groups"].map((item) => (
            <a
              key={item}
              href="#"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                item === "Dashboard" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="md:hidden flex items-center">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center mr-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 8H13M13 8L8 3M13 8L8 13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold">Shortify</h1>
            </div>

            <div className="relative w-full max-w-md mx-4 hidden md:block">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search links..." className="pl-8 bg-gray-50 border-gray-200" />
            </div>

            

            <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
                Upgrade
              </Button>
              <div className="flex items-center profile cursor-pointer" onClick={handleProfileClick}>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.21.722 5.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{username}</p>
                  <p className="text-xs text-gray-500">Free Plan</p>
                </div>
              </div>
              
            </div>
          </div>
        </header>

        {/* Profile Modal */}
        {isProfileModalOpen && (
          <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 z-10">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}

        {/* Dashboard content */}
        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-500">Monitor and manage your links</p>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <DashboardStats totalClicks={totalClicks} totalLinks={totalLinks} />
          </Suspense>

          <div className="mt-6">
            <Tabs defaultValue="links" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="links">My Links</TabsTrigger>
                <TabsTrigger value="create">Create New Link</TabsTrigger>
              </TabsList>

              <TabsContent value="links">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recent Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<LoadingSpinner />}>
                      <LinkTable links={links} />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="create">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Create New Link</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CreateLinkForm />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
