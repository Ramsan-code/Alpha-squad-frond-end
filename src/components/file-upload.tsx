"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface FileUploadProps {
    onUploadComplete: (url: string, publicId: string) => void
    folder?: string
    accept?: string
    maxSize?: number // in MB
    preview?: boolean
}

export function FileUpload({
    onUploadComplete,
    folder = "alpha-lms",
    accept = "image/*",
    maxSize = 5,
    preview = true,
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            toast.error(`File size must be less than ${maxSize}MB`)
            return
        }

        // Show preview
        if (preview && file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }

        // Upload file
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", folder)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            const data = await response.json()
            onUploadComplete(data.url, data.publicId)
            toast.success("File uploaded successfully!")
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload file")
            setPreviewUrl(null)
        } finally {
            setUploading(false)
        }
    }

    const clearPreview = () => {
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="space-y-4">
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
            />

            {previewUrl ? (
                <div className="relative">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-muted">
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -right-2 -top-2 h-8 w-8 rounded-full"
                        onClick={clearPreview}
                        disabled={uploading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 border-dashed border-2 hover:border-accent-vibrant hover:bg-accent-vibrant/5"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-accent-vibrant" />
                            <span className="text-sm text-muted-foreground">Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <div className="text-sm">
                                <span className="font-semibold text-accent-vibrant">Click to upload</span>
                                <span className="text-muted-foreground"> or drag and drop</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Max file size: {maxSize}MB
                            </span>
                        </div>
                    )}
                </Button>
            )}
        </div>
    )
}
