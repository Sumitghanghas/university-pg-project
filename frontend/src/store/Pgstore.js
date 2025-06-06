// src/store/usePgStore.js
import { create } from 'zustand';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const usePgStore = create((set, get) => ({
  pgListings: [],
  selectedPg: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,

  // Fetch all PG listings
  fetchPgListings: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/api/home/`);
      if (!res.ok) throw new Error("Failed to fetch PG data");

      const result = await res.json();
      const data = result.data || result;

      set({ pgListings: data, isLoading: false, error: null });
      return data;
    } catch (err) {
      const errorMessage = err.message || "Something went wrong";
      set({ isLoading: false, error: errorMessage, pgListings: [] });
      toast.error(errorMessage);
      throw err;
    }
  },

  // Fetch single PG details
  fetchPgDetails: async (pgId) => {
    set({ isLoading: true, error: null, selectedPg: null });
    try {
      const res = await fetch(`${API_BASE_URL}/api/home/pg/${pgId}`);
      if (!res.ok) throw new Error("Failed to fetch PG details");

      const data = await res.json();
      set({ selectedPg: data, isLoading: false, error: null });
      return data;
    } catch (err) {
      const errorMessage = err.message || "Something went wrong";
      set({ isLoading: false, error: errorMessage, selectedPg: null });
      toast.error(errorMessage);
      throw err;
    }
  },

  // Submit new PG form
  submitPgForm: async (pgData) => {
    set({ isSubmitting: true, error: null, success: false });

    const formData = new FormData();

    pgData.media?.images?.forEach((file) => {
      formData.append("images", file);
    });

    const fieldsToStringify = [
      "address",
      "type",
      "contactInfo",
      "rules",
      "amenities",
      "occupancyDetails",
    ];

    for (const key in pgData) {
      if (key === "media") continue;
      if (fieldsToStringify.includes(key)) {
        formData.append(key, JSON.stringify(pgData[key]));
      } else {
        formData.append(key, pgData[key]);
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/home/add`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to submit PG data");

      set({ isSubmitting: false, success: true, error: null });
      toast.success("PG submitted successfully!");

      get().fetchPgListings();

      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to submit PG data";
      set({ isSubmitting: false, error: errorMessage, success: false });
      toast.error(errorMessage);
      throw err;
    }
  },

  clearSelectedPg: () => set({ selectedPg: null }),
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: false }),
  reset: () =>
    set({
      pgListings: [],
      selectedPg: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
      success: false,
    }),
}));

export default usePgStore;
