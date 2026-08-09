CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  normalized_url TEXT NOT NULL UNIQUE,
  description VARCHAR(1000) NOT NULL,
  category VARCHAR(50) NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  repository_url TEXT,
  submitted_by VARCHAR(120) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'review'
    CHECK (status IN ('received', 'validating', 'review', 'published', 'rejected')),
  validation_errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS submissions_status_created_idx
  ON submissions (status, created_at DESC);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  submission_id TEXT UNIQUE REFERENCES submissions(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  normalized_url TEXT NOT NULL UNIQUE,
  description VARCHAR(1000) NOT NULL,
  category VARCHAR(50) NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  repository_url TEXT,
  submitted_by VARCHAR(120) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_category_updated_idx
  ON projects (category, updated_at DESC);

CREATE TABLE IF NOT EXISTS submission_events (
  id BIGSERIAL PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  event_type VARCHAR(40) NOT NULL,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS submission_events_submission_idx
  ON submission_events (submission_id, created_at ASC);
