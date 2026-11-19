const { z } = require("zod");

const optionalDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format").optional().nullable();
const optionalUrl = z.string().url("Must be a valid URL").optional().nullable();

const internshipSchema = z.object({
  company: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(100),
  location: z.string().trim().min(2).max(100),
  mode: z.enum(["Remote", "Hybrid", "On-site"]),
  status: z.enum(["Applied", "Interview", "Offered", "Rejected", "Completed"]).default("Applied"),
  startDate: optionalDate,
  endDate: optionalDate,
  stipend: z.number().nonnegative().optional().nullable(),
  applicationUrl: optionalUrl,
  notes: z.string().trim().max(1000).optional().nullable()
}).strict().refine(
  (data) => !(data.startDate && data.endDate) || data.endDate >= data.startDate,
  { message: "endDate must be on or after startDate", path: ["endDate"] }
);

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["Applied", "Interview", "Offered", "Rejected", "Completed"]).optional(),
  search: z.string().trim().max(100).optional()
});

module.exports = { internshipSchema, paramsSchema, querySchema };