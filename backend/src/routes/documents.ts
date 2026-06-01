import { Router, Response } from "express";
import { AppDataSource } from "../data-source";
import { HirerDocument } from "../entity/HirerDocument";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();
const docRepository = AppDataSource.getRepository(HirerDocument);

// File helper validation
const hasValidStoredFile = (fileData?: string, fileName?: string): boolean => {
  if (!fileData || !fileName) return false;
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
  const lowerName = fileName.toLowerCase();
  const hasAllowedExtension = allowedExtensions.some((ext) => lowerName.endsWith(ext));
  const hasEnoughContent = fileData.length > 100;
  return hasAllowedExtension && hasEnoughContent;
};

// Backend Credibility Score Auto-Calculation Formula (Page 3 / storage.ts)
const calcCredibilityScore = (
  isBusiness: boolean,
  dlData?: string, dlName?: string,
  plData?: string, plName?: string,
  bcData?: string, bcName?: string
): number => {
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
router.get("/", authenticateToken as any, async (req: AuthRequest, res: Response) => {
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
  } catch (error) {
    console.error("Fetch documents error:", error);
    return res.status(500).json({ message: "Server error occurred while fetching verification documents." });
  }
});

// Retrieve specific hirer's verification documents (Vendors/Admins only)
router.get("/:hirerId", authenticateToken as any, async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role === "hirer") {
    return res.status(403).json({ message: "Forbidden. Restricted to vendors and admins." });
  }

  const { hirerId } = req.params;

  try {
    const doc = await docRepository.findOneBy({ hirerId });
    if (!doc) {
      return res.status(200).json({
        hirerId,
        isBusinessApplicant: false,
        credibilityScore: 0.00
      });
    }

    return res.status(200).json(doc);
  } catch (error) {
    console.error("Fetch hirer documents error:", error);
    return res.status(500).json({ message: "Server error occurred while fetching verification documents." });
  }
});

// Upload / Update verification documents (and auto-calculate score)
router.post("/", authenticateToken as any, async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role !== "hirer") {
    return res.status(403).json({ message: "Only hirers can upload verification documents." });
  }

  const {
    isBusinessApplicant,
    abn,
    driverLicenseName,
    driverLicenseData,
    publicLiabilityName,
    publicLiabilityData,
    businessCertName,
    businessCertData,
  } = req.body;

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
    } else {
      doc.isBusinessApplicant = isBusiness;
      doc.abn = isBusiness ? abn : undefined;
    }

    // Update document payload selectively (avoid wiping out old base64 if not provided in request)
    if (driverLicenseName !== undefined) doc.driverLicenseName = driverLicenseName;
    if (driverLicenseData !== undefined) doc.driverLicenseData = driverLicenseData;
    
    if (publicLiabilityName !== undefined) doc.publicLiabilityName = publicLiabilityName;
    if (publicLiabilityData !== undefined) doc.publicLiabilityData = publicLiabilityData;

    if (businessCertName !== undefined) doc.businessCertName = businessCertName;
    if (businessCertData !== undefined) doc.businessCertData = businessCertData;

    // Run backend credibility calculation
    doc.credibilityScore = calcCredibilityScore(
      doc.isBusinessApplicant,
      doc.driverLicenseData, doc.driverLicenseName,
      doc.publicLiabilityData, doc.publicLiabilityName,
      doc.businessCertData, doc.businessCertName
    );

    await docRepository.save(doc);

    return res.status(200).json({
      message: "Verification documents updated and credibility score recalculated!",
      document: doc,
    });
  } catch (error) {
    console.error("Save documents error:", error);
    return res.status(500).json({ message: "Server error occurred while saving verification documents." });
  }
});

export default router;
