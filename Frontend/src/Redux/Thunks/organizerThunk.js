import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  eventApi,
  attendeeApi,
  qrCodeApi,
  discountApi,
  salesApi,
  organizerProfileApi,
} from "../../Api/Organizer/organizerApi";

// ===== EVENT THUNKS =====
export const createEvent = createAsyncThunk(
  "organizer/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      return await eventApi.create(eventData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  "organizer/updateEvent",
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      console.log("Updating event with ID:", id);
      const response = await eventApi.update(id, eventData);
      console.log("Update response:", response);
      return response;
    } catch (error) {
      console.error(
        "Error updating event:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event"
      );
    }
  }
);

export const getOrganizerEvents = createAsyncThunk(
  "organizer/getEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await eventApi.getAll();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const getOrganizerEventById = createAsyncThunk(
  "organizer/getEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventApi.getById(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event details"
      );
    }
  }
);

export const deleteOrganizerEvent = createAsyncThunk(
  "organizer/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventApi.delete(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  }
);

// ===== ATTENDEE THUNKS =====
export const getEventAttendees = createAsyncThunk(
  "organizer/getEventAttendees",
  async (eventId, { rejectWithValue }) => {
    try {
      return await attendeeApi.getEventAttendees(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendees"
      );
    }
  }
);

export const markAttendance = createAsyncThunk(
  "organizer/markAttendance",
  async ({ attendeeId, attendanceData }, { rejectWithValue }) => {
    try {
      return await attendeeApi.markAttendance(attendeeId, attendanceData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark attendance"
      );
    }
  }
);

export const resendConfirmation = createAsyncThunk(
  "organizer/resendConfirmation",
  async (ticketId, { rejectWithValue }) => {
    try {
      return await attendeeApi.resendConfirmation(ticketId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend confirmation"
      );
    }
  }
);

export const exportAttendeeList = createAsyncThunk(
  "organizer/exportAttendeeList",
  async ({ eventId, format }, { rejectWithValue }) => {
    try {
      return await attendeeApi.exportAttendeeList(eventId, format);
    } catch (error) {
      console.error("Export error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          `Failed to export attendee list as ${format}`
      );
    }
  }
);

// ===== QR CODE THUNKS =====
export const generateQRCode = createAsyncThunk(
  "organizer/generateQRCode",
  async (ticketId, { rejectWithValue }) => {
    try {
      return await qrCodeApi.generate(ticketId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate QR code"
      );
    }
  }
);

export const validateQRCode = createAsyncThunk(
  "organizer/validateQRCode",
  async (qrData, { rejectWithValue }) => {
    try {
      return await qrCodeApi.validate(qrData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to validate QR code"
      );
    }
  }
);

// ===== DISCOUNT THUNKS =====
export const createDiscount = createAsyncThunk(
  "organizer/createDiscount",
  async (discountData, { rejectWithValue }) => {
    try {
      return await discountApi.create(discountData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create discount"
      );
    }
  }
);

export const updateDiscount = createAsyncThunk(
  "organizer/updateDiscount",
  async ({ discountId, discountData }, { rejectWithValue }) => {
    try {
      return await discountApi.update(discountId, discountData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update discount"
      );
    }
  }
);

export const deleteDiscount = createAsyncThunk(
  "organizer/deleteDiscount",
  async (discountId, { rejectWithValue }) => {
    try {
      return await discountApi.delete(discountId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete discount"
      );
    }
  }
);

export const getEventDiscounts = createAsyncThunk(
  "organizer/getEventDiscounts",
  async (eventId, { rejectWithValue }) => {
    try {
      return await discountApi.getEventDiscounts(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch discounts"
      );
    }
  }
);

export const validateDiscountCode = createAsyncThunk(
  "organizer/validateDiscountCode",
  async (codeData, { rejectWithValue }) => {
    try {
      return await discountApi.validateCode(codeData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid discount code"
      );
    }
  }
);

// ===== SALES THUNKS =====
export const getEventSales = createAsyncThunk(
  "organizer/getEventSales",
  async (eventId, { rejectWithValue }) => {
    try {
      return await salesApi.getEventSales(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales data"
      );
    }
  }
);

export const getSalesByPeriod = createAsyncThunk(
  "organizer/getSalesByPeriod",
  async (periodData, { rejectWithValue }) => {
    try {
      return await salesApi.getSalesByPeriod(periodData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch period sales data"
      );
    }
  }
);

export const getSalesAnalytics = createAsyncThunk(
  "organizer/getSalesAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await salesApi.getSalesAnalytics();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales analytics"
      );
    }
  }
);

// ===== ORGANIZER PROFILE THUNKS =====
export const fetchOrganizerProfile = createAsyncThunk(
  "organizer/fetchOrganizerProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await organizerProfileApi.fetch();
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile data"
      );
    }
  }
);

export const updateOrganizerProfile = createAsyncThunk(
  "organizer/updateOrganizerProfile",
  async (organizerData, { rejectWithValue }) => {
    try {
      return await organizerProfileApi.update(organizerData);
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
      return rejectWithValue(
        error.response?.data?.message ||
          `Update failed: ${error.message} (${error.response?.status})`
      );
    }
  }
);

export const updateOrganizerSettings = createAsyncThunk(
  "organizer/updateOrganizerSettings",
  async (settingsData, { rejectWithValue }) => {
    try {
      return await organizerProfileApi.updateSettings(settingsData);
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
      return rejectWithValue(
        error.response?.data?.message || "Settings update failed"
      );
    }
  }
);

export const getOrganizerDashboard = createAsyncThunk(
  "organizer/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await organizerProfileApi.getDashboard();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

export const updateOrganizerPassword = createAsyncThunk(
  "organizer/updateOrganizerPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      return await organizerProfileApi.updatePassword(passwordData);
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
      return rejectWithValue(
        error.response?.data?.message || "Password update failed"
      );
    }
  }
);
