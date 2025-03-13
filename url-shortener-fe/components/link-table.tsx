"use client"

import { useState, useEffect } from "react"
import { Copy, MoreHorizontal, ExternalLink, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface LinkTableProps {
  links: Array<{
    id: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: string;
  }>;
  onTotalClicksChange?: (totalClicks: number) => void;
}

export default function LinkTable({ links, onTotalClicksChange }: LinkTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Calculate total clicks and send to parent component when links change
  useEffect(() => {
    if (onTotalClicksChange) {
      const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
      onTotalClicksChange(totalClicks)
    }
  }, [links, onTotalClicksChange])

  const filteredLinks = links.filter(
    (link) =>
      link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const copyToClipboard = (text:string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handleLinkClick = (shortUrl:string) => {
    const fullUrl = `http://${shortUrl}`;
    window.open(fullUrl, "_blank"); 
};


  const formatDate = (dateString:string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-500">Original URL</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Short URL</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Clicks</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Created</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  {searchTerm ? "No links found matching your search." : "Loading links..."}
                </td>
              </tr>
            ) : (
              filteredLinks.map((link) => (
                <tr key={link.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="max-w-xs truncate" title={link.originalUrl}>
                        {link.originalUrl}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span 
                        className="text-blue-600 font-medium cursor-pointer"
                        onClick={() => handleLinkClick(link.shortUrl)}
                      >
                        {link.shortUrl}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-8 w-8 p-0"
                        onClick={() => copyToClipboard(link.shortUrl)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  </td>
                  <td className="py-3 px-4">{link.clicks.toLocaleString()}</td>
                  <td className="py-3 px-4">{formatDate(link.createdAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <BarChart className="h-4 w-4" />
                        <span className="sr-only">Analytics</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Open</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>QR Code</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

