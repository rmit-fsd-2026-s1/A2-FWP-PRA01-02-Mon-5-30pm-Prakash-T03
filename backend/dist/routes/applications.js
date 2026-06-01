"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Application_1 = require("../entity/Application");
const Venue_1 = require("../entity/Venue");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const appRepository = data_source_1.AppDataSource.getRepository(Application_1.Application);
const venueRepository = data_source_1.AppDataSource.getRepository(Venue_1.Venue);
// Helper mapping function to match the exact frontend Application interface
const mapToFrontendApp = (app) => {
    return {
        id: app.id,
        hirerId: app.hirerId,
        hirerName: app.hir?.name || "Unknown Hirer",
        hirerEmail: app.hir?.email || "",
        venueId: app.venueId,
        venueName: app.venue?.name || "Unknown Venue",
        venueLocation: app.venue?.location || "",
        eventName: app.eventName,
        guestCount: app.guestCount,
        eventDate: app.eventDate,
        eventTime: app.eventTime,
        durationHours: app.durationHours,
        status: app.status,
        vendorComment: app.vendorComment || "",
        submittedAt: app.submittedAt.toISOString(),
        approvedAt: app.approvedAt ? app.approvedAt.toISOString() : undefined,
    };
};
// Submit a Booking Application (Hirer only)
router.post("/", auth_1.authenticateToken, async (req, res) => {
    if (!req.user || req.user.role !== "hirer") {
        return res.status(403).json({ message: "Only hirers can submit booking applications." });
    }
    const { venueId, eventName, guestCount, eventDate, eventTime, durationHours } = req.body;
    // Validation
    if (!eventName || !eventName.trim()) {
        return res.status(400).json({ message: "Event name is required." });
    }
    const guests = parseInt(guestCount, 10);
    if (isNaN(guests) || guests <= 0) {
        return res.status(400).json({ message: "Guest count must be a positive number." });
    }
    if (!eventDate || new Date(eventDate) < new Date()) {
        return res.status(400).json({ message: "Event date must be in the future." });
    }
    if (!eventTime) {
        return res.status(400).json({ message: "Event time is required." });
    }
    const hours = parseInt(durationHours, 10);
    if (isNaN(hours) || hours <= 0) {
        return res.status(400).json({ message: "Duration must be a positive number." });
    }
    try {
        // Check if venue exists and is not blocked
        const venue = await venueRepository.findOneBy({ id: venueId });
        if (!venue) {
            return res.status(404).json({ message: "Venue not found." });
        }
        if (venue.isBlocked) {
            return res.status(400).json({ message: "This venue is currently unavailable." });
        }
        if (guests > venue.capacity) {
            return res.status(400).json({ message: `Guest count exceeds venue's capacity of ${venue.capacity} guests.` });
        }
        // Create application
        const shortId = Math.random().toString(36).substring(2, 7);
        const appId = `app-${shortId}`;
        const newApp = appRepository.create({
            id: appId,
            hirerId: req.user.id,
            venueId,
            eventName: eventName.trim(),
            guestCount: guests,
            eventDate,
            eventTime,
            durationHours: hours,
            status: "pending",
            vendorComment: "",
        });
        await appRepository.save(newApp);
        // Fetch again to populate relations for mapping
        const savedApp = await appRepository.findOne({
            where: { id: appId },
            relations: ["hir", "venue"],
        });
        if (!savedApp) {
            return res.status(500).json({ message: "Failed to retrieve saved application." });
        }
        return res.status(201).json({
            message: "Application submitted successfully!",
            application: mapToFrontendApp(savedApp),
        });
    }
    catch (error) {
        console.error("Submit application error:", error);
        return res.status(500).json({ message: "Server error occurred during application submission." });
    }
});
// Get Applications List (Hirer sees own, Vendor sees assigned)
router.get("/", auth_1.authenticateToken, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized." });
    }
    try {
        let apps = [];
        if (req.user.role === "hirer") {
            apps = await appRepository.find({
                where: { hirerId: req.user.id },
                relations: ["hir", "venue"],
                order: { submittedAt: "DESC" },
            });
        }
        else if (req.user.role === "vendor") {
            apps = await appRepository.find({
                where: { venue: { vendorId: req.user.id } },
                relations: ["hir", "venue"],
                order: { submittedAt: "DESC" },
            });
        }
        const mappedApps = apps.map(mapToFrontendApp);
        return res.status(200).json(mappedApps);
    }
    catch (error) {
        console.error("Get applications error:", error);
        return res.status(500).json({ message: "Server error occurred while fetching applications." });
    }
});
// Update Application Status (Approve/Reject - Vendor only)
router.put("/:id/status", auth_1.authenticateToken, async (req, res) => {
    if (!req.user || req.user.role !== "vendor") {
        return res.status(403).json({ message: "Only vendors can manage bookings." });
    }
    const { id } = req.params;
    const { status, vendorComment } = req.body;
    if (status !== "approved" && status !== "rejected") {
        return res.status(400).json({ message: "Invalid status value. Must be 'approved' or 'rejected'." });
    }
    try {
        const app = await appRepository.findOne({
            where: { id },
            relations: ["venue", "hir"],
        });
        if (!app) {
            return res.status(404).json({ message: "Application not found." });
        }
        // Verify vendor ownership
        if (app.venue?.vendorId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to manage bookings for this venue." });
        }
        app.status = status;
        app.vendorComment = vendorComment || "";
        if (status === "approved") {
            app.approvedAt = new Date();
        }
        else {
            app.approvedAt = undefined;
        }
        await appRepository.save(app);
        return res.status(200).json({
            message: `Booking application ${status} successfully.`,
            application: mapToFrontendApp(app),
        });
    }
    catch (error) {
        console.error("Update application status error:", error);
        return res.status(500).json({ message: "Server error occurred while updating booking status." });
    }
});
exports.default = router;
