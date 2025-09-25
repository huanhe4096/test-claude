-- Insert gender concepts
INSERT OR IGNORE INTO concept (concept_id, concept_name, domain_id, vocabulary_id, concept_class_id, standard_concept, concept_code, valid_start_date, valid_end_date)
VALUES
(8507, 'Male', 'Gender', 'Gender', 'Gender', 'S', 'M', '1970-01-01', '2099-12-31'),
(8532, 'Female', 'Gender', 'Gender', 'Gender', 'S', 'F', '1970-01-01', '2099-12-31');

-- Insert disease concepts from mapping
INSERT OR IGNORE INTO concept (concept_id, concept_name, domain_id, vocabulary_id, concept_class_id, standard_concept, concept_code, valid_start_date, valid_end_date)
VALUES
(443392, 'Malignant neoplastic disease', 'Condition', 'SNOMED', 'Clinical Finding', 'S', '363346000', '1970-01-01', '2099-12-31'),
(201820, 'Diabetes mellitus', 'Condition', 'SNOMED', 'Clinical Finding', 'S', '73211009', '1970-01-01', '2099-12-31'),
(316866, 'Hypertensive disorder', 'Condition', 'SNOMED', 'Clinical Finding', 'S', '38341003', '1970-01-01', '2099-12-31'),
(46271022, 'Chronic kidney disease', 'Condition', 'SNOMED', 'Clinical Finding', 'S', '709044004', '1970-01-01', '2099-12-31');

-- Insert measurement concepts
INSERT OR IGNORE INTO concept (concept_id, concept_name, domain_id, vocabulary_id, concept_class_id, standard_concept, concept_code, valid_start_date, valid_end_date)
VALUES
(3000963, 'Hemoglobin [Mass/volume] in Blood', 'Measurement', 'LOINC', 'Lab Test', 'S', '718-7', '1970-01-01', '2099-12-31'),
(3004501, 'Glucose [Mass/volume] in Serum or Plasma', 'Measurement', 'LOINC', 'Lab Test', 'S', '33747-0', '1970-01-01', '2099-12-31'),
(3012888, 'Diastolic blood pressure', 'Measurement', 'LOINC', 'Clinical Measurement', 'S', '8462-4', '1970-01-01', '2099-12-31'),
(3004249, 'Systolic blood pressure', 'Measurement', 'LOINC', 'Clinical Measurement', 'S', '8480-6', '1970-01-01', '2099-12-31');

-- Sample person data (mix of demographics)
INSERT OR IGNORE INTO person (person_id, gender_concept_id, year_of_birth, month_of_birth, day_of_birth, race_concept_id, ethnicity_concept_id)
VALUES
(1, 8507, 1960, 5, 15, 8527, 38003564),
(2, 8532, 1975, 8, 22, 8527, 38003564),
(3, 8507, 1942, 12, 3, 8527, 38003564),
(4, 8532, 1988, 3, 10, 8527, 38003564),
(5, 8507, 1955, 7, 28, 8527, 38003564),
(6, 8532, 1962, 11, 12, 8527, 38003564),
(7, 8507, 1978, 4, 6, 8527, 38003564),
(8, 8532, 1950, 9, 18, 8527, 38003564),
(9, 8507, 1985, 1, 25, 8527, 38003564),
(10, 8532, 1970, 6, 14, 8527, 38003564);

-- Sample condition occurrences (some with diabetes, cancer, etc.)
INSERT OR IGNORE INTO condition_occurrence (condition_occurrence_id, person_id, condition_concept_id, condition_start_date, condition_type_concept_id)
VALUES
(1, 1, 201820, '2020-03-15', 32020),  -- Person 1 has diabetes
(2, 3, 201820, '2019-07-22', 32020),  -- Person 3 has diabetes
(3, 5, 443392, '2021-01-10', 32020),  -- Person 5 has cancer
(4, 6, 316866, '2020-11-05', 32020),  -- Person 6 has hypertension
(5, 8, 201820, '2018-05-30', 32020),  -- Person 8 has diabetes
(6, 2, 316866, '2021-09-12', 32020),  -- Person 2 has hypertension
(7, 7, 46271022, '2020-02-28', 32020); -- Person 7 has CKD

-- Sample measurements with realistic values
INSERT OR IGNORE INTO measurement (measurement_id, person_id, measurement_concept_id, measurement_date, measurement_type_concept_id, value_as_number, unit_concept_id)
VALUES
-- Glucose measurements (diabetes patients should have higher values)
(1, 1, 3004501, '2020-04-01', 44818701, 180.5, 8840),  -- Person 1 (diabetic): high glucose
(2, 3, 3004501, '2019-08-15', 44818701, 195.2, 8840),  -- Person 3 (diabetic): high glucose
(3, 8, 3004501, '2018-06-20', 44818701, 175.8, 8840),  -- Person 8 (diabetic): high glucose
(4, 2, 3004501, '2021-05-10', 44818701, 92.3, 8840),   -- Person 2 (non-diabetic): normal glucose
(5, 4, 3004501, '2021-03-25', 44818701, 88.7, 8840),   -- Person 4 (non-diabetic): normal glucose
(6, 7, 3004501, '2020-11-18', 44818701, 96.1, 8840),   -- Person 7 (non-diabetic): normal glucose

-- Hemoglobin measurements
(7, 1, 3000963, '2020-04-01', 44818701, 13.5, 8713),   -- Person 1: normal hemoglobin
(8, 5, 3000963, '2021-02-15', 44818701, 10.2, 8713),   -- Person 5 (cancer): low hemoglobin
(9, 2, 3000963, '2021-05-10', 44818701, 14.1, 8713),   -- Person 2: normal hemoglobin
(10, 9, 3000963, '2021-07-08', 44818701, 15.8, 8713),  -- Person 9: normal hemoglobin

-- Blood pressure measurements
(11, 6, 3004249, '2020-12-01', 44818701, 155.0, 8876), -- Person 6 (hypertensive): high systolic
(12, 6, 3012888, '2020-12-01', 44818701, 95.0, 8876),  -- Person 6 (hypertensive): high diastolic
(13, 2, 3004249, '2021-05-10', 44818701, 120.0, 8876), -- Person 2 (normal): normal systolic
(14, 2, 3012888, '2021-05-10', 44818701, 80.0, 8876),  -- Person 2 (normal): normal diastolic
(15, 4, 3004249, '2021-03-25', 44818701, 118.0, 8876), -- Person 4 (normal): normal systolic
(16, 4, 3012888, '2021-03-25', 44818701, 78.0, 8876);  -- Person 4 (normal): normal diastolic