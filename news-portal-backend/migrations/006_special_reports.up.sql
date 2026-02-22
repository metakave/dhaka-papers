-- Create Special Reports table
CREATE TABLE special_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    thumbnail TEXT,
    status VARCHAR(20) DEFAULT 'draft' NOT NULL,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Report Items table (for individual entries like victims)
CREATE TABLE report_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES special_reports(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL, -- e.g. Victim Name
    date_str VARCHAR(100),       -- e.g. "08-Sep-24"
    details TEXT,                -- Detailed biography/info
    image_url TEXT,              -- Main photo
    qr_code_url TEXT,            -- Evidence QR
    news_url TEXT,               -- Link to story
    serial_number INT,           -- Order of items
    metadata JSONB,              -- Flexible extra fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_special_reports_slug ON special_reports(slug);
CREATE INDEX idx_report_items_report_id ON report_items(report_id);
CREATE INDEX idx_report_items_serial ON report_items(serial_number);
