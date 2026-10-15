/**
 * Development seed data.
 *
 * Clearly marked as development-only: every account uses an obvious password
 * and no production credential appears here. Run with:
 *
 *   npm run db:seed --workspace @chereta/api
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { hash } from "@node-rs/argon2";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
  log: ["warn", "error"],
});

/** Ethiopian regions, used for the configurable location lists. */
const REGIONS = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "South Ethiopia",
  "South West Ethiopia",
  "Tigray",
];

/** Tender categories with an Ethiopian procurement flavour. */
const CATEGORIES = [
  { code: "CIVIL", name: "Civil Works & Construction", sortOrder: 1 },
  { code: "ELECTRICAL", name: "Electrical & Mechanical Works", sortOrder: 2 },
  { code: "IT", name: "ICT Equipment & Services", sortOrder: 3 },
  { code: "MEDICAL", name: "Medical Equipment & Supplies", sortOrder: 4 },
  { code: "AGRI", name: "Agriculture & Agro-processing", sortOrder: 5 },
  { code: "TRANSPORT", name: "Vehicles & Transport", sortOrder: 6 },
  { code: "FURNITURE", name: "Office Furniture & Supplies", sortOrder: 7 },
  { code: "CONSULTING", name: "Consulting & Professional Services", sortOrder: 8 },
  { code: "CLEANING", name: "Facility Management & Cleaning", sortOrder: 9 },
  { code: "SECURITY", name: "Security Services", sortOrder: 10 },
];

