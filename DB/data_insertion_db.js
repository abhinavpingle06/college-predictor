import fs from "fs";
import { pool } from "./connection.js";

const rawJson = fs.readFileSync("../scripts/DB-cleaning-scripts/cleaned_college_data.json","utf-8")
const jsonData = JSON.parse(rawJson);

// console.log(data[0]);
export const insertCollegeData = async (data) => {
    try {
    //     const collegeQuery = `
    //   INSERT INTO colleges (
    //     college_id,
    //     college_name,
    //     college_type,
    //     college_rank,
    //     aishe_code,
    //     af_hierarchy,
    //     nirf_ranking,
    //     place,
    //     state,
    //     district,
    //     affiliated_to,
    //     year_of_establish
    //   )
    //   VALUES (
    //     $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
    //   )

    //   ON CONFLICT (college_name)
    //     DO NOTHING;
    // `;

    //     const collegeValues = [
    //         data.college_id,
    //         data.college_name,
    //         data.college_type,
    //         data.college_rank,
    //         data.aishe_code,
    //         data.af_hierarchy,
    //         data.nirf_ranking,
    //         data.place,
    //         data.state,
    //         data.district,
    //         data.affiliated_to,
    //         data.year_of_establish
    //     ];

    //     const collegeRes = await pool.query(collegeQuery, collegeValues);

    //     // const collegeId = collegeRes.rows[0].id;
        // EXAMS SECTION
        const examQuery = `
      INSERT INTO exams (name)
      VALUES ($1)
      ON CONFLICT (name)
       DO NOTHING;
    `;
        const examRes = await pool.query(examQuery, [
            data.exam
        ]);

    //     const examId = examRes.rows[0].id;

    // CATEGORY SECTION 
        const categoryQuery = `
      INSERT INTO categories (name)
      VALUES ($1)
      ON CONFLICT (name)
       DO NOTHING;
    `;
        const categoryRes = await pool.query(categoryQuery, [
            data.category
        ]);

    //     const categoryId = categoryRes.rows[0].id;

    //     // =========================
    //     // 4. INSERT COURSE
    //     // =========================
    //     const courseQuery = `
    //   INSERT INTO courses (
    //     college_id,
    //     course_name,
    //     program_name,
    //     seats,
    //     fees
    //   )
    //   VALUES ($1,$2,$3,$4,$5)
    //   ON CONFLICT (college_id, course_name, program_name)
    //   DO UPDATE SET
    //     course_name = EXCLUDED.course_name
    //   RETURNING id;
    // `;

    //     const courseValues = [
    //         collegeId,
    //         data.course_name,
    //         data.program_name,
    //         data.total_seats,
    //         data.fees
    //     ];

    //     const courseRes = await pool.query(courseQuery, courseValues);

    //     const courseId = courseRes.rows[0].id;

    //     // =========================
    //     // 5. DETERMINE VALUE TYPE
    //     // =========================
    //     const valueType =
    //         data.closing_rank != null
    //             ? "rank"
    //             : "marks";

    //     const openingValue =
    //         data.opening_rank ??
    //         data.opening_mark ??
    //         null;

    //     const closingValue =
    //         data.closing_rank ??
    //         data.closing_mark ??
    //         null;

    //     // =========================
    //     // 6. INSERT CUTOFF
    //     // =========================
    //     const cutoffQuery = `
    //   INSERT INTO cutoffs (
    //     course_id,
    //     exam_id,
    //     category_id,
    //     quota,
    //     gender,

    //     opening_mark,
    //     closing_mark,

    //     opening_rank,
    //     closing_rank,

    //     opening_value,
    //     closing_value,

    //     value_type,
    //     year
    //   )
    //   VALUES (
    //     $1,$2,$3,$4,$5,
    //     $6,$7,
    //     $8,$9,
    //     $10,$11,
    //     $12,$13
    //   )
    //   ON CONFLICT DO NOTHING;
    // `;

    //     const cutoffValues = [
    //         courseId,
    //         examId,
    //         categoryId,

    //         data.quota,
    //         data.gender,

    //         data.opening_mark,
    //         data.closing_mark,

    //         data.opening_rank,
    //         data.closing_rank,

    //         openingValue,
    //         closingValue,

    //         valueType,
    //         2024
    //     ];

    //     await pool.query(cutoffQuery, cutoffValues);

        // console.log("Inserted successfully");

    } catch (error) {
        console.error("Insertion error:", error);
    }
};

const BATCH_SIZE = 50;

const startInsertion = async () => {

    try {
        console.log("Execution Started");

        for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {

            const batch = jsonData.slice(i, i + BATCH_SIZE);
            await Promise.all(
                batch.map(async (item) => {
                    try {
                        await insertCollegeData(item);
                    } catch (err) {
                        console.error(
                            `Error inserting record at index ${i}:`,
                            err.message
                        );
                    }
                })
            );
            console.log(
                `Inserted ${Math.min(i + batch.length, jsonData.length)} records`
            );
        }
        console.log("All data inserted successfully");

    } catch (error) {
        console.error("Batch insertion failed:", error);
    }

};

startInsertion();