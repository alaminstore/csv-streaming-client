import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import type { Customer } from "../interface/customer";
import UploadProgress from "../components/UploadProgress";
import CustomerTable from "../components/CustomerTable";
import CustomerFormModal from "../components/CustomerFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import SuccessNotification from "../components/SuccessNotification";
import ErrorNotification from "../components/ErrorNotification";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 10;

const CustomerDashboard = () => {
  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [totalRows, setTotalRows] = useState(2000000);
  const [elapsed, setElapsed] = useState(0);
  const [eta, setEta] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for SSE and timer
  const eventSourceRef = useRef<EventSource | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  // Customer data state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch customers from API
  const fetchCustomers = useCallback(async (page: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/customers?page=${page}&limit=${ITEMS_PER_PAGE}`,
      );
      setCustomers(response.data.data);
      setTotalPages(response.data.meta.totalPages || 1);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  }, []);

  // Fetch customers when page changes
  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage, fetchCustomers]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Start elapsed time counter
  const startElapsedTimer = () => {
    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current);
    }
    elapsedIntervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsedSeconds = Math.floor(
          (new Date().getTime() - startTimeRef.current.getTime()) / 1000,
        );
        setElapsed(elapsedSeconds);
      }
    }, 1000);
  };

  // Connect to SSE for real-time progress
  const connectToSSE = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `${API_BASE_URL}/customers/sync/stream`,
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setProcessed(data.processedRows);
        setTotalRows(data.totalRows);
        setTotalPages(data.totalPages);
        setUploadProgress(data.progress);

        if (data.estimatedCompletion) {
          const etaDate = new Date(data.estimatedCompletion);
          const etaSeconds = Math.max(
            0,
            Math.floor((etaDate.getTime() - new Date().getTime()) / 1000),
          );
          setEta(etaSeconds);
        }

        if (data.recentRows && data.recentRows.length > 0) {
          setCustomers(data.recentRows);
        }

        if (
          data.status === "completed" ||
          data.status === "failed" ||
          data.status === "cancelled"
        ) {
          setIsUploading(false);
          eventSource.close();
          if (elapsedIntervalRef.current) {
            clearInterval(elapsedIntervalRef.current);
          }
          if (data.status === "failed") {
            setError("Sync failed");
          }
        }
      } catch (err) {
        // I know ignoring errors isn’t ideal, but we can handle this using a logging service later.
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = () => {
      console.error("Server Sent Events connection error");
    };
  };

  const handleStartSync = async () => {
    setError(null);
    setIsUploading(true);
    setProcessed(0);
    setUploadProgress(0);
    setElapsed(0);
    setEta(0);
    startTimeRef.current = new Date();

    try {
      const response = await axios.post(`${API_BASE_URL}/customers/sync`);
      setTotalRows(response.data.totalRows);
      setTotalPages(response.data.totalPages);
      connectToSSE();
      startElapsedTimer();
    } catch (err: unknown) {
      setIsUploading(false);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to start sync");
      }
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const customerData = {
      customerId: formData.get("customerId") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      company: (formData.get("company") as string) || "",
      city: (formData.get("city") as string) || "",
      country: (formData.get("country") as string) || "",
      phone1: (formData.get("phone1") as string) || "",
      phone2: (formData.get("phone2") as string) || "",
      email: formData.get("email") as string,
      subscriptionDate: formData.get("subscriptionDate")
        ? new Date(formData.get("subscriptionDate") as string)
        : new Date(),
      website: (formData.get("website") as string) || "",
      about: (formData.get("about") as string) || "",
    };

    try {
      await axios.post(`${API_BASE_URL}/customers`, customerData);
      setShowAddModal(false);
      setSuccessMessage("Customer created successfully!");
      setCurrentPage(1);
      fetchCustomers(1);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
        setTimeout(() => setError(null), 3000);
      } else {
        setError("Failed to create customer");
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCustomer) return;

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const updateData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      company: (formData.get("company") as string) || "",
      city: (formData.get("city") as string) || "",
      country: (formData.get("country") as string) || "",
      phone1: (formData.get("phone1") as string) || "",
      phone2: (formData.get("phone2") as string) || "",
      email: formData.get("email") as string,
      subscriptionDate: formData.get("subscriptionDate")
        ? new Date(formData.get("subscriptionDate") as string)
        : undefined,
      website: (formData.get("website") as string) || "",
      about: (formData.get("about") as string) || "",
    };

    try {
      await axios.patch(
        `${API_BASE_URL}/customers/${editingCustomer.id}`,
        updateData,
      );
      setShowEditModal(false);
      setEditingCustomer(null);
      setSuccessMessage("Customer updated successfully!");
      fetchCustomers(currentPage);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
        setTimeout(() => setError(null), 3000);
      } else {
        setError("Failed to update customer");
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;

    setIsSubmitting(true);
    try {
      await axios.delete(`${API_BASE_URL}/customers/${customerToDelete.id}`);
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      setSuccessMessage("Customer deleted successfully!");
      // If only 1 item on current page and not on first page, go to previous page
      if (customers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchCustomers(currentPage);
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to delete customer");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check sync status on mount
  useEffect(() => {
    const checkSyncStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/customers/sync/status`,
        );
        const job = response.data;
        if (job && (job.status === "pending" || job.status === "processing")) {
          // Sync is already running, connect to SSE
          setIsUploading(true);
          setProcessed(job.processedRows);
          setTotalRows(job.totalRows);
          setUploadProgress(job.progress);
          startTimeRef.current = job.startedAt
            ? new Date(job.startedAt)
            : new Date();
          connectToSSE();
          startElapsedTimer();
        }
      } catch {
        // No running sync, that's fine
        console.log("No active sync job");
      }
    };
    checkSyncStatus();

    return () => {
      // Cleanup on unmount
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
      }
    };
  }, []);

  // Modal handlers
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingCustomer(null);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleCloseSuccessNotification = () => setSuccessMessage(null);
  const handleCloseErrorNotification = () => setError(null);

  // Page change handler
  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="min-h-screen p-8 max-w-[1280px] mx-auto">
      {/* Upload Progress Section */}
      <UploadProgress
        progress={uploadProgress}
        processed={processed}
        totalRows={totalRows}
        elapsed={elapsed}
        eta={eta}
        isUploading={isUploading}
        error={error}
        onStartSync={handleStartSync}
        formatTime={formatTime}
      />

      {/* Customer Table Section */}
      <CustomerTable
        customers={customers}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onAddClick={() => setShowAddModal(true)}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      {/* Add Customer Modal */}
      <CustomerFormModal
        isOpen={showAddModal}
        isEdit={false}
        customer={null}
        isSubmitting={isSubmitting}
        onClose={handleCloseAddModal}
        onSubmit={handleCustomerSubmit}
      />

      {/* Edit Customer Modal */}
      <CustomerFormModal
        isOpen={showEditModal}
        isEdit={true}
        customer={editingCustomer}
        isSubmitting={isSubmitting}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        customer={customerToDelete}
        isSubmitting={isSubmitting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
      />

      {/* Success Notification */}
      <SuccessNotification
        message={successMessage}
        onClose={handleCloseSuccessNotification}
      />

      {/* Error Notification */}
      <ErrorNotification
        message={error}
        onClose={handleCloseErrorNotification}
      />
    </div>
  );
};

export default CustomerDashboard;
