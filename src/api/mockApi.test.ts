import { describe, it, expect, beforeEach } from "vitest";
import { initMockApi } from "./mockApi";
import { resetData } from "./storage";
import type { Incident, User } from "./types";

// Initialize mock API before all tests
initMockApi();

describe("Mock API", () => {
  beforeEach(() => {
    resetData();
  });

  describe("GET /api/incidents", () => {
    it("returns a list of incidents", async () => {
      const response = await fetch("/api/incidents");
      const incidents: Incident[] = await response.json();

      expect(response.status).toBe(200);
      expect(incidents.length).toBeGreaterThan(0);
      expect(incidents[0]).toHaveProperty("id");
      expect(incidents[0]).toHaveProperty("title");
      expect(incidents[0]).toHaveProperty("status");
    });
  });

  describe("GET /api/incidents/:id", () => {
    it("returns a single incident", async () => {
      const response = await fetch("/api/incidents/inc-1");
      const incident: Incident = await response.json();

      expect(response.status).toBe(200);
      expect(incident.id).toBe("inc-1");
    });

    it("returns 404 for non-existent incident", async () => {
      const response = await fetch("/api/incidents/non-existent");
      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/incidents", () => {
    it("creates a new incident", async () => {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test Incident",
          description: "Test description",
          severity: "Medium",
          assigneeId: "user-1",
        }),
      });
      const created: Incident = await response.json();

      expect(response.status).toBe(201);
      expect(created.id).toBeDefined();
      expect(created.title).toBe("Test Incident");
      expect(created.status).toBe("Open");
    });

    it("returns 400 when title is missing", async () => {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ severity: "Low" }),
      });

      expect(response.status).toBe(400);
    });

    it("returns 400 when severity is missing", async () => {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test" }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /api/incidents/:id", () => {
    it("updates an incident", async () => {
      const response = await fetch("/api/incidents/inc-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "In Progress", assigneeId: "user-2" }),
      });
      const updated: Incident = await response.json();

      expect(response.status).toBe(200);
      expect(updated.status).toBe("In Progress");
      expect(updated.assigneeId).toBe("user-2");
    });

    it("returns 404 for non-existent incident", async () => {
      const response = await fetch("/api/incidents/non-existent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" }),
      });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/incidents/:id", () => {
    it("deletes a dummy incident", async () => {
      // First create a dummy incident
      const createResponse = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Dummy Test Incident",
          description: "Test description",
          severity: "Medium",
          assigneeId: null,
          isDummy: true,
        }),
      });
      const created: Incident = await createResponse.json();
      expect(createResponse.status).toBe(201);

      // Now delete the dummy incident
      const response = await fetch(`/api/incidents/${created.id}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(204);

      // Verify it's gone
      const getResponse = await fetch(`/api/incidents/${created.id}`);
      expect(getResponse.status).toBe(404);
    });

    it("returns 403 when trying to delete a non-dummy incident", async () => {
      const response = await fetch("/api/incidents/inc-1", {
        method: "DELETE",
      });

      expect(response.status).toBe(403);
    });

    it("returns 404 for non-existent incident", async () => {
      const response = await fetch("/api/incidents/non-existent", {
        method: "DELETE",
      });

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/users", () => {
    it("returns a list of users", async () => {
      const response = await fetch("/api/users");
      const users: User[] = await response.json();

      expect(response.status).toBe(200);
      expect(users.length).toBeGreaterThan(0);
      expect(users[0]).toHaveProperty("id");
      expect(users[0]).toHaveProperty("name");
    });
  });

  describe("POST /api/reset", () => {
    it("resets data to defaults", async () => {
      // Create a dummy incident
      const createResponse = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Dummy Incident to Delete",
          description: "Test",
          severity: "Low",
          assigneeId: null,
          isDummy: true,
        }),
      });
      const created: Incident = await createResponse.json();

      // Delete the dummy incident
      await fetch(`/api/incidents/${created.id}`, { method: "DELETE" });

      // Verify dummy incident is gone
      const getDeletedResponse = await fetch(`/api/incidents/${created.id}`);
      expect(getDeletedResponse.status).toBe(404);

      // Reset
      const response = await fetch("/api/reset", { method: "POST" });
      expect(response.status).toBe(200);

      // Verify original incidents are still there
      const getResponse = await fetch("/api/incidents/inc-1");
      expect(getResponse.status).toBe(200);
    });
  });

  describe("Error handling", () => {
    it("returns 404 for unknown routes", async () => {
      const response = await fetch("/api/unknown-endpoint");
      expect(response.status).toBe(404);
    });
  });
});
