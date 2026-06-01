"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const HirerDocument_1 = require("../entity/HirerDocument");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const docRepository = data_source_1.AppDataSource.getRepository(HirerDocument_1.HirerDocument);
// File helper validation
const hasValidStoredFile = (fileData, fileName) => {
    if (!fileData || !fileName)
        return false;
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
    const lowerName = fileName.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some((ext) => lowerName.endsWith(ext));
    const hasEnoughContent = fileData.length > 100;
    return hasAllowedExtension && hasEnoughContent;
};
// Backend Credibility Score Auto-Calculation Formula (Page 3 / storage.ts)
const calcCredibilityScore = (isBusiness, dlData, dlName, plData, plName, bcData, bcName) => {
    let validDocumentCount = 0;
    const requiredDocumentCount = isBusiness ? 3 : 2;
    const pointsPerDocument = 5 / requiredDocumentCount;
    if (hasValidStoredFile(dlData, dlName)) {
        validDocumentCount += 1;
    }
    if (hasValidStoredFile(plData, plName)) {
        validDocumentCount += 1;
    }
    if (isBusiness && hasValidStoredFile(bcData, bcName)) {
        validDocumentCount += 1;
    }
    const score = validDocumentCount * pointsPerDocument;
    return Math.round(Math.min(score, 5) * 10) / 10;
};
// Retrieve logged-in hirer's verification documents
router.get("/", auth_1.authenticateToken, async (req, res) => {
    if (!req.user || req.user.role !== "hirer") {
        return res.status(403).json({ message: "Only hirers have upload verification documents." });
    }
    try {
        const doc = await docRepository.findOneBy({ hirerId: req.user.id });
        if (!doc) {
            // Return empty structure if not found
            return res.status(200).json({
                hirerId: req.user.id,
                isBusinessApplicant: false,
                credibilityScore: 0.00
            });
        }
        return res.status(200).json(doc);
    }
    catch (error) {
        console.error("Fetch documents error:", error);
        return res.status(500).json({ message: "Server error occurred while fetching verification documents." });
    }
});
// Upload / Update verification documents (and auto-calculate score)
router.post("/", auth_1.authenticateToken, async (req, res) => {
    if (!req.user || req.user.role !== "hirer") {
        return res.status(403).json({ message: "Only hirers can upload verification documents." });
    }
    const { isBusinessApplicant, abn, driverLicenseName, driverLicenseData, publicLiabilityName, publicLiabilityData, businessCertName, businessCertData, } = req.body;
    // Validate ABN if business
    const isBusiness = isBusinessApplicant === true || isBusinessApplicant === "true";
    if (isBusiness && (!abn || abn.replace(/\s/g, "").length !== 11)) {
        return res.status(400).json({ message: "Australian Business Number (ABN) must be exactly 11 digits." });
    }
    try {
        let doc = await docRepository.findOneBy({ hirerId: req.user.id });
        if (!doc) {
            doc = docRepository.create({
                hirerId: req.user.id,
                isBusinessApplicant: isBusiness,
                abn: isBusiness ? abn : undefined,
            });
        }
        else {
            doc.isBusinessApplicant = isBusiness;
            doc.abn = isBusiness ? abn : undefined;
        }
        // Update document payload selectively (avoid wiping out old base64 if not provided in request)
        if (driverLicenseName !== undefined)
            doc.driverLicenseName = driverLicenseName;
        if (driverLicenseData !== undefined)
            doc.driverLicenseData = driverLicenseData;
        if (publicLiabilityName !== undefined)
            doc.publicLiabilityName = publicLiabilityName;
        if (publicLiabilityData !== undefined)
            doc.publicLiabilityData = publicLiabilityData;
        if (businessCertName !== undefined)
            doc.businessCertName = businessCertName;
        if (businessCertData !== undefined)
            doc.businessCertData = businessCertData;
        // Run backend credibility calculation
        doc.credibilityScore = calcCredibilityScore(doc.isBusinessApplicant, doc.driverLicenseData, doc.driverLicenseName, doc.publicLiabilityData, doc.publicLiabilityName, doc.businessCertData, doc.businessCertName);
        await docRepository.save(doc);
        return res.status(200).json({
            message: "Verification documents updated and credibility score recalculated!",
            document: doc,
        });
    }
    catch (error) {
        console.error("Save documents error:", error);
        return res.status(500).json({ message: "Server error occurred while saving verification documents." });
    }
});
exports.default = router;
