const express = require("express");
const db = require("./db");
const { internshipSchema, paramsSchema, querySchema } = require("./validation");

const router = express.Router();

function toApiRecord(row) {
  if (!row) return row;
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    location: row.location,
    mode: row.mode,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    stipend: row.stipend,
    applicationUrl: row.application_url,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseOrThrow(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));
    throw error;
  }
  return result.data;
}

// GET /api/internships?page=1&limit=10&status=Applied&search=developer
router.get("/", (req, res, next) => {
  try {
    const { page, limit, status, search } = parseOrThrow(querySchema, req.query);
    const conditions = [];
    const values = [];

    if (status) {
      conditions.push("status = ?");
      values.push(status);
    }
    if (search) {
      conditions.push("(company LIKE ? OR role LIKE ? OR location LIKE ?)");
      const term = `%${search}%`;
      values.push(term, term, term);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const total = db.prepare(`SELECT COUNT(*) AS count FROM internships ${where}`).get(...values).count;
    const rows = db.prepare(
      `SELECT * FROM internships ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`
    ).all(...values, limit, (page - 1) * limit);

    res.json({
      success: true,
      data: rows.map(toApiRecord),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/internships/:id
router.get("/:id", (req, res, next) => {
  try {
    const { id } = parseOrThrow(paramsSchema, req.params);
    const row = db.prepare("SELECT * FROM internships WHERE id = ?").get(id);
    if (!row) return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Internship record not found" }
    });
    res.json({ success: true, data: toApiRecord(row) });
  } catch (error) {
    next(error);
  }
});

// POST /api/internships
router.post("/", (req, res, next) => {
  try {
    const data = parseOrThrow(internshipSchema, req.body);
    const result = db.prepare(`
      INSERT INTO internships
      (company, role, location, mode, status, start_date, end_date, stipend, application_url, notes)
      VALUES (@company, @role, @location, @mode, @status, @startDate, @endDate, @stipend, @applicationUrl, @notes)
    `).run({
      ...data,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      stipend: data.stipend ?? null,
      applicationUrl: data.applicationUrl ?? null,
      notes: data.notes ?? null
    });
    const created = db.prepare("SELECT * FROM internships WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: toApiRecord(created) });
  } catch (error) {
    next(error);
  }
});

// PUT /api/internships/:id (replaces the editable fields)
router.put("/:id", (req, res, next) => {
  try {
    const { id } = parseOrThrow(paramsSchema, req.params);
    const data = parseOrThrow(internshipSchema, req.body);
    const existing = db.prepare("SELECT id FROM internships WHERE id = ?").get(id);
    if (!existing) return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Internship record not found" }
    });

    db.prepare(`
      UPDATE internships SET
        company=@company, role=@role, location=@location, mode=@mode, status=@status,
        start_date=@startDate, end_date=@endDate, stipend=@stipend,
        application_url=@applicationUrl, notes=@notes, updated_at=datetime('now')
      WHERE id=@id
    `).run({
      id,
      ...data,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      stipend: data.stipend ?? null,
      applicationUrl: data.applicationUrl ?? null,
      notes: data.notes ?? null
    });
    const updated = db.prepare("SELECT * FROM internships WHERE id = ?").get(id);
    res.json({ success: true, data: toApiRecord(updated) });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/internships/:id
router.delete("/:id", (req, res, next) => {
  try {
    const { id } = parseOrThrow(paramsSchema, req.params);
    const result = db.prepare("DELETE FROM internships WHERE id = ?").run(id);
    if (!result.changes) return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Internship record not found" }
    });
    res.json({ success: true, message: "Internship record deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;