import React, { useState, useRef, useCallback } from "react";
import {
  Trash2,
  Copy,
  Search,
  Upload,
  FolderPlus,
  X,
  Grid,
  List,
  FileText,
  Image,
  Film,
  File,
} from "lucide-react";

// Missing import for Eye component
import { Eye } from "lucide-react";

const MediaManager = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [newTag, setNewTag] = useState("");
  const [storageUsed, setStorageUsed] = useState(0);
  const storageLimit = 500; // storage limit in MB

  const fileInputRef = useRef(null);

  // Handle file selection via click
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    addNewFiles(files);
  };

  // Process and add new files
  const addNewFiles = (files) => {
    const newMediaItems = files.map((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isPDF = file.type === "application/pdf";

      const fileSize = (file.size / (1024 * 1024)).toFixed(2); // size in MB
      setStorageUsed((prev) => prev + parseFloat(fileSize));

      return {
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: fileSize,
        uploadDate: new Date().toISOString(),
        url: isImage || isVideo ? URL.createObjectURL(file) : null,
        file,
        tags: selectedTag ? [selectedTag] : [],
      };
    });

    setMediaItems((prev) => [...prev, ...newMediaItems]);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    addNewFiles(files);
  };

  // Handle selecting items
  const toggleSelectItem = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Delete selected items
  const deleteSelectedItems = () => {
    // Recalculate storage usage
    const itemsToDelete = mediaItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    const sizeToRemove = itemsToDelete.reduce(
      (total, item) => total + parseFloat(item.size),
      0
    );
    setStorageUsed((prev) => Math.max(0, prev - sizeToRemove));

    // Remove items
    setMediaItems((prev) =>
      prev.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
  };

  // Copy media URL
  const copyMediaUrl = (url) => {
    navigator.clipboard.writeText(url);
    // You might want to add a notification here
    alert("URL copied to clipboard!");
  };

  // Filter media items based on search query and selected tag
  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = selectedTag === "" || item.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  // Create a new tag
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
      setNewTag("");
    }
  };

  // Add tag to selected items
  const addTagToSelected = (tag) => {
    if (!tag) return;

    setMediaItems((prev) =>
      prev.map((item) => {
        if (selectedItems.includes(item.id) && !item.tags.includes(tag)) {
          return { ...item, tags: [...item.tags, tag] };
        }
        return item;
      })
    );
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <Image className="w-6 h-6" />;
    if (type.startsWith("video/")) return <Film className="w-6 h-6" />;
    if (type === "application/pdf") return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">Media Manager</h1>

      {/* Storage info */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-600">
            Storage: {storageUsed.toFixed(2)} MB used of {storageLimit} MB
          </span>
          <span className="text-sm text-gray-600">
            {((storageUsed / storageLimit) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className={`h-2 rounded-full ${
              storageUsed / storageLimit > 0.9 ? "bg-red-500" : "bg-blue-500"
            }`}
            style={{
              width: `${Math.min(100, (storageUsed / storageLimit) * 100)}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Upload area */}
      <div
        className={`border-2 border-dashed p-8 rounded-lg text-center mb-6 transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="mb-4 text-gray-500">
          Drag and drop files here, or click to select files
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Select Files
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>

      {/* Search, filter and actions bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search media..."
            className="w-full p-2 pl-10 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tag filter */}
        <div className="flex-grow">
          <select
            className="w-full p-2 border rounded"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Add new tag */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New tag..."
            className="p-2 border rounded"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button
            onClick={handleAddTag}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FolderPlus className="w-5 h-5" />
          </button>
        </div>

        {/* View toggle */}
        <div className="flex border rounded">
          <button
            className={`p-2 ${
              viewMode === "grid" ? "bg-gray-200" : "bg-white"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            className={`p-2 ${
              viewMode === "list" ? "bg-gray-200" : "bg-white"
            }`}
            onClick={() => setViewMode("list")}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Actions for selected items */}
        {selectedItems.length > 0 && (
          <div className="flex gap-2 ml-auto">
            <span className="self-center text-sm text-gray-500">
              {selectedItems.length} selected
            </span>

            {/* Add tag to selected */}
            <select
              className="p-2 border rounded"
              value=""
              onChange={(e) => {
                addTagToSelected(e.target.value);
                e.target.value = "";
              }}
            >
              <option value="" disabled>
                Add tag
              </option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Delete selected */}
            <button
              onClick={deleteSelectedItems}
              className="p-2 text-red-600 bg-red-100 rounded hover:bg-red-200"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Media grid/list */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg overflow-hidden ${
                selectedItems.includes(item.id) ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {/* Media thumbnail */}
              <div
                className="flex items-center justify-center bg-gray-100 cursor-pointer aspect-square"
                onClick={() => item.url && setShowPreview(item)}
              >
                {item.type.startsWith("image/") ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-gray-400">{getFileIcon(item.type)}</div>
                )}
              </div>

              {/* Info and actions */}
              <div className="p-2">
                <div className="text-sm font-medium truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-500">{item.size} MB</div>

                <div className="flex justify-between mt-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleSelectItem(item.id)}
                      className={`p-1 rounded ${
                        selectedItems.includes(item.id)
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100"
                      }`}
                    >
                      {selectedItems.includes(item.id) ? "Selected" : "Select"}
                    </button>

                    {item.url && (
                      <button
                        onClick={() => copyMediaUrl(item.url)}
                        className="p-1 bg-gray-100 rounded"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      const newItems = mediaItems.filter(
                        (media) => media.id !== item.id
                      );
                      setStorageUsed((prev) =>
                        Math.max(0, prev - parseFloat(item.size))
                      );
                      setMediaItems(newItems);
                    }}
                    className="p-1 text-red-500 bg-gray-100 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 p-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"></th>
                <th className="p-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Name
                </th>
                <th className="p-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Type
                </th>
                <th className="p-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Size
                </th>
                <th className="p-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date
                </th>
                <th className="p-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Tags
                </th>
                <th className="p-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedia.map((item) => (
                <tr
                  key={item.id}
                  className={
                    selectedItems.includes(item.id) ? "bg-blue-50" : ""
                  }
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </td>
                  <td className="flex items-center gap-2 p-3">
                    {getFileIcon(item.type)}
                    <span className="max-w-xs truncate" title={item.name}>
                      {item.name}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {item.type.split("/")[1]}
                  </td>
                  <td className="p-3 text-sm text-gray-500">{item.size} MB</td>
                  <td className="p-3 text-sm text-gray-500">
                    {formatDate(item.uploadDate)}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {item.url && (
                        <button
                          onClick={() => item.url && setShowPreview(item)}
                          className="p-1 bg-gray-100 rounded"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {item.url && (
                        <button
                          onClick={() => copyMediaUrl(item.url)}
                          className="p-1 bg-gray-100 rounded"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const newItems = mediaItems.filter(
                            (media) => media.id !== item.id
                          );
                          setStorageUsed((prev) =>
                            Math.max(0, prev - parseFloat(item.size))
                          );
                          setMediaItems(newItems);
                        }}
                        className="p-1 text-red-500 bg-gray-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="max-w-4xl max-h-screen p-4">
            <div className="overflow-hidden bg-white rounded-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">{showPreview.name}</h3>
                <button
                  onClick={() => setShowPreview(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {showPreview.type.startsWith("image/") ? (
                  <img
                    src={showPreview.url}
                    alt={showPreview.name}
                    className="object-contain max-w-full max-h-screen"
                  />
                ) : showPreview.type.startsWith("video/") ? (
                  <video
                    src={showPreview.url}
                    controls
                    className="max-w-full max-h-screen"
                  />
                ) : (
                  <div className="py-12 text-center">
                    {getFileIcon(showPreview.type)}
                    <p className="mt-2">{showPreview.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {showPreview.type}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between p-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">
                    Uploaded: {formatDate(showPreview.uploadDate)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Size: {showPreview.size} MB
                  </p>
                </div>
                <button
                  onClick={() => copyMediaUrl(showPreview.url)}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredMedia.length === 0 && (
        <div className="py-12 text-center text-gray-500 border rounded-lg">
          <Upload className="w-12 h-12 mx-auto mb-4" />
          <p>No media found. Upload some files to get started!</p>
        </div>
      )}
    </div>
  );
};

export default MediaManager;


