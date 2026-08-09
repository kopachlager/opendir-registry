ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(120),
  ADD COLUMN IF NOT EXISTS review_reason VARCHAR(1000),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS submissions_review_queue_idx
  ON submissions (created_at ASC)
  WHERE status = 'review';
