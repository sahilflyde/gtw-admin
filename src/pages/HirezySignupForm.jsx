import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import axios from "axios";
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

export default function HirezySignupForms() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://hirezy-web.vercel.app/api/signup"
      ); // ✅ Signup GET route
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching signup forms:", error);
      toast.error("Failed to fetch signup forms");
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

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Heading>Signup Forms</Heading>
        <div className="animate-pulse">
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Signup Forms</Heading>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-zinc-500"
                >
                  No signup forms found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <TableCell className="font-medium">
                    {user.name || "N/A"}
                  </TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="blue"
                      onClick={() => handleViewDetails(user)}
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

      {/* ✅ View Details Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        size="lg"
      >
        <div className="space-y-6">
          <Heading level={2}>User Details</Heading>

          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Name
                </Text>
                <Text className="mt-1">{selectedUser.name || "N/A"}</Text>
              </div>

              <div>
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Email
                </Text>
                <Text className="mt-1">{selectedUser.email || "N/A"}</Text>
              </div>

              <div>
                <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Created At
                </Text>
                <Text className="mt-1">
                  {formatDate(selectedUser.createdAt)}
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
