require('dotenv').config(); 
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const PORT = process.env.PORT || 5000;
const authorization = require("./middleware/authorization");


// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://senin-projen.vercel.app" // Update this with your Vercel URL
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy: Access denied for this origin.'));
    }
  },
  credentials: true 
}));

app.use(express.json());

// 1. AUTH ROUTES 
// ----------------------------------------------------------------

app.use("/auth", require("./routes/authRoutes"));

// 2. JOB ROUTES
// ----------------------------------------------------------------

//all jobs
app.get('/jobs', authorization, async (req, res) => {
    try {
        const {search, status, jobType, sort} = req.query;
        const userId = req.user.id;

        let baseQuery = `SELECT 
            id, 
            company, 
            position, 
            status, 
            job_type as "jobType", 
            job_location as "jobLocation", 
            date_applied as "dateApplied", 
            description,
            created_by as "createdBy",
            created_at as "createdAt",
            updated_at as "updatedAt"
        FROM jobs WHERE created_by = $1`;
        
        let queryParams = [userId];
        let paramCount = 1;

        // Search
        if (search) {
            paramCount++;
            baseQuery += ` AND (position ILIKE $${paramCount} OR company ILIKE $${paramCount})`;
            queryParams.push(`%${search}%`);
        }
        
        // Status
        if (status && status !== 'all') {
            paramCount++;
            baseQuery += ` AND status = $${paramCount}`;
            queryParams.push(status);
        }

        // Sort
        if (sort === 'latest') {
            baseQuery += ` ORDER BY date_applied DESC`;
        } else if (sort === 'oldest') {
            baseQuery += ` ORDER BY date_applied ASC`;
        } else if (sort === 'a-z') {
            baseQuery += ` ORDER BY position ASC`;
        } else {
            baseQuery += ` ORDER BY created_at DESC`;
        }

        const allJobs = await pool.query(baseQuery, queryParams);
        res.json(allJobs.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//add new job
app.post('/jobs', authorization, async (req, res) => {
    try {
        const { company, position, status, jobType, jobLocation, dateApplied } = req.body;
        const userId = req.user.id;
        
        const newJob = await pool.query(
            `INSERT INTO jobs (company, position, status, job_type, job_location, date_applied, created_by) 
             VALUES($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, company, position, status, 
                       job_type as "jobType", 
                       job_location as "jobLocation", 
                       date_applied as "dateApplied",
                       created_by as "createdBy"`,
            [company, position, status, jobType, jobLocation, dateApplied, userId]
        );

        res.json(newJob.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Adding job error");
    }
});

//delete job
app.delete('/jobs/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; 
        
        const deleteJob = await pool.query(
            "DELETE FROM jobs WHERE id = $1 AND created_by = $2 RETURNING *",
            [id, userId]
        );

        if (deleteJob.rows.length === 0) {
            return res.json("You don't have permission to delete this job or job not found.");
        }

        res.json("Job deleted!");
    } catch (err) {
        console.error(err.message);
    }
});

//update job
app.patch('/jobs/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; 
        
        
        const updates = req.body;
        
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json("No fields to update");
        }
        
        
        const allowedFields = ['company', 'position', 'status', 'job_type', 'job_location', 'date_applied'];
        const dbFieldMap = {
            jobType: 'job_type',
            jobLocation: 'job_location',
            dateApplied: 'date_applied'
        };
        
        const entries = Object.entries(updates);
        const setClauses = [];
        const values = [];
        let paramCount = 1;
        
        entries.forEach(([key, value]) => {
            const dbField = dbFieldMap[key] || key;
            if (allowedFields.includes(dbField)) {
                setClauses.push(`${dbField} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });
        
        if (setClauses.length === 0) {
            return res.status(400).json("No valid fields to update");
        }
        
        values.push(id, userId);
        
        const updateJob = await pool.query(
            `UPDATE jobs 
             SET ${setClauses.join(', ')} 
             WHERE id = $${paramCount} AND created_by = $${paramCount + 1} 
             RETURNING id, company, position, status, 
                       job_type as "jobType", 
                       job_location as "jobLocation", 
                       date_applied as "dateApplied"`,
            values
        );

        if (updateJob.rows.length === 0) {
            return res.status(404).json("Job not found or you don't have permission to update it");
        }

        res.json(updateJob.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Update error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});