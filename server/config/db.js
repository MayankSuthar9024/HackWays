const { Pool } = require('pg');

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false },
    }
  : {
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '7665',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'org_portal',
    };

const pool = new Pool(poolConfig);

const initDB = async () => {
  try {
    const client = await pool.connect();
    console.log(`[PostgreSQL Connected]: connected successfully via ${process.env.DATABASE_URL ? 'DATABASE_URL' : 'local credentials'}`);

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        college VARCHAR(255) DEFAULT '',
        role VARCHAR(50) DEFAULT 'user',
        is_verified BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_by VARCHAR(255) DEFAULT 'system',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        purpose VARCHAR(50) DEFAULT 'login',
        temp_user_data JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        short_description TEXT NOT NULL,
        description TEXT NOT NULL,
        banner_image TEXT DEFAULT '',
        category VARCHAR(100) DEFAULT 'Hackathon',
        venue VARCHAR(255) DEFAULT 'Virtual / Main Auditorium',
        mode VARCHAR(50) DEFAULT 'Online',
        start_date TIMESTAMP WITH TIME ZONE NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE NOT NULL,
        time VARCHAR(100) DEFAULT '10:00 AM - 05:00 PM',
        status VARCHAR(50) DEFAULT 'Upcoming',
        registration_open BOOLEAN DEFAULT true,
        registration_deadline TIMESTAMP WITH TIME ZONE,
        max_team_size INT DEFAULT 4,
        rules JSONB DEFAULT '[]',
        prizes JSONB DEFAULT '[]',
        ps_release_time TIMESTAMP WITH TIME ZONE,
        ps_released_manual BOOLEAN DEFAULT false,
        prototype_open_time TIMESTAMP WITH TIME ZONE,
        prototype_close_time TIMESTAMP WITH TIME ZONE,
        prototype_manual_override BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        event_id INT REFERENCES events(id) ON DELETE CASCADE,
        team_name VARCHAR(255) DEFAULT '',
        college_or_org VARCHAR(255) DEFAULT '',
        status VARCHAR(50) DEFAULT 'Registered',
        registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, event_id)
      );

      CREATE TABLE IF NOT EXISTS problem_statements (
        id SERIAL PRIMARY KEY,
        event_id INT REFERENCES events(id) ON DELETE CASCADE,
        ps_code VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        difficulty VARCHAR(50) DEFAULT 'Medium',
        attachments JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS idea_submissions (
        id SERIAL PRIMARY KEY,
        event_id INT REFERENCES events(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        problem_statement_id INT REFERENCES problem_statements(id) ON DELETE CASCADE,
        idea_title VARCHAR(255) NOT NULL,
        idea_description TEXT NOT NULL,
        tech_stack JSONB DEFAULT '[]',
        supporting_file_url TEXT DEFAULT '',
        supporting_file_name TEXT DEFAULT '',
        external_links JSONB DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'Submitted',
        admin_remarks TEXT DEFAULT '',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, event_id)
      );

      CREATE TABLE IF NOT EXISTS prototype_submissions (
        id SERIAL PRIMARY KEY,
        event_id INT REFERENCES events(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        problem_statement_id INT REFERENCES problem_statements(id) ON DELETE CASCADE,
        idea_submission_id INT REFERENCES idea_submissions(id) ON DELETE SET NULL,
        prototype_title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        github_url TEXT DEFAULT '',
        live_demo_url TEXT DEFAULT '',
        drive_url TEXT DEFAULT '',
        uploaded_file_url TEXT DEFAULT '',
        uploaded_file_name TEXT DEFAULT '',
        status VARCHAR(50) DEFAULT 'Submitted',
        admin_remarks TEXT DEFAULT '',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, event_id)
      );
    `);

    client.release();
    console.log('[PostgreSQL Ready]: Schema tables verified and ready.');
  } catch (err) {
    console.error('[PostgreSQL Connection Error]:', err.message);
  }
};

module.exports = { pool, query: (text, params) => pool.query(text, params), initDB };
