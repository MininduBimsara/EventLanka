import { createAsyncThunk } from "@reduxjs/toolkit";
import TicketAPI from "../api/ticketApi";

// Async thunk for buying a ticket
export const buyTicket = createAsyncThunk(
  "tickets/buyTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.buyTicket(ticketData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to buy ticket"
      );
    }
  }
);

// Async thunk for fetching all tickets of the logged-in user
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.fetchTickets();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tickets"
      );
    }
  }
);

// Async thunk for fetching a specific ticket by ID
export const fetchTicketById = createAsyncThunk(
  "tickets/fetchTicketById",
  async (ticketId, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.fetchTicketById(ticketId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ticket details"
      );
    }
  }
);

// Async thunk for canceling/deleting a ticket
export const cancelTicket = createAsyncThunk(
  "tickets/cancelTicket",
  async (ticketId, { rejectWithValue }) => {
    try {
      const ticketId_returned = await TicketAPI.cancelTicket(ticketId);
      return ticketId_returned;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel ticket"
      );
    }
  }
);

// Async thunk for generating QR code for a ticket
export const generateTicketQRCode = createAsyncThunk(
  "tickets/generateQRCode",
  async (ticketId, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.generateTicketQRCode(ticketId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate QR code"
      );
    }
  }
);

// Async thunk for downloading ticket as PDF
export const downloadTicketPDF = createAsyncThunk(
  "tickets/downloadPDF",
  async (ticketId, { rejectWithValue }) => {
    try {
      const result = await TicketAPI.downloadTicketPDF(ticketId);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download ticket"
      );
    }
  }
);

// Async thunk for updating a ticket
export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async ({ ticketId, updateData }, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.updateTicket(ticketId, updateData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update ticket"
      );
    }
  }
);

// Async thunk for getting ticket statistics
export const getTicketStats = createAsyncThunk(
  "tickets/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.getTicketStats();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ticket statistics"
      );
    }
  }
);

// Async thunk for validating a ticket
export const validateTicket = createAsyncThunk(
  "tickets/validateTicket",
  async (ticketId, { rejectWithValue }) => {
    try {
      const data = await TicketAPI.validateTicket(ticketId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to validate ticket"
      );
    }
  }
);
