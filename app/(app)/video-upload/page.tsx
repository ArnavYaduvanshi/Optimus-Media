"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UploadIcon, VideoIcon } from 'lucide-react';

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  // Max file size 60 mb
  const MAX_FILE_SIZE = 60 * 1024 * 1024; // 60 MB

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 60 MB limit.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post('/api/video-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert("Video uploaded successfully!");
      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Video Upload</h1>
        <p className="text-gray-400">Upload and share your videos with the world</p>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter a compelling title for your video"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your video content..."
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Video File
            </label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                file 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-600 hover:border-blue-500 bg-gray-700/50'
              }`}>
                <div className="flex flex-col items-center space-y-3">
                  {file ? (
                    <>
                      <VideoIcon className="w-12 h-12 text-green-500" />
                      <div className="text-center">
                        <p className="text-green-400 font-medium">{file.name}</p>
                        <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-12 h-12 text-gray-400" />
                      <div className="text-center">
                        <p className="text-white font-medium">Click to upload video</p>
                        <p className="text-gray-400 text-sm">or drag and drop</p>
                        <p className="text-gray-500 text-xs mt-1">Maximum file size: 60MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress or File Info */}
          {file && !isUploading && (
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <VideoIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isUploading || !file}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                isUploading || !file
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UploadIcon className="w-5 h-5" />
                  <span>Upload Video</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Upload Tips */}
      <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Upload Tips</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Supported formats: MP4, AVI, MOV, WMV, and more</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Maximum file size: 60MB</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>For best quality, use H.264 encoding with AAC audio</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Add a compelling title and description to increase engagement</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default VideoUpload;