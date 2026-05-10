import { pool } from "./connection.js";

export const schemaDB = async () => {

  console.log("Task for creating table executing...")

  await pool.query(
    `CREATE TABLE IF NOT EXISTS colleges (
      id SERIAL PRIMARY KEY,
      college_id TEXT,
      college_name TEXT unique,
      college_type TEXT,
      college_rank TEXT,
      aishe_code TEXT,
      af_hierarchy TEXT,
      nirf_ranking TEXT,
      place TEXT,
      state TEXT,
      district TEXT,
      affiliated_to TEXT,
      year_of_establish FLOAT
    );`
  )

  console.log("Table created for colleges")

  await pool.query(
    ` CREATE TABLE IF NOT EXISTS exams (
      id SERIAL PRIMARY KEY,
      name VARCHAR UNIQUE NOT NULL
    );`
  )

  await pool.query(
    `CREATE TABLE IF NOT EXISTS courses(
  id SERIAL PRIMARY KEY,
  college_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  program_name TEXT,
  seats INT,
  fees INT,

  CONSTRAINT unique_course
    UNIQUE (college_name, course_name, program_name),

  CONSTRAINT fk_college
    FOREIGN KEY (college_name)
    REFERENCES colleges(college_name)
    ON DELETE CASCADE
  );`
  )

  await pool.query(
    `CREATE TABLE IF NOT EXISTS categories (
   id SERIAL PRIMARY KEY,
   name VARCHAR UNIQUE NOT NULL
  );`
  )

  await pool.query(
    `CREATE TABLE IF NOT EXISTS cutoffs (
  id SERIAL PRIMARY KEY,
  
  course_id INT NOT NULL,
  exam_id INT NOT NULL,
  category_id INT,

  quota VARCHAR,
  gender VARCHAR,

  opening_mark FLOAT,
  closing_mark FLOAT,

  opening_rank FLOAT,
  closing_rank FLOAT,

  opening_value FLOAT,
  closing_value FLOAT ,

  value_type VARCHAR NOT NULL CHECK (value_type IN ('rank', 'marks')),
  year INT NOT NULL,

  CONSTRAINT fk_course
    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_exam
    FOREIGN KEY (exam_id)
    REFERENCES exams(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL,

  CONSTRAINT unique_cutoff_entry
    UNIQUE (course_id, exam_id, category_id, quota, gender, year)
  );`
  )

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_courses_college
    ON courses(college_name);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_cutoffs_course
    ON cutoffs(course_id);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_cutoffs_exam
    ON cutoffs(exam_id);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_cutoffs_category
    ON cutoffs(category_id);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_cutoffs_year
    ON cutoffs(year);
  `);

  console.log("All tables and indexes created successfully.");

  return
}