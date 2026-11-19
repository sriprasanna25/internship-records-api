CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('Remote', 'Hybrid', 'On-site')),
  status TEXT NOT NULL CHECK (status IN ('Applied', 'Interview', 'Offered', 'Rejected', 'Completed')),
  start_date TEXT,
  end_date TEXT,
  stipend REAL CHECK (stipend IS NULL OR stipend >= 0),
  application_url TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_internships_company ON internships(company);