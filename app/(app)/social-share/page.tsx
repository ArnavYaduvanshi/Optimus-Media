"use client"
import React, { useState, useEffect, useRef } from 'react'
import { CldImage } from 'next-cloudinary';
import { UploadIcon, ImageIcon, DownloadIcon, Crop, Palette, CheckCircleIcon } from 'lucide-react';

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  "LinkedIn Banner (4:1)": { width: 1584, height: 396, aspectRatio: "4:1" },
  "YouTube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
      // Set a timeout to prevent infinite loading state
      const timeout = setTimeout(() => {
        setIsTransforming(false);
      }, 5000); // 5 second fallback
      
      return () => clearTimeout(timeout);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Reset states
    setIsUploading(true);
    setUploadError("");
    setUploadedFileName(file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/image-upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Image upload failed');
      }
      
      const data = await response.json();
      setUploadedImage(data.publicId);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  const handleDownload = async () => {
    if (!imageRef.current || !uploadedImage) return;

    try {
      const response = await fetch(imageRef.current.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedFormat.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  }

  const formatDimensions = (format: SocialFormat) => {
    const { width, height } = socialFormats[format];
    return `${width} × ${height}px`;
  };

  return (
    <div className="bg-[#1a1a1a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Social Media Image Creator</h1>
          <p className="text-gray-400 text-lg">Transform your images for different social media platforms</p>
        </div>

        {/* Upload Section */}
        <div className="bg-[#2a2a2a] rounded-xl border border-gray-700 mb-8">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <UploadIcon className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">Upload an Image</h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Choose an image file
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label 
                  htmlFor="file-upload" 
                  className="flex items-center justify-between w-full px-4 py-3 bg-[#3a3a3a] border border-gray-600 rounded-lg cursor-pointer hover:bg-[#4a4a4a] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                      CHOOSE FILE
                    </div>
                    <span className="text-gray-400">
                      {uploadedFileName || 'No file chosen'}
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Upload Status */}
            {isUploading && (
              <div className="flex items-center gap-3 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <span className="loading loading-spinner loading-sm text-blue-500"></span>
                <span className="text-blue-300">Uploading image...</span>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-300">{uploadError}</span>
              </div>
            )}

            {uploadedImage && !isUploading && (
              <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
                <span className="text-green-300">Image uploaded successfully: {uploadedFileName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Format Selection and Preview */}
        {uploadedImage && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Format Selection */}
            <div className="bg-[#2a2a2a] rounded-xl border border-gray-700">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Crop className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-white">Select Format</h2>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Social Media Platform
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-[#3a3a3a] border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                  >
                    {Object.keys(socialFormats).map((format) => (
                      <option key={format} value={format} className="bg-[#3a3a3a]">
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Format Details */}
                <div className="bg-[#3a3a3a] rounded-lg p-6">
                  <h3 className="font-medium mb-4 text-white">Format Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dimensions:</span>
                      <span className="font-medium text-white">{formatDimensions(selectedFormat)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Aspect Ratio:</span>
                      <span className="font-medium text-white">{socialFormats[selectedFormat].aspectRatio}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-[#2a2a2a] rounded-xl border border-gray-700">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Palette className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-semibold text-white">Preview</h2>
                  </div>
                  {!isTransforming && uploadedImage && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      Download
                    </button>
                  )}
                </div>

                <div className="bg-[#3a3a3a] rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                  {isTransforming ? (
                    <div className="flex flex-col items-center gap-4">
                      <span className="loading loading-spinner loading-lg text-blue-500"></span>
                      <span className="text-blue-300">Transforming image...</span>
                    </div>
                  ) : uploadedImage ? (
                    <div className="max-w-full max-h-[400px] overflow-hidden rounded-lg">
                      <CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[selectedFormat].height}
                        src={uploadedImage}
                        sizes="100vw"
                        alt="Transformed Image"
                        crop="fill"
                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                        gravity="auto"
                        ref={imageRef}
                        onLoad={() => {
                          console.log('Image loaded successfully');
                          setIsTransforming(false);
                        }}
                        onError={(error) => {
                          console.error('Image load error:', error);
                          setIsTransforming(false);
                        }}
                        className="max-w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      No image to display
                    </div>
                  )}
                </div>

                {!isTransforming && uploadedImage && (
                  <div className="text-center mt-4">
                    <div className="inline-block px-3 py-1 bg-blue-900/30 border border-blue-700 rounded-full text-blue-300 text-sm">
                      Optimized for {selectedFormat}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Platform Guide */}
        {!uploadedImage && (
          <div className="bg-[#2a2a2a] rounded-xl border border-gray-700">
            <div className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-white">Supported Platforms</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(socialFormats).map(([format, specs]) => (
                  <div key={format} className="bg-[#3a3a3a] rounded-lg p-6 border border-gray-600">
                    <h4 className="font-medium mb-3 text-white">{format}</h4>
                    <div className="text-sm text-gray-400 space-y-2">
                      <p>Size: {formatDimensions(format as SocialFormat)}</p>
                      <p>Ratio: {specs.aspectRatio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}