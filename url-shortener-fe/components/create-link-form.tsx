"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy } from "lucide-react"

export default function CreateLinkForm() {
  const [longUrl, setLongUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [domain, setDomain] = useState("short.ly")
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [shortUrl, setShortUrl] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("authToken")
    console.log(token)
    
    try {
      const response = await fetch("http://localhost:8080/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          longURL : longUrl,
          customAlias: customAlias || null
        })
      })

      if (!response.ok) {
        throw new Error("Failed to shorten URL")
      }

      const data = await response.json()
      setShortUrl(data.shortURL)
      setIsCreated(true)
    } catch (error) {
      console.error("Error:", error)
      // Handle error (e.g., show a notification)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    // You could add a toast notification here
  }

  const resetForm = () => {
    setLongUrl("")
    setCustomAlias("")
    setDomain("short.ly")
    setIsAdvancedOpen(false)
    setIsCreated(false)
    setShortUrl("")
  }

  return (
    <div>
      {!isCreated ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="longUrl">Destination URL</Label>
              <Input
                id="longUrl"
                placeholder="https://example.com/your-long-url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="customAlias">Custom back-half (optional)</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Show advanced options
                </Button>
              </div>
              <div className="flex mt-1">
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger className="w-[150px] rounded-r-none border-r-0">
                    <SelectValue placeholder="Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short.ly">short.ly</SelectItem>
                    <SelectItem value="s.id">s.id</SelectItem>
                    <SelectItem value="link.to">link.to</SelectItem>
                  </SelectContent>
                </Select>
                <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-r-0 border-gray-300 text-gray-500">
                  /
                </span>
                <Input
                  id="customAlias"
                  placeholder="custom-alias"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="rounded-l-none"
                />
              </div>
            </div>


            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Link
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-medium text-green-800 mb-2">Link created successfully!</h3>
            <div className="flex items-center">
              <Input value={shortUrl} readOnly className="border-green-300 bg-white" />
              <Button type="button" variant="outline" size="icon" className="ml-2" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
              Create Another
            </Button>
            <Button type="button" className="flex-1" onClick={() => (window.location.href = "#analytics")}>
              View Analytics
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

