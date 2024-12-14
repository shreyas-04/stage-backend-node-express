const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app"); // Path to your app.js
const Wishlist = require("../src/models/wishlist.model"); // Wishlist model

describe("Wishlist API", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe("GET /api/wishlist/:userId", () => {
        it("should return a wishlist for a valid user", async () => {
            const userId = "12345";
            await Wishlist.create({
                userId,
                items: [{ name: "Laptop", description: "Gaming laptop" }],
            });

            const response = await request(app).get(`/api/wishlist/${userId}`);
            expect(response.status).toBe(200);
            expect(response.body.userId).toBe(userId);
            expect(response.body.items.length).toBe(1);
            expect(response.body.items[0].name).toBe("Laptop");
        });

        it("should return 404 if the wishlist does not exist", async () => {
            const response = await request(app).get("/api/wishlist/nonexistentUser");
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Wishlist not found");
        });
    });

    describe("POST /api/wishlist", () => {
        it("should add an item to the wishlist", async () => {
            const payload = {
                userId: "67890",
                name: "PlayStation 5",
                description: "Gaming console",
            };

            const response = await request(app).post("/api/wishlist").send(payload);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Item added to wishlist");
            expect(response.body.wishlist.userId).toBe(payload.userId);
            expect(response.body.wishlist.items[0].name).toBe(payload.name);
        });
    });

    describe("DELETE /api/wishlist", () => {
        it("should remove an item from the wishlist", async () => {
            const userId = "99999";
            const wishlist = await Wishlist.create({
                userId,
                items: [
                    { name: "Old Item", description: "To be removed" },
                    { name: "Keep Item", description: "Stay in wishlist" },
                ],
            });

            const payload = { userId, itemName: "Old Item" };

            const response = await request(app).delete("/api/wishlist").send(payload);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Item removed from wishlist");
            expect(response.body.wishlist.items.length).toBe(1);
            expect(response.body.wishlist.items[0].name).toBe("Keep Item");
        });

        it("should return 404 if the wishlist does not exist", async () => {
            const payload = { userId: "nonexistentUser", itemName: "Any Item" };

            const response = await request(app).delete("/api/wishlist").send(payload);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Wishlist not found");
        });
    });
});
