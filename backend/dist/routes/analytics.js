"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Application_1 = require("../entity/Application");
const User_1 = require("../entity/User");
const HireHistory_1 = require("../entity/HireHistory");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const appRepository = data_source_1.AppDataSource.getRepository(Application_1.Application);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const historyRepository = data_source_1.AppDataSource.getRepository(HireHistory_1.HireHistory);
// Get Vendor Analytics Stats
router.get("/vendor", auth_1.authenticateToken, async (req, res) => {
    if (!req.user || req.user.role !== "vendor") {
        return res.status(403).json({ message: "Only vendors can view selection analytics." });
    }
    try {
        // 1. Get all approved applications for venues managed by this vendor
        const approvedApps = await appRepository.find({
            where: {
                status: "approved",
                venue: { vendorId: req.user.id }
            },
            relations: ["hir", "venue"]
        });
        // 2. Get all users who are hirers
        const hirers = await userRepository.find({
            where: { role: "hirer" }
        });
        // 3. Aggregate approval count per hirer
        const applicantMap = {};
        hirers.forEach((user) => {
            applicantMap[user.id] = {
                name: user.name,
                selected: 0,
            };
        });
        approvedApps.forEach((app) => {
            if (applicantMap[app.hirerId]) {
                applicantMap[app.hirerId].selected += 1;
            }
        });
        const analyticsData = Object.values(applicantMap).sort((a, b) => b.selected - a.selected);
        const mostSelectedApplicants = analyticsData
            .filter((item) => item.selected > 0)
            .slice(0, 3);
        const leastSelectedApplicants = [...analyticsData]
            .filter((item) => item.selected > 0)
            .sort((a, b) => a.selected - b.selected)
            .slice(0, 3);
        const neverSelectedApplicants = analyticsData.filter((item) => item.selected === 0);
        const chartColours = ["#1E3A8A", "#0EA5E9", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
        const pieChartData = [
            ...analyticsData
                .filter((item) => item.selected > 0)
                .map((item) => ({
                name: item.name,
                value: item.selected,
            })),
            ...(neverSelectedApplicants.length > 0
                ? [
                    {
                        name: `Never Selected (${neverSelectedApplicants.length})`,
                        value: 0.1,
                    },
                ]
                : []),
        ];
        return res.status(200).json({
            analyticsData,
            mostSelectedApplicants,
            leastSelectedApplicants,
            neverSelectedApplicants,
            chartColours,
            pieChartData
        });
    }
    catch (error) {
        console.error("Vendor analytics calculation error:", error);
        return res.status(500).json({ message: "Server error occurred calculating analytics stats." });
    }
});
// Get Hirer Reputation and Hire History Stats (Page 3 / Hire History)
router.get("/history/:hirerId", auth_1.authenticateToken, async (req, res) => {
    const { hirerId } = req.params;
    try {
        const history = await historyRepository.find({
            where: { hirerId },
            relations: ["venue", "vendor"]
        });
        // Calculate dynamic reputation score
        let reputation = 0;
        if (history.length > 0) {
            const avg = history.reduce((sum, h) => sum + h.rating, 0) / history.length;
            reputation = Math.round(avg * 10) / 10;
        }
        // Map history to match the frontend shape if needed
        const mappedHistory = history.map((h) => ({
            id: h.id,
            hirerId: h.hirerId,
            hirerName: h.hirer?.name || "",
            vendorId: h.vendorId,
            venueId: h.venueId,
            venueName: h.venue?.name || "Unknown Venue",
            venueLocation: h.venue?.location || "",
            eventName: h.eventName,
            dateOfHire: h.dateOfHire,
            rating: h.rating
        }));
        return res.status(200).json({
            history: mappedHistory,
            reputation,
            historyCount: history.length
        });
    }
    catch (error) {
        console.error("Error retrieving hire history:", error);
        return res.status(500).json({ message: "Server error retrieving hire history." });
    }
});
exports.default = router;
