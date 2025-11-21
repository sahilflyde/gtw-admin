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

export default function CaseStudiesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  // STATIC STATIC STATIC STRUCTURE
  const emptyList = (count) =>
    Array(count)
      .fill()
      .map(() => ({ listing: "", subListing: "" }));

  const emptyList2 = (count) =>
    Array(count)
      .fill()
      .map(() => ({ listing: "" }));

  const [formData, setFormData] = useState({
    slug: "",
    meta_title: "",
    meta_description: "",
    title: "",
    date: "",
    category: "",
    tags: "",
    heroImage: "",

    // SECTIONS
    sec1_head: "",
    sec1_content: "",

    sec2_head: "",
    sec2_content: "",

    sec3_head: "",
    sec3_list: emptyList(4),

    sec4_head: "",
    sec4_content: "",

    sec5_head: "",
    sec5_list: emptyList(8),

    sec6_head: "",
    sec6_list2: emptyList2(5),

    testimonial_quote: "",
    testimonial_author: "",
    testimonial_position: "",
  });

  /** Fetch case studies */
  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await api.get("/case-studies");
      setCases(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load case studies");
    } finally {
      setLoading(false);
    }
  };

  /** Handle base field changes */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /** Handle nested list */
  const handleListChange = (section, index, key, value) => {
    const updated = [...formData[section]];
    updated[index][key] = value;
    setFormData({ ...formData, [section]: updated });
  };

  /** Reset everything */
  const resetForm = () => {
    setFormData({
      slug: "",
      meta_title: "",
      meta_description: "",
      title: "",
      date: "",
      category: "",
      tags: "",
      heroImage: "",

      sec1_head: "",
      sec1_content: "",

      sec2_head: "",
      sec2_content: "",

      sec3_head: "",
      sec3_list: emptyList(4),

      sec4_head: "",
      sec4_content: "",

      sec5_head: "",
      sec5_list: emptyList(8),

      sec6_head: "",
      sec6_list2: emptyList2(5),

      testimonial_quote: "",
      testimonial_author: "",
      testimonial_position: "",
    });
  };

  /** OPEN EDIT */
  const handleEdit = (item) => {
    setEditingCase(item);

    const sec = item.sections;

    setFormData({
      slug: item.slug,
      meta_title: item.meta_title,
      meta_description: item.meta_description,
      title: item.title,
      date: item.date?.split("T")[0],
      category: item.category,
      tags: item.tags?.join(", "),
      heroImage: item.heroImage,

      sec1_head: sec[0]?.head || "",
      sec1_content: sec[0]?.content || "",

      sec2_head: sec[1]?.head || "",
      sec2_content: sec[1]?.content || "",

      sec3_head: sec[2]?.head || "",
      sec3_list:
        sec[2]?.content?.map((i) => ({
          listing: i.listing,
          subListing: i["sub-listing"],
        })) || emptyList(4),

      sec4_head: sec[3]?.head || "",
      sec4_content: sec[3]?.content || "",

      sec5_head: sec[4]?.head || "",
      sec5_list:
        sec[5]?.content?.map((i) => ({
          listing: i.listing,
          subListing: i["sub-listing"],
        })) || emptyList(8),

      sec6_head: sec[6]?.head || "",
      sec6_list2:
        sec[6]?.content?.map((i) => ({
          listing: i.listing,
        })) || emptyList2(5),

      testimonial_quote: sec[7]?.quote || "",
      testimonial_author: sec[7]?.author || "",
      testimonial_position: sec[7]?.position || "",
    });

    setIsDialogOpen(true);
  };

  /** OPEN ADD */
  const handleAddNew = () => {
    resetForm();
    setEditingCase(null);
    setIsDialogOpen(true);
  };

  /** SUBMIT */
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

      sections: [
        {
          type: "text",
          head: formData.sec1_head,
          content: formData.sec1_content,
        },
        {
          type: "text",
          head: formData.sec2_head,
          content: formData.sec2_content,
        },
        {
          type: "list",
          head: formData.sec3_head,
          content: formData.sec3_list.map((i) => ({
            listing: i.listing,
            "sub-listing": i.subListing,
          })),
        },
        {
          type: "text",
          head: formData.sec4_head,
          content: formData.sec4_content,
        },
        {
          type: "text",
          head: formData.sec5_head,
          content: "",
        },
        {
          type: "list",
          content: formData.sec5_list.map((i) => ({
            listing: i.listing,
            "sub-listing": i.subListing,
          })),
        },
        {
          type: "list2",
          head: formData.sec6_head,
          content: formData.sec6_list2.map((i) => ({
            listing: i.listing,
          })),
        },
        {
          type: "testimonial",
          quote: formData.testimonial_quote,
          author: formData.testimonial_author,
          position: formData.testimonial_position,
        },
      ],
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
      setEditingCase(null);
      fetchCases();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save case study");
    }
  };

  /** DELETE */
  const handleDelete = async (id) => {
    if (!confirm("Delete this case study?")) return;

    try {
      await api.delete(`/case-studies/${id}`);
      toast.success("Deleted!");
      fetchCases();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  /* ------------ UI START ------------ */

  if (loading) {
    return (
      <div className="space-y-6">
        <Heading>Case Studies</Heading>
        <div className="h-64 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Case Studies</Heading>
        <Button color="blue" onClick={handleAddNew}>
          + Add New
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Title</TableHeader>
              <TableHeader>Slug</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Tags</TableHeader>
              <TableHeader>Hero</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-zinc-500 py-8"
                >
                  No case studies
                </TableCell>
              </TableRow>
            ) : (
              cases.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.slug}</TableCell>
                  <TableCell>{c.category}</TableCell>
                  <TableCell>{c.tags?.join(", ")}</TableCell>

                  <TableCell>
                    <img
                      src={c.heroImage}
                      className="w-10 h-10 rounded object-cover"
                    />
                  </TableCell>

                  <TableCell>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      color="blue"
                      onClick={() => handleEdit(c)}
                    >
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --------------------- MODAL ---------------------- */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        size="2xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[80vh] overflow-y-auto p-4"
        >
          <Heading level={2}>
            {editingCase ? "Edit Case Study" : "Add Case Study"}
          </Heading>

          {/* BASIC INFO */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
            />
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
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

          {/* SECTION BLOCK COMPONENT */}
          {sectionBlock("Section 1 (Text)", [
            <Input
              label="Head"
              name="sec1_head"
              value={formData.sec1_head}
              onChange={handleChange}
            />,
            textarea(
              "Content",
              "sec1_content",
              formData.sec1_content,
              handleChange
            ),
          ])}

          {sectionBlock("Section 2 (Text)", [
            <Input
              label="Head"
              name="sec2_head"
              value={formData.sec2_head}
              onChange={handleChange}
            />,
            textarea(
              "Content",
              "sec2_content",
              formData.sec2_content,
              handleChange
            ),
          ])}

          {sectionBlock("Section 3 (List)", [
            <Input
              label="Head"
              name="sec3_head"
              value={formData.sec3_head}
              onChange={handleChange}
            />,
            ...formData.sec3_list.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <Input
                  label={`Listing ${i + 1}`}
                  value={item.listing}
                  onChange={(e) =>
                    handleListChange("sec3_list", i, "listing", e.target.value)
                  }
                />
                <Input
                  label={`Sub Listing ${i + 1}`}
                  value={item.subListing}
                  onChange={(e) =>
                    handleListChange(
                      "sec3_list",
                      i,
                      "subListing",
                      e.target.value
                    )
                  }
                />
              </div>
            )),
          ])}

          {sectionBlock("Section 4 (Text)", [
            <Input
              label="Head"
              name="sec4_head"
              value={formData.sec4_head}
              onChange={handleChange}
            />,
            textarea(
              "Content",
              "sec4_content",
              formData.sec4_content,
              handleChange
            ),
          ])}

          {sectionBlock("Section 5 (List)", [
            <Input
              label="Head"
              name="sec5_head"
              value={formData.sec5_head}
              onChange={handleChange}
            />,
            ...formData.sec5_list.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <Input
                  label={`Listing ${i + 1}`}
                  value={item.listing}
                  onChange={(e) =>
                    handleListChange("sec5_list", i, "listing", e.target.value)
                  }
                />
                <Input
                  label={`Sub Listing ${i + 1}`}
                  value={item.subListing}
                  onChange={(e) =>
                    handleListChange(
                      "sec5_list",
                      i,
                      "subListing",
                      e.target.value
                    )
                  }
                />
              </div>
            )),
          ])}

          {sectionBlock("Section 6 (List2)", [
            <Input
              label="Head"
              name="sec6_head"
              value={formData.sec6_head}
              onChange={handleChange}
            />,
            ...formData.sec6_list2.map((item, i) => (
              <Input
                key={i}
                label={`Point ${i + 1}`}
                value={item.listing}
                onChange={(e) =>
                  handleListChange("sec6_list2", i, "listing", e.target.value)
                }
              />
            )),
          ])}

          {sectionBlock("Testimonial", [
            textarea(
              "Quote",
              "testimonial_quote",
              formData.testimonial_quote,
              handleChange
            ),
            <Input
              label="Author"
              name="testimonial_author"
              value={formData.testimonial_author}
              onChange={handleChange}
            />,
            <Input
              label="Position"
              name="testimonial_position"
              value={formData.testimonial_position}
              onChange={handleChange}
            />,
          ])}

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              color="zinc"
              type="button"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button color="blue" type="submit">
              {editingCase ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

/* Helpers */

function sectionBlock(title, children) {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white dark:bg-zinc-900">
      <Heading level={3}>{title}</Heading>
      {children}
    </div>
  );
}

function textarea(label, name, value, onChange) {
  return (
    <div className="space-y-1">
      <label className="font-medium text-sm">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full border rounded p-2"
      />
    </div>
  );
}
