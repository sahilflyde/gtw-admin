"use client";

import { Heading } from "../../components/heading.jsx";
import { Button } from "../../components/button.jsx";
import { Badge } from "../../components/badge.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table.jsx";
import { DashboardSkeletonLoader } from "../../components/skeleton-loader.jsx";
import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import {
  Dialog,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogActions,
} from "../../components/dialog.jsx";
import { toast } from "react-toastify";

export default function FormsPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/framework-pdf");

      if (response.data.success) {
        setForms(response.data.forms || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/forms/${id}`);
      if (response.data.success) {
        toast.success("Form deleted");
        fetchForms();
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && forms.length === 0) {
    return (
      <div className="space-y-8">
        <Heading>Submitted Forms</Heading>
        <DashboardSkeletonLoader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Heading>Submitted Forms</Heading>
        <div className="flex gap-2">
          <Button color="blue" onClick={fetchForms}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border dark:bg-zinc-900 dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Total Forms
          </p>
          <p className="text-3xl font-semibold mt-2">{forms.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Phone</TableHeader>
              <TableHeader>Created At</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {forms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-zinc-500 dark:text-zinc-400"
                >
                  No forms found
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow
                  key={form._id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <TableCell className="font-medium">{form.name}</TableCell>
                  <TableCell>{form.email}</TableCell>
                  <TableCell>{form.phone}</TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDate(form.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="red"
                      size="sm"
                      onClick={() =>
                        setDeleteDialog({ open: true, id: form._id })
                      }
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

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this form? This action cannot be
          undone.
        </DialogDescription>

        <DialogBody>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            The form will be permanently removed from the database.
          </p>
        </DialogBody>

        <DialogActions>
          <Button
            color="zinc"
            onClick={() => setDeleteDialog({ open: false, id: null })}
          >
            Cancel
          </Button>
          <Button color="red" onClick={() => handleDelete(deleteDialog.id)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