async function main(): Promise<void> {
  console.log("Seeding development data...");

  // --- Categories ------------------------------------------------------------
  const categoryIds = new Map<string, string>();
  for (const category of CATEGORIES) {
    const row = await prisma.tenderCategory.upsert({
      where: { code: category.code },
      update: { name: category.name, sortOrder: category.sortOrder, isActive: true },
      create: {
        code: category.code,
        name: category.name,
        description: `Tenders for ${category.name.toLowerCase()}.`,
        sortOrder: category.sortOrder,
      },
      select: { id: true, code: true },
    });
    categoryIds.set(row.code, row.id);
  }
  console.log(`  categories: ${categoryIds.size}`);

  // --- Accounts --------------------------------------------------------------
  // DEV ONLY: these passwords are intentionally obvious and must never be used
  // outside a local development database.
  const devPassword = "DevOnly!Password1";

  const accounts = [
    {
      email: "supplier@chereta.dev",
      firstName: "Almaz",
      lastName: "Tadesse",
      role: "SUPPLIER" as const,
      phone: "+251911000001",
    },
    {
      email: "publisher@chereta.dev",
      firstName: "Dawit",
      lastName: "Bekele",
      role: "SUPPLIER" as const,
      phone: "+251911000002",
    },
    {
      email: "evaluator@chereta.dev",
      firstName: "Hanna",
      lastName: "Girma",
      role: "SUPPLIER" as const,
      phone: "+251911000003",
    },
    {
      email: "admin@chereta.dev",
      firstName: "Yonas",
      lastName: "Alemu",
      role: "ADMIN" as const,
      phone: "+251911000004",
    },
  ];

  const passwordHash = await hash(devPassword, {
    memoryCost: 19 * 1024,
    timeCost: 2,
    parallelism: 1,
  });

  const users = new Map<string, { id: string }>();
  for (const account of accounts) {
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        firstName: account.firstName,
        lastName: account.lastName,
        role: account.role,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        status: "ACTIVE",
      },
      create: {
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        role: account.role,
        phone: account.phone,
        passwordHash,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        preferredLanguage: "en",
        preferredTimezone: "Africa/Addis_Ababa",
      },
      select: { id: true },
    });
    users.set(account.email, user);
  }
  console.log(`  users: ${users.size}`);

  // --- Organizations ---------------------------------------------------------
  const organizations = [
    {
      email: "publisher@chereta.dev",
      registeredName: "Addis Ababa City Roads Authority",
      organizationType: "GOVERNMENT_AGENCY" as const,
      region: "Addis Ababa",
      city: "Addis Ababa",
      verificationStatus: "VERIFIED" as const,
      businessRegistrationNumber: "GOV/AA/ROADS/001",
    },
    {
      email: "supplier@chereta.dev",
      registeredName: "Tadesse Construction PLC",
      organizationType: "PRIVATE_LIMITED_COMPANY" as const,
      region: "Addis Ababa",
      city: "Addis Ababa",
      verificationStatus: "VERIFIED" as const,
      businessRegistrationNumber: "BR/AA/2019/4455",
    },
    {
      email: "evaluator@chereta.dev",
      registeredName: "Ethiopian Procurement Consultants PLC",
      organizationType: "PRIVATE_LIMITED_COMPANY" as const,
      region: "Addis Ababa",
      city: "Addis Ababa",
      verificationStatus: "PENDING" as const,
      businessRegistrationNumber: "BR/AA/2021/8899",
    },
  ];

  const orgIds = new Map<string, string>();
  for (const org of organizations) {
    const ownerId = users.get(org.email)!.id;
    const existing = await prisma.organization.findFirst({
      where: { registeredName: org.registeredName },
      select: { id: true },
    });

    const organizationId =
      existing?.id ??
      (
        await prisma.organization.create({
          data: {
            registeredName: org.registeredName,
            organizationType: org.organizationType,
            description: `Development seed organization for ${org.registeredName}.`,
            email: `info@${org.registeredName.toLowerCase().replace(/[^a-z0-9]+/g, "")}.et`,
            phone: "+251111223344",
            region: org.region,
            city: org.city,
            countryCode: "ET",
            businessRegistrationNumber: org.businessRegistrationNumber,
            verificationStatus: org.verificationStatus,
            verifiedAt:
              org.verificationStatus === "VERIFIED" ? new Date() : null,
          },
          select: { id: true },
        })
      ).id;

    // OWNER membership, idempotent.
    await prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId, userId: ownerId } },
      update: { status: "ACTIVE", role: "OWNER" },
      create: { organizationId, userId: ownerId, role: "OWNER", status: "ACTIVE" },
    });

    orgIds.set(org.registeredName, organizationId);
  }
  console.log(`  organizations: ${orgIds.size}`);

  // --- Sample tenders --------------------------------------------------------
  const procuringOrgId = orgIds.get("Addis Ababa City Roads Authority")!;
  const publisherId = users.get("publisher@chereta.dev")!.id;

  const tenderSpecs = [
    {
      title: "Construction of Addis Ababa Ring Road Phase 3",
      categoryCode: "CIVIL",
      status: "OPEN_FOR_SUBMISSION" as const,
      description:
        "Construction of a 12 km ring road segment including drainage works, street lighting and associated civil infrastructure.",
      scopeOfWork:
        "Earthworks, sub-base and base course, asphalt surfacing, storm-water drainage, street lighting installation, road signage and markings.",
      estimatedBudget: "450000000.00",
      city: "Addis Ababa",
      region: "Addis Ababa",
      daysUntilDeadline: 45,
    },
    {
      title: "Supply and Installation of Hospital ICT Infrastructure",
      categoryCode: "IT",
      status: "OPEN_FOR_SUBMISSION" as const,
      description:
        "Supply, installation and commissioning of network, server and security infrastructure for a 300-bed referral hospital.",
      scopeOfWork:
        "Structured cabling, core and access switching, server virtualization, backup infrastructure, perimeter security and staff training.",
      estimatedBudget: "78000000.00",
      city: "Addis Ababa",
      region: "Addis Ababa",
      daysUntilDeadline: 21,
    },
    {
      title: "Provision of Ambulance Services for Regional Health Bureau",
      categoryCode: "TRANSPORT",
      status: "PUBLISHED" as const,
      description:
        "Provision of 24/7 ambulance services including vehicles, crews, fuel and maintenance for a twelve-month contract.",
      scopeOfWork:
        "Vehicle provision, paramedic staffing, dispatch coordination, preventive maintenance and fuel management.",
      estimatedBudget: "32000000.00",
      city: "Bahir Dar",
      region: "Amhara",
      daysUntilDeadline: 60,
    },
    {
      title: "Consultancy Services for Feasibility Study of Industrial Park",
      categoryCode: "CONSULTING",
      status: "OPEN_FOR_SUBMISSION" as const,
      description:
        "Feasibility study and master planning consultancy for a new agro-industrial park.",
      scopeOfWork:
        "Market analysis, site assessment, technical design review, financial modelling and an implementation roadmap.",
      estimatedBudget: "12500000.00",
      city: "Hawassa",
      region: "Sidama",
      daysUntilDeadline: 5,
    },
    {
      title: "Supply of Medical Equipment for Rural Health Centres",
      categoryCode: "MEDICAL",
      status: "SUBMISSION_CLOSED" as const,
      description:
        "Supply, delivery and installation of diagnostic equipment for 40 rural health centres.",
      scopeOfWork:
        "Ultrasound units, laboratory analysers, cold-chain equipment, installation, calibration and operator training.",
      estimatedBudget: "56000000.00",
      city: "Mekelle",
      region: "Tigray",
      daysUntilDeadline: -10,
    },
  ];

  let tenderCount = 0;
  for (const spec of tenderSpecs) {
    const slug = `${spec.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 70)}-${Math.random().toString(36).slice(2, 8)}`;

    const existing = await prisma.tender.findFirst({
      where: { title: spec.title },
      select: { id: true },
    });
    if (existing) continue;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + spec.daysUntilDeadline);
    deadline.setHours(17, 0, 0, 0);

    const year = new Date().getFullYear();
    const sequence = tenderCount + 1;

    const tender = await prisma.tender.create({
      data: {
        referenceNumber: `CHR-${year}-${String(sequence).padStart(6, "0")}`,
        title: spec.title,
        slug,
        description: spec.description,
        scopeOfWork: spec.scopeOfWork,
        organizationId: procuringOrgId,
        createdById: publisherId,
        categoryId: categoryIds.get(spec.categoryCode)!,
        procurementMethod: "OPEN_TENDER",
        tenderType:
          spec.categoryCode === "CONSULTING"
            ? "CONSULTING_SERVICES"
            : spec.categoryCode === "CIVIL" || spec.categoryCode === "ELECTRICAL"
              ? "CONSTRUCTION_WORKS"
              : spec.categoryCode === "MEDICAL" || spec.categoryCode === "AGRI"
                ? "GOODS"
                : "GENERAL_SERVICES",
        status: spec.status,
        estimatedBudget: spec.estimatedBudget,
        currency: "ETB",
        budgetVisibility: "PUBLIC",
        eligibilitySummary:
          "Bidders must be registered in Ethiopia, hold a valid trade licence, and demonstrate comparable completed works.",
        locationDescription: `${spec.city}, ${spec.region}`,
        region: spec.region,
        city: spec.city,
        // Every seeded tender is created already in a published state, so it is
        // published immediately.
        publishedAt: new Date(),
        submissionDeadline: deadline,
        clarificationDeadline: new Date(deadline.getTime() - 7 * 86_400_000),
        evaluationStartAt: new Date(deadline.getTime() + 1 * 86_400_000),
        expectedAwardDate: new Date(deadline.getTime() + 21 * 86_400_000),
        contactName: "Procurement Office",
        contactEmail: "procurement@chereta.dev",
        contactPhone: "+251111223355",
        clarificationInstructions:
          "Submit questions through the clarification panel at least seven days before the submission deadline.",
        weightedScoringEnabled: true,
        requiresSealedBids: true,
        requiresTwoPartyOpening: true,
        eligibilityRequirements: {
          create: [
            {
              code: "ELIG-REG",
              title: "Valid business registration",
              description: "Trade licence or certificate of competency current at bid date.",
              requirementType: "REGISTRATION",
              isMandatory: true,
              sortOrder: 1,
            },
            {
              code: "ELIG-TAX",
              title: "Tax identification and clearance",
              description: "Valid TIN and recent tax clearance certificate.",
              requirementType: "TAX",
              isMandatory: true,
              sortOrder: 2,
            },
            {
              code: "ELIG-EXP",
              title: "Comparable experience",
              description: "At least three comparable completed contracts in the last five years.",
              requirementType: "EXPERIENCE",
              isMandatory: true,
              sortOrder: 3,
            },
          ],
        },
        requiredDocuments: {
          create: [
            {
              code: "DOC-TECH",
              title: "Technical proposal",
              description: "Methodology, work plan and staffing schedule.",
              isMandatory: true,
              sortOrder: 1,
            },
            {
              code: "DOC-FIN",
              title: "Financial proposal",
              description: "Priced bill of quantities and payment schedule.",
              isMandatory: true,
              sortOrder: 2,
            },
            {
              code: "DOC-EXP",
              title: "Evidence of comparable experience",
              description: "Completion certificates or client references.",
              isMandatory: true,
              sortOrder: 3,
            },
          ],
        },
        evaluationCriteria: {
          create: [
            {
              code: "CRIT-TECH",
              title: "Technical approach and methodology",
              description: "Soundness of the proposed approach, work plan and risk management.",
              stage: "TECHNICAL",
              weight: "50.00",
              maxScore: "100.00",
              isMandatory: true,
              sortOrder: 1,
            },
            {
              code: "CRIT-KEY",
              title: "Key personnel qualifications",
              description: "Relevant qualifications and experience of proposed key staff.",
              stage: "TECHNICAL",
              weight: "20.00",
              maxScore: "100.00",
              isMandatory: false,
              sortOrder: 2,
            },
            {
              code: "CRIT-PRICE",
              title: "Price",
              description: "Total evaluated price relative to the budget and competing offers.",
              stage: "FINANCIAL",
              weight: "30.00",
              maxScore: "100.00",
              isMandatory: false,
              sortOrder: 3,
            },
          ],
        },
      },
      select: { id: true },
    });

    await prisma.tenderStatusHistory.create({
      data: {
        tenderId: tender.id,
        fromStatus: "DRAFT",
        toStatus: spec.status,
        reason: "Seeded development tender",
        actorId: publisherId,
      },
      select: { id: true },
    });

    tenderCount += 1;
  }
  console.log(`  tenders: ${tenderCount}`);

  console.log("\nDevelopment accounts (password for all: DevOnly!Password1):");
  for (const account of accounts) {
    console.log(`  ${account.email}  (${account.role})`);
  }
  console.log("\nSeeding complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
