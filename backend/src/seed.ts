import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Venue } from "./entity/Venue";
import { Application } from "./entity/Application";
import { HireHistory } from "./entity/HireHistory";
import { HirerDocument } from "./entity/HirerDocument";
import { VendorComment } from "./entity/VendorComment";
import * as bcrypt from "bcryptjs";
import { createDatabaseIfNotExists } from "./create-db";

async function seed() {
  console.log("Checking/creating database...");
  await createDatabaseIfNotExists();
  console.log("Initializing database connection...");
  await AppDataSource.initialize();
  console.log("Database connected successfully. Wiping existing data...");

  // Wipe data in reverse dependency order to prevent foreign key errors
  // await AppDataSource.getRepository(VendorComment).clear();
  // await AppDataSource.getRepository(HireHistory).clear();
  // await AppDataSource.getRepository(Application).clear();
  // await AppDataSource.getRepository(HirerDocument).clear();
  // await AppDataSource.getRepository(Venue).clear();
  // await AppDataSource.getRepository(User).clear();

  console.log("Data wiped. Starting seeding process...");

  // 1. Create Users
  const hashedPassword = bcrypt.hashSync("Password1!", 10);

  const usersData = [
    {
      id: "vendor-001",
      email: "vendor@vv.com",
      password: hashedPassword,
      role: "vendor" as const,
      name: "Anand Prabu",
      phone: "0488123401",
      createdAt: new Date("2024-04-03T07:45:00Z"),
    },
    {
      id: "vendor-002",
      email: "soosai@vv.com",
      password: hashedPassword,
      role: "vendor" as const,
      name: "Soosai Rajan",
      phone: "0488123402",
      createdAt: new Date("2024-04-09T06:25:00Z"),
    },
    {
      id: "hirer-001",
      email: "hirer@vv.com",
      password: hashedPassword,
      role: "hirer" as const,
      name: "Lenin Arul",
      phone: "0488123403",
      createdAt: new Date("2024-05-14T12:10:00Z"),
    },
    {
      id: "hirer-002",
      email: "isewarya@vv.com",
      password: hashedPassword,
      role: "hirer" as const,
      name: "Isewarya Sridar",
      phone: "0488123404",
      createdAt: new Date("2024-05-22T09:35:00Z"),
    },
    {
      id: "hirer-003",
      email: "david@vv.com",
      password: hashedPassword,
      role: "hirer" as const,
      name: "David Laid",
      phone: "0488123405",
      createdAt: new Date("2024-06-02T15:50:00Z"),
    },
    {
      id: "admin-001",
      email: "admin@vv.com",
      password: hashedPassword,
      role: "admin" as const,
      name: "Administrator",
      phone: "0488123499",
      createdAt: new Date("2024-01-01T00:00:00Z"),
    }
  ];

  const userEntities: User[] = [];
  const userRepository = AppDataSource.getRepository(User);
  for (const data of usersData) {
    const user = userRepository.create(data);
    userEntities.push(await userRepository.save(user));
  }
  console.log(`Seeded ${userEntities.length} users successfully.`);

  // 2. Create Venues
  const venuesData = [
    {
      id: "venue-001",
      vendorId: "vendor-001",
      name: "Aurora Central Ballroom",
      location: "26 Queen Street, Melbourne VIC 3000",
      capacity: 460,
      suitability: ["Formal Dinners", "Weddings", "Award Nights"],
      description: "A polished inner-city ballroom with premium lighting, flexible table layouts, and a formal stage area for speeches and presentations.",
      imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop",
      pricePerHour: 790,
      isBlocked: false,
      isFeatured: true,
    },
    {
      id: "venue-002",
      vendorId: "vendor-001",
      name: "Riverlight Terrace Hall",
      location: "84 Riverside Quay, Southbank VIC 3006",
      capacity: 170,
      suitability: ["Networking Nights", "Cocktail Events", "Private Parties"],
      description: "A bright terrace-style venue overlooking the river, suitable for relaxed evening events, networking sessions, and medium-sized celebrations.",
      imageUrl: "https://plus.unsplash.com/premium_photo-1675970835634-12d69090e7d5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      pricePerHour: 485,
      isBlocked: false,
      isFeatured: false,
    },
    {
      id: "venue-003",
      vendorId: "vendor-001",
      name: "Fitzroy Assembly Rooms",
      location: "39 Gertrude Street, Fitzroy VIC 3065",
      capacity: 280,
      suitability: ["Workshops", "Launch Events", "Community Forums"],
      description: "A character-filled event space with open floor planning, presentation equipment, and a warm heritage interior for professional gatherings.",
      imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop",
      pricePerHour: 640,
      isBlocked: false,
      isFeatured: false,
    },
    {
      id: "venue-004",
      vendorId: "vendor-001",
      name: "Harbourview Function Pavilion",
      location: "18 NewQuay Promenade, Docklands VIC 3008",
      capacity: 360,
      suitability: ["Business Conferences", "Formal Galas", "Seminars"],
      description: "A modern waterfront venue with wide seating arrangements, built-in AV support, and a clean corporate event atmosphere.",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop",
      pricePerHour: 735,
      isBlocked: false,
      isFeatured: false,
    },
    {
      id: "venue-005",
      vendorId: "vendor-002",
      name: "Northside Studio Loft",
      location: "44 Sydney Road, Brunswick VIC 3056",
      capacity: 120,
      suitability: ["Fitness Events", "Creative Meetups", "Birthday Events"],
      description: "A compact loft venue with an industrial feel, suitable for casual celebrations, brand meetups, and creative community events.",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop",
      pricePerHour: 335,
      isBlocked: false,
      isFeatured: true,
    },
    {
      id: "venue-006",
      vendorId: "vendor-002",
      name: "South Wharf Convention Hall",
      location: "9 Munro Street, South Wharf VIC 3006",
      capacity: 760,
      suitability: ["Trade Shows", "Career Expos", "Large Conferences"],
      description: "A spacious conference hall designed for large groups, exhibitor booths, and formal event schedules with high attendee volume.",
      imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop",
      pricePerHour: 1125,
      isBlocked: false,
      isFeatured: false,
    },
    {
      id: "venue-007",
      vendorId: "vendor-002",
      name: "Orchid Garden Estate",
      location: "21 Albany Road, Toorak VIC 3142",
      capacity: 220,
      suitability: ["Outdoor Weddings", "Garden Receptions", "Family Celebrations"],
      description: "An elegant garden estate with landscaped outdoor areas, a sheltered dining space, and a calm private-event atmosphere.",
      imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop",
      pricePerHour: 910,
      isBlocked: false,
      isFeatured: false,
    },
    {
      id: "venue-008",
      vendorId: "vendor-002",
      name: "Collingwood Creative Warehouse",
      location: "113 Wellington Street, Collingwood VIC 3066",
      capacity: 240,
      suitability: ["Media Launches", "Music Showcases", "Art Events"],
      description: "A raw warehouse-style venue with generous open space, strong lighting options, and a flexible layout for creative productions.",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
      pricePerHour: 545,
      isBlocked: false,
      isFeatured: false,
    },
  ];

  const venueEntities: Venue[] = [];
  const venueRepository = AppDataSource.getRepository(Venue);
  for (const data of venuesData) {
    const venue = venueRepository.create(data);
    venueEntities.push(await venueRepository.save(venue));
  }
  console.log(`Seeded ${venueEntities.length} venues successfully.`);

  // 3. Create Hire History
  const historyData = [
    {
      id: "hist-001",
      hirerId: "hirer-001",
      vendorId: "vendor-001",
      venueId: "venue-001",
      eventName: "Student Leadership Dinner",
      dateOfHire: "2024-09-12",
      rating: 4,
    },
    {
      id: "hist-002",
      hirerId: "hirer-001",
      vendorId: "vendor-001",
      venueId: "venue-003",
      eventName: "Technology Ideas Forum",
      dateOfHire: "2024-10-26",
      rating: 5,
    },
    {
      id: "hist-003",
      hirerId: "hirer-002",
      vendorId: "vendor-001",
      venueId: "venue-002",
      eventName: "Community Welcome Evening",
      dateOfHire: "2024-11-08",
      rating: 3,
    },
    {
      id: "hist-004",
      hirerId: "hirer-003",
      vendorId: "vendor-002",
      venueId: "venue-005",
      eventName: "Strength Training Meetup",
      dateOfHire: "2024-12-04",
      rating: 4,
    },
    {
      id: "hist-005",
      hirerId: "hirer-003",
      vendorId: "vendor-002",
      venueId: "venue-008",
      eventName: "Sports Media Preview",
      dateOfHire: "2025-01-19",
      rating: 5,
    },
    {
      id: "hist-006",
      hirerId: "hirer-002",
      vendorId: "vendor-002",
      venueId: "venue-007",
      eventName: "Graduation Family Reception",
      dateOfHire: "2025-02-07",
      rating: 5,
    },
  ];

  const historyRepository = AppDataSource.getRepository(HireHistory);
  for (const data of historyData) {
    const hist = historyRepository.create(data);
    await historyRepository.save(hist);
  }
  console.log(`Seeded ${historyData.length} hire history records.`);

  // 4. Create Applications
  const applicationsData = [
    {
      id: "app-001",
      hirerId: "hirer-001",
      venueId: "venue-004",
      eventName: "Digital Careers Evening",
      guestCount: 185,
      eventDate: "2026-03-14",
      eventTime: "18:30",
      durationHours: 4,
      status: "pending" as const,
      vendorComment: "",
      submittedAt: new Date("2026-01-18T08:20:00Z"),
    },
    {
      id: "app-002",
      hirerId: "hirer-002",
      venueId: "venue-001",
      eventName: "Multicultural Dinner Night",
      guestCount: 260,
      eventDate: "2026-04-25",
      eventTime: "17:45",
      durationHours: 5,
      status: "pending" as const,
      vendorComment: "",
      submittedAt: new Date("2026-01-23T13:55:00Z"),
    },
    {
      id: "app-003",
      hirerId: "hirer-003",
      venueId: "venue-005",
      eventName: "Health and Fitness Social",
      guestCount: 90,
      eventDate: "2026-02-28",
      eventTime: "19:15",
      durationHours: 3,
      status: "approved" as const,
      vendorComment: "Approved. Please send the final floor setup and equipment list at least ten days before the event.",
      submittedAt: new Date("2026-01-12T10:30:00Z"),
      approvedAt: new Date("2026-01-16T16:40:00Z"),
    },
  ];

  const appRepository = AppDataSource.getRepository(Application);
  for (const data of applicationsData) {
    const app = appRepository.create(data);
    await appRepository.save(app);
  }
  console.log(`Seeded ${applicationsData.length} applications.`);

  // 5. Create Vendor Comments
  const commentsData = [
    {
      id: "comment-001",
      vendorId: "vendor-001",
      hirerId: "hirer-001",
      applicationId: "app-001",
      comment: "Lenin has completed previous bookings responsibly, with clear communication and no venue issues recorded.",
      createdAt: new Date("2026-01-19T09:15:00Z"),
    },
  ];

  const commentRepository = AppDataSource.getRepository(VendorComment);
  for (const data of commentsData) {
    const comment = commentRepository.create(data);
    await commentRepository.save(comment);
  }
  console.log(`Seeded ${commentsData.length} vendor comments.`);

  // 6. Create Hirer Documents
  const validImageData = "data:image/jpeg;base64," + "A".repeat(150);
  const validPdfData = "data:application/pdf;base64," + "A".repeat(150);

  const docsData = [
    {
      hirerId: "hirer-001",
      isBusinessApplicant: true,
      abn: "53918472630",
      driverLicenseName: "lenin_photo_id.jpeg",
      driverLicenseData: validImageData,
      publicLiabilityName: "lenin_event_cover.pdf",
      publicLiabilityData: validPdfData,
      businessCertName: "lenin_business_record.pdf",
      businessCertData: validPdfData,
      credibilityScore: 5.0,
    },
    {
      hirerId: "hirer-003",
      isBusinessApplicant: false,
      driverLicenseName: "david_identity_check.jpeg",
      driverLicenseData: validImageData,
      publicLiabilityName: "david_public_event_cover.pdf",
      publicLiabilityData: validPdfData,
      credibilityScore: 5.0,
    },
  ];

  const docRepository = AppDataSource.getRepository(HirerDocument);
  for (const data of docsData) {
    const doc = docRepository.create(data);
    await docRepository.save(doc);
  }
  console.log(`Seeded ${docsData.length} hirer document sets.`);

  console.log("Database seeded successfully!");
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("Error seeding the database:", err);
  process.exit(1);
});
