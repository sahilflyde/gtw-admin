import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Heading } from "../components/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import { Button } from "../components/button";
import { Dialog } from "../components/dialog";
import { Text } from "../components/text";
import axios from "axios";

export default function HirezyContactForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://hirezy-web.vercel.app/api/contact"
      );
      setForms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching contact forms:", error);
      toast.error("Failed to fetch contact forms");
    } finally {
      setLoading(false);
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

  const handleViewDetails = (form) => {
    setSelectedForm(form);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Heading>Contact Form Submissions</Heading>
        <div className="animate-pulse">
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Contact Form Submissions</Heading>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Phone</TableHeader>
              <TableHeader>Message</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-zinc-500"
                >
                  No forms found
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow
                  key={form._id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <TableCell className="font-medium">
                    {form.fullName || "N/A"}
                  </TableCell>
                  <TableCell>{form.email || "N/A"}</TableCell>
                  <TableCell>{form.phone || "N/A"}</TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {form.message || "N/A"}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDate(form.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="blue"
                      onClick={() => handleViewDetails(form)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Details Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        size="xl"
      >
        <div className="space-y-6">
          <Heading level={2}>Contact Details</Heading>

          {selectedForm && (
            <div className="space-y-4">
              <div>
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Full Name
                </Text>
                <Text className="mt-1">{selectedForm.fullName || "N/A"}</Text>
              </div>
              <div>
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Email
                </Text>
                <Text className="mt-1">{selectedForm.email || "N/A"}</Text>
              </div>
              <div>
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Phone
                </Text>
                <Text className="mt-1">{selectedForm.phone || "N/A"}</Text>
              </div>
              <div>
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Message
                </Text>
                <Text className="mt-1 text-zinc-600 dark:text-zinc-300">
                  {selectedForm.message || "N/A"}
                </Text>
              </div>
              <div>
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Submitted At
                </Text>
                <Text className="mt-1">
                  {formatDate(selectedForm.createdAt)}
                </Text>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <Button color="zinc" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
