CREATE DATABASE job_tracker_db

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(50) DEFAULT 'my city'
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,  
    position VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    job_type VARCHAR(50) DEFAULT 'full-time',
    job_location VARCHAR(100) NOT NULL DEFAULT 'remote',
    date_applied DATE DEFAULT CURRENT_DATE,
    description VARCHAR(255),

    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);