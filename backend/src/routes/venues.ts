import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entity/Venue";

const router = Router();
const venueRepository = AppDataSource.getRepository(Venue);

// Get All Venues (with optional query filters)
router.get("/", async (req, res) => {
  const { search, location, capacity, suitability } = req.query;

  try {
    const queryBuilder = venueRepository.createQueryBuilder("venue");

    // General search filter
    if (search) {
      const searchPattern = `%${String(search).toLowerCase()}%`;
      queryBuilder.andWhere(
        "(LOWER(venue.name) LIKE :search OR LOWER(venue.location) LIKE :search OR LOWER(venue.description) LIKE :search)",
        { search: searchPattern }
      );
    }

    // Specific location filter
    if (location) {
      queryBuilder.andWhere("LOWER(venue.location) LIKE :location", {
        location: `%${String(location).toLowerCase()}%`,
      });
    }

    // Minimum capacity filter
    if (capacity) {
      const minCap = parseInt(String(capacity), 10);
      if (!isNaN(minCap)) {
        queryBuilder.andWhere("venue.capacity >= :minCap", { minCap });
      }
    }

    const venues = await queryBuilder.getMany();

    // Suitability filter (filtering JSON array in JS to be safe across different SQL databases)
    let filteredVenues = venues;
    if (suitability) {
      const suitStr = String(suitability).toLowerCase();
      filteredVenues = venues.filter((v) =>
        v.suitability.some((s) => s.toLowerCase() === suitStr)
      );
    }

    return res.status(200).json(filteredVenues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    return res.status(500).json({ message: "Server error occurred while fetching venues." });
  }
});

// Get Single Venue
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const venue = await venueRepository.findOneBy({ id });
    if (!venue) {
      return res.status(404).json({ message: "Venue not found." });
    }

    return res.status(200).json(venue);
  } catch (error) {
    console.error("Error fetching single venue:", error);
    return res.status(500).json({ message: "Server error fetching venue details." });
  }
});

export default router;
