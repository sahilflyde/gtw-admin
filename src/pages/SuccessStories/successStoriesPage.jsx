"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api.js";
import { Heading } from "../../components/heading.jsx";
import { Button } from "../../components/button.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table.jsx";
import { Dialog } from "../../components/dialog.jsx";
import { Input } from "../../components/input.jsx";

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    founderName: "",
    founderPost: "",
    description: "",
    photo: null,
    logo: null,
  });

  // 🧠 Fetch all stories
  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/success-stories");
      setStories(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load success stories");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  // 🧱 Add or Update Story
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("founderName", formData.founderName);
      data.append("founderPost", formData.founderPost);
      data.append("description", formData.description);
      if (formData.photo) data.append("photo", formData.photo);
      if (formData.logo) data.append("logo", formData.logo);

      if (editingStory) {
        await api.put(`/success-stories/${editingStory._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Success story updated!");
      } else {
        await api.post("/success-stories", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("New success story added!");
      }

      setIsDialogOpen(false);
      setEditingStory(null);
      setFormData({
        founderName: "",
        founderPost: "",
        description: "",
        photo: null,
        logo: null,
      });
      fetchStories();
    } catch (err) {
      console.error(err);
      toast.error("Error saving success story");
    }
  };

  // 🗑️ Delete story
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await api.delete(`/success-stories/${id}`);
      toast.success("Story deleted!");
      fetchStories();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting story");
    }
  };

  // ✏️ Open edit modal
  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      founderName: story.founderName,
      founderPost: story.founderPost,
      description: story.description,
      photo: null,
      logo: null,
    });
    setIsDialogOpen(true);
  };

  // ➕ Open add modal
  const handleAddNew = () => {
    setEditingStory(null);
    setFormData({
      founderName: "",
      founderPost: "",
      description: "",
      photo: null,
      logo: null,
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Heading>Success Stories</Heading>
        <div className="animate-pulse">
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Success Stories</Heading>
        <Button color="blue" onClick={handleAddNew}>
          + Add New
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Founder</TableHeader>
              <TableHeader>Post</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Photo</TableHeader>
              <TableHeader>Logo</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {stories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-zinc-500"
                >
                  No success stories found
                </TableCell>
              </TableRow>
            ) : (
              stories.map((story) => (
                <TableRow
                  key={story._id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <TableCell className="font-medium">
                    {story.founderName}
                  </TableCell>
                  <TableCell>{story.founderPost}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {story.description}
                  </TableCell>
                  <TableCell>
                    <img
                      src={story.photo}
                      alt="photo"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <img
                      src={story.logo}
                      alt="logo"
                      className="w-10 h-10 object-contain"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(story.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      color="blue"
                      onClick={() => handleEdit(story)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="red"
                      onClick={() => handleDelete(story._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        size="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Heading level={2}>
            {editingStory ? "Edit Success Story" : "Add Success Story"}
          </Heading>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Founder Name
              </label>
              <Input
                name="founderName"
                value={formData.founderName}
                onChange={handleChange}
                placeholder="Enter founder name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Founder Post
              </label>
              <Input
                name="founderPost"
                value={formData.founderPost}
                onChange={handleChange}
                placeholder="Enter founder post"
                required
              />
            </div>
            <div className="col-span-2">


              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter success story description"
                required
              />
            </div>
            <div>

              
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Photo
              </label>
              <Input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
              />
              {editingStory?.photo && (
                <img
                  src={editingStory.photo}
                  alt="old"
                  className="w-12 h-12 mt-2 rounded-full object-cover"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1">
                Logo
              </label>
              <Input
                type="file"
                name="logo"
                onChange={handleFileChange}
                accept="image/*"
              />
              {editingStory?.logo && (
                <img
                  src={editingStory.logo}
                  alt="old"
                  className="w-12 h-12 mt-2 object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <Button
              color="zinc"
              type="button"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button color="blue" type="submit">
              {editingStory ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
