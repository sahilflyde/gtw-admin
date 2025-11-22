"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Heading } from "../components/heading";
import { Button } from "../components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import { Dialog } from "../components/dialog";
import { Input } from "../components/input";
import api from "../utils/api";

/* -------------------------- EMPTY SECTION GENERATOR -------------------------- */
const createEmptySection = (type = "text") => {
  switch (type) {
    case "text":
      return { type: "text", head: "", content: "" };

    case "image":
      return { type: "image", imageSrc: "", imageAlt: "", content: "" };

    case "list":
      return { type: "list", head: "", content: [] };

    case "list2":
      return { type: "list2", head: "", content: [] };

    case "testimonial":
      return { type: "testimonial", quote: "", author: "", position: "" };

    default:
      return { type: "text", head: "", content: "" };
  }
};

export default function CaseStudiesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  const [formData, setFormData] = useState({
    slug: "",
    meta_title: "",
    meta_description: "",
    title: "",
    date: "",
    category: "",
    tags: "",
    heroImage: "",
    sections: [],
  });

  /* ----------------------------- Fetch Cases ----------------------------- */

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await api.get("/case-studies");
      setCases(res.data || []);
    } catch (err) {
      toast.error("Failed to load case studies");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- Edit Case ----------------------------- */

  const handleEdit = (item) => {
    setEditingCase(item);

    setFormData({
      slug: item.slug,
      meta_title: item.meta_title,
      meta_description: item.meta_description,
      title: item.title,
      date: item.date ? item.date.split("T")[0] : "",
      category: item.category,
      tags: item.tags?.join(", "),
      heroImage: item.heroImage,
      sections: item.sections || [],
    });

    setIsDialogOpen(true);
  };

  /* ----------------------------- Add Case ----------------------------- */

  const handleAddNew = () => {
    setEditingCase(null);
    setFormData({
      slug: "",
      meta_title: "",
      meta_description: "",
      title: "",
      date: "",
      category: "",
      tags: "",
      heroImage: "",
      sections: [],
    });
    setIsDialogOpen(true);
  };

  /* ----------------------------- Input Update ----------------------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateSection = (index, key, value) => {
    const updated = [...formData.sections];
    updated[index][key] = value;
    setFormData({ ...formData, sections: updated });
  };

  const updateSectionType = (index, type) => {
    const updated = [...formData.sections];
    updated[index] = createEmptySection(type);
    setFormData({ ...formData, sections: updated });
  };

  const updateListItem = (secIndex, itemIndex, key, value) => {
    const updated = [...formData.sections];
    updated[secIndex].content[itemIndex][key] = value;
    setFormData({ ...formData, sections: updated });
  };

  const addListItem = (secIndex) => {
    const updated = [...formData.sections];
    updated[secIndex].content.push({ listing: "", "sub-listing": "" });
    setFormData({ ...formData, sections: updated });
  };

  const addListItemSimple = (secIndex) => {
    const updated = [...formData.sections];
    updated[secIndex].content.push({ listing: "" });
    setFormData({ ...formData, sections: updated });
  };

  const removeListItem = (secIndex, itemIndex) => {
    const updated = [...formData.sections];
    updated[secIndex].content.splice(itemIndex, 1);
    setFormData({ ...formData, sections: updated });
  };

  const removeSection = (index) => {
    const updated = [...formData.sections];
    updated.splice(index, 1);
    setFormData({ ...formData, sections: updated });
  };

  /* ----------------------------- Submit ----------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      slug: formData.slug,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      title: formData.title,
      date: formData.date,
      category: formData.category,
      tags: formData.tags.split(",").map((t) => t.trim()),
      heroImage: formData.heroImage,
      sections: formData.sections,
    };

    try {
      if (editingCase) {
        await api.put(`/case-studies/${editingCase._id}`, payload);
        toast.success("Case study updated!");
      } else {
        await api.post(`/case-studies`, payload);
        toast.success("Case study added!");
      }

      setIsDialogOpen(false);
      fetchCases();
    } catch {
      toast.error("Failed to save case study");
    }
  };

  /* ----------------------------- Delete ----------------------------- */

  const handleDelete = async (id) => {
    if (!confirm("Delete this case study?")) return;

    try {
      await api.delete(`/case-studies/${id}`);
      toast.success("Deleted!");
      fetchCases();
    } catch {
      toast.error("Failed to delete case study");
    }
  };

  /* ----------------------------- UI ----------------------------- */

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading>Case Studies</Heading>
        <Button color="blue" onClick={handleAddNew}>
          + Add New
        </Button>
      </div>

      {/* TABLE */}
      <Table className="border rounded-lg">
        <TableHead>
          <TableRow>
            <TableHeader>Title</TableHeader>
            <TableHeader>Slug</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {cases.map((c) => (
            <TableRow key={c._id}>
              <TableCell>{c.title}</TableCell>
              <TableCell>{c.slug}</TableCell>
              <TableCell>{c.category}</TableCell>
              <TableCell>
                {new Date(c.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(c)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  color="red"
                  onClick={() => handleDelete(c._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ----------------------------- MODAL ----------------------------- */}

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        size="2xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-4 max-h-[80vh] overflow-y-auto"
        >
          <Heading level={2}>
            {editingCase ? "Edit Case Study" : "Add Case Study"}
          </Heading>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
            />
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <Input
              label="Meta Title"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
            />
            <Input
              label="Meta Description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
            />
            <Input
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
            <Input
              label="Tags (comma separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
            <Input
              label="Hero Image URL"
              name="heroImage"
              value={formData.heroImage}
              onChange={handleChange}
            />
            <Input
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          {/* ----------------------------- SECTIONS ----------------------------- */}

          {formData.sections.map((sec, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <Heading level={3}>
                Section {index + 1} — {sec.type}
              </Heading>

              {/* SECTION TYPE DROPDOWN */}
              <select
                value={sec.type}
                onChange={(e) => updateSectionType(index, e.target.value)}
                className="border p-2 rounded w-full !bg-gray "
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="list">List</option>
                <option value="list2">List2</option>
                <option value="testimonial">Testimonial</option>
              </select>

              {/* TEXT */}
              {sec.type === "text" && (
                <>
                  <Input
                    label="Head (optional)"
                    value={sec.head}
                    onChange={(e) =>
                      updateSection(index, "head", e.target.value)
                    }
                  />
                  <Textarea
                    label="Content"
                    value={sec.content}
                    onChange={(e) =>
                      updateSection(index, "content", e.target.value)
                    }
                  />
                </>
              )}

              {/* IMAGE */}
              {sec.type === "image" && (
                <>
                  <Input
                    label="Image URL"
                    value={sec.imageSrc}
                    onChange={(e) =>
                      updateSection(index, "imageSrc", e.target.value)
                    }
                  />
                  <Input
                    label="Alt Text"
                    value={sec.imageAlt}
                    onChange={(e) =>
                      updateSection(index, "imageAlt", e.target.value)
                    }
                  />
                  <Textarea
                    label="Caption (optional)"
                    value={sec.content}
                    onChange={(e) =>
                      updateSection(index, "content", e.target.value)
                    }
                  />
                </>
              )}

              {/* LIST */}
              {sec.type === "list" && (
                <>
                  <Input
                    label="Head (optional)"
                    value={sec.head}
                    onChange={(e) =>
                      updateSection(index, "head", e.target.value)
                    }
                  />

                  {sec.content.map((item, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 relative">
                      <Input
                        label={`Listing ${i + 1}`}
                        value={item.listing}
                        onChange={(e) =>
                          updateListItem(index, i, "listing", e.target.value)
                        }
                      />

                      <Input
                        label={`Sub Listing ${i + 1}`}
                        value={item["sub-listing"]}
                        onChange={(e) =>
                          updateListItem(
                            index,
                            i,
                            "sub-listing",
                            e.target.value
                          )
                        }
                      />

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        onClick={() => removeListItem(index, i)}
                        className="absolute -right-4 top-1 text-red-500 text-xl"
                      >
                        ❌
                      </button>
                    </div>
                  ))}

                  <Button type="button" onClick={() => addListItem(index)}>
                    + Add Item
                  </Button>
                </>
              )}

              {/* LIST2 */}
              {sec.type === "list2" && (
                <>
                  <Input
                    label="Head"
                    value={sec.head}
                    onChange={(e) =>
                      updateSection(index, "head", e.target.value)
                    }
                  />

                  {sec.content.map((item, i) => (
                    <div key={i} className="relative">
                      <Input
                        label={`Point ${i + 1}`}
                        value={item.listing}
                        onChange={(e) =>
                          updateListItem(index, i, "listing", e.target.value)
                        }
                      />

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        onClick={() => removeListItem(index, i)}
                        className="absolute -right-4 top-3 text-red-500 text-xl"
                      >
                        ❌
                      </button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() => addListItemSimple(index)}
                  >
                    + Add Point
                  </Button>
                </>
              )}

              {/* TESTIMONIAL */}
              {sec.type === "testimonial" && (
                <>
                  <Textarea
                    label="Quote"
                    value={sec.quote}
                    onChange={(e) =>
                      updateSection(index, "quote", e.target.value)
                    }
                  />
                  <Input
                    label="Author"
                    value={sec.author}
                    onChange={(e) =>
                      updateSection(index, "author", e.target.value)
                    }
                  />
                  <Input
                    label="Position"
                    value={sec.position}
                    onChange={(e) =>
                      updateSection(index, "position", e.target.value)
                    }
                  />
                </>
              )}

              <Button
                color="red"
                type="button"
                onClick={() => removeSection(index)}
              >
                Delete Section
              </Button>
            </div>
          ))}

          <Button
            type="button"
            color="blue"
            onClick={() =>
              setFormData({
                ...formData,
                sections: [...formData.sections, createEmptySection("text")],
              })
            }
          >
            + Add Section
          </Button>

          <div className="flex justify-end pt-4 gap-2">
            <Button type="button" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" color="blue">
              {editingCase ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

/* ----------------------------- Textarea Component ----------------------------- */

function Textarea({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={onChange}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}
