import request from "supertest";
import app from "../app.js";

describe("Health Check Tests", () => {
    test("GET /api/start should return status 200 and success true", async () => {
        const response = await request(app).get("/api/start");
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("message", "Server Started");
    });
});
