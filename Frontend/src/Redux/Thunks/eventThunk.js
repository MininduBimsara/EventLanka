import { createAsyncThunk } from "@reduxjs/toolkit";
import { eventsApiService } from "../api/eventsApi";

// Async thunk for fetching all events
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await eventsApiService.fetchEvents();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

// Async thunk for fetching all events without permission
export const fetchAllEvents = createAsyncThunk(
  "events/fetchAllEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await eventsApiService.fetchAllEvents();
    } catch (error) {
      console.error("Fetch all events error:", error);
      return rejectWithValue("Failed to fetch events");
    }
  }
);

// Async thunk for creating a new event
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      return await eventsApiService.createEvent(eventData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

// Async thunk for updating an existing event
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      return await eventsApiService.updateEvent(eventId, eventData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event"
      );
    }
  }
);

// Async thunk for deleting an event
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventsApiService.deleteEvent(eventId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  }
);

// Async thunk for fetching event by ID
export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventsApiService.fetchEventById(eventId);
    } catch (error) {
      console.error("API error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch event details"
      );
    }
  }
);
