-- OMOP CDM v5.4 Schema (Simplified for this application)

-- Core OMOP tables needed for cohort analysis

CREATE TABLE IF NOT EXISTS person (
    person_id INTEGER PRIMARY KEY,
    gender_concept_id INTEGER NOT NULL,
    year_of_birth INTEGER,
    month_of_birth INTEGER,
    day_of_birth INTEGER,
    birth_datetime TEXT,
    race_concept_id INTEGER,
    ethnicity_concept_id INTEGER,
    location_id INTEGER,
    provider_id INTEGER,
    care_site_id INTEGER,
    person_source_value TEXT,
    gender_source_value TEXT,
    gender_source_concept_id INTEGER,
    race_source_value TEXT,
    race_source_concept_id INTEGER,
    ethnicity_source_value TEXT,
    ethnicity_source_concept_id INTEGER
);

CREATE TABLE IF NOT EXISTS concept (
    concept_id INTEGER PRIMARY KEY,
    concept_name TEXT NOT NULL,
    domain_id TEXT NOT NULL,
    vocabulary_id TEXT NOT NULL,
    concept_class_id TEXT NOT NULL,
    standard_concept TEXT,
    concept_code TEXT NOT NULL,
    valid_start_date DATE NOT NULL,
    valid_end_date DATE NOT NULL,
    invalid_reason TEXT
);

CREATE TABLE IF NOT EXISTS condition_occurrence (
    condition_occurrence_id INTEGER PRIMARY KEY,
    person_id INTEGER NOT NULL,
    condition_concept_id INTEGER NOT NULL,
    condition_start_date DATE NOT NULL,
    condition_start_datetime TEXT,
    condition_end_date DATE,
    condition_end_datetime TEXT,
    condition_type_concept_id INTEGER NOT NULL,
    condition_status_concept_id INTEGER,
    stop_reason TEXT,
    provider_id INTEGER,
    visit_occurrence_id INTEGER,
    visit_detail_id INTEGER,
    condition_source_value TEXT,
    condition_source_concept_id INTEGER,
    condition_status_source_value TEXT,
    FOREIGN KEY (person_id) REFERENCES person(person_id),
    FOREIGN KEY (condition_concept_id) REFERENCES concept(concept_id)
);

CREATE TABLE IF NOT EXISTS measurement (
    measurement_id INTEGER PRIMARY KEY,
    person_id INTEGER NOT NULL,
    measurement_concept_id INTEGER NOT NULL,
    measurement_date DATE NOT NULL,
    measurement_datetime TEXT,
    measurement_time TEXT,
    measurement_type_concept_id INTEGER NOT NULL,
    operator_concept_id INTEGER,
    value_as_number REAL,
    value_as_concept_id INTEGER,
    unit_concept_id INTEGER,
    range_low REAL,
    range_high REAL,
    provider_id INTEGER,
    visit_occurrence_id INTEGER,
    visit_detail_id INTEGER,
    measurement_source_value TEXT,
    measurement_source_concept_id INTEGER,
    unit_source_value TEXT,
    unit_source_concept_id INTEGER,
    value_source_value TEXT,
    measurement_event_id INTEGER,
    meas_event_field_concept_id INTEGER,
    FOREIGN KEY (person_id) REFERENCES person(person_id),
    FOREIGN KEY (measurement_concept_id) REFERENCES concept(concept_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_person_gender ON person(gender_concept_id);
CREATE INDEX IF NOT EXISTS idx_person_birth ON person(year_of_birth);
CREATE INDEX IF NOT EXISTS idx_condition_person ON condition_occurrence(person_id);
CREATE INDEX IF NOT EXISTS idx_condition_concept ON condition_occurrence(condition_concept_id);
CREATE INDEX IF NOT EXISTS idx_measurement_person ON measurement(person_id);
CREATE INDEX IF NOT EXISTS idx_measurement_concept ON measurement(measurement_concept_id);
CREATE INDEX IF NOT EXISTS idx_concept_domain ON concept(domain_id);