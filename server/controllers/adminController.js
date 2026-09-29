const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

// GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      uCount,
      eCount,
      rCount,
      iCount,
      pCount,
      recentEventsRes,
      recentRegRes,
    ] = await Promise.all([
      query('SELECT COUNT(*) FROM users'),
      query('SELECT COUNT(*) FROM events'),
      query('SELECT COUNT(*) FROM registrations'),
      query('SELECT COUNT(*) FROM idea_submissions'),
      query('SELECT COUNT(*) FROM prototype_submissions'),
      query('SELECT id, title, category, status, start_date, created_at FROM events ORDER BY created_at DESC LIMIT 5'),
      query(`
        SELECT r.id as reg_id, r.registered_at,
               u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone,
               e.id as event_id, e.title as event_title
        FROM registrations r
        JOIN users u ON r.user_id = u.id
        JOIN events e ON r.event_id = e.id
        ORDER BY r.registered_at DESC
        LIMIT 8
      `),
    ]);

    const totalUsers = parseInt(uCount.rows[0].count, 10);
    const totalEvents = parseInt(eCount.rows[0].count, 10);
    const totalRegistrations = parseInt(rCount.rows[0].count, 10);
    const totalIdeaSubmissions = parseInt(iCount.rows[0].count, 10);
    const totalPrototypeSubmissions = parseInt(pCount.rows[0].count, 10);

    const recentEvents = recentEventsRes.rows.map((r) => ({
      ...r,
      _id: r.id,
      startDate: r.start_date,
      createdAt: r.created_at,
    }));

    const recentRegistrations = recentRegRes.rows.map((r) => ({
      _id: r.reg_id,
      id: r.reg_id,
      registeredAt: r.registered_at,
      user: {
        id: r.user_id,
        _id: r.user_id,
        name: r.user_name,
        email: r.user_email,
        phone: r.user_phone,
      },
      event: {
        id: r.event_id,
        _id: r.event_id,
        title: r.event_title,
      },
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalIdeaSubmissions,
        totalPrototypeSubmissions,
        totalSubmissions: totalIdeaSubmissions + totalPrototypeSubmissions,
      },
      recentEvents,
      recentRegistrations,
    });
  } catch (error) {
    console.error('Admin Dashboard Stats Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics.' });
  }
};

// GET /api/admin/users
exports.getRegisteredUsers = async (req, res) => {
  try {
    const { eventId, search } = req.query;
    let sql = `
      SELECT r.id as reg_id, r.team_name, r.college_or_org, r.status as reg_status, r.registered_at,
             u.id as user_id, u.name, u.email, u.phone, u.college, u.created_at as user_created_at,
             e.id as event_id, e.title as event_title, e.status as event_status, e.start_date
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN events e ON r.event_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (eventId && eventId !== 'all') {
      params.push(Number(eventId));
      sql += ` AND r.event_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR u.phone ILIKE $${params.length} OR r.team_name ILIKE $${params.length})`;
    }

    sql += ' ORDER BY r.registered_at DESC';

    const { rows } = await query(sql, params);

    const users = rows.map((r) => ({
      id: r.reg_id,
      _id: r.reg_id,
      teamName: r.team_name,
      collegeOrOrg: r.college_or_org,
      status: r.reg_status,
      registeredAt: r.registered_at,
      user: {
        id: r.user_id,
        _id: r.user_id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        college: r.college,
        createdAt: r.user_created_at,
      },
      event: {
        id: r.event_id,
        _id: r.event_id,
        title: r.event_title,
        status: r.event_status,
        startDate: r.start_date,
      },
    }));

    return res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    console.error('Get Registered Users Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve registered users list.' });
  }
};

// GET /api/admin/submissions
exports.getSubmissions = async (req, res) => {
  try {
    const { eventId, psId, type = 'idea' } = req.query;

    if (type === 'prototype') {
      let sql = `
        SELECT pr.*,
               u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone, u.college as user_college,
               ps.id as ps_id, ps.title as ps_title, ps.ps_code, ps.category as ps_category,
               e.id as event_id, e.title as event_title
        FROM prototype_submissions pr
        JOIN users u ON pr.user_id = u.id
        JOIN problem_statements ps ON pr.problem_statement_id = ps.id
        JOIN events e ON pr.event_id = e.id
        WHERE 1=1
      `;
      const params = [];

      if (eventId && eventId !== 'all') {
        params.push(Number(eventId));
        sql += ` AND pr.event_id = $${params.length}`;
      }

      if (psId && psId !== 'all') {
        params.push(Number(psId));
        sql += ` AND pr.problem_statement_id = $${params.length}`;
      }

      sql += ' ORDER BY pr.submitted_at DESC';
      const { rows } = await query(sql, params);

      const submissions = rows.map((r) => ({
        id: r.id,
        _id: r.id,
        prototypeTitle: r.prototype_title,
        description: r.description,
        githubUrl: r.github_url,
        liveDemoUrl: r.live_demo_url,
        driveUrl: r.drive_url,
        uploadedFileUrl: r.uploaded_file_url,
        uploadedFileName: r.uploaded_file_name,
        status: r.status,
        adminRemarks: r.admin_remarks,
        submittedAt: r.submitted_at,
        user: {
          id: r.user_id,
          _id: r.user_id,
          name: r.user_name,
          email: r.user_email,
          phone: r.user_phone,
          college: r.user_college,
        },
        problemStatement: {
          id: r.ps_id,
          _id: r.ps_id,
          title: r.ps_title,
          psCode: r.ps_code,
          category: r.ps_category,
        },
        event: {
          id: r.event_id,
          _id: r.event_id,
          title: r.event_title,
        },
      }));

      return res.status(200).json({ success: true, count: submissions.length, submissions });
    } else {
      let sql = `
        SELECT i.*,
               u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone, u.college as user_college,
               ps.id as ps_id, ps.title as ps_title, ps.ps_code, ps.category as ps_category,
               e.id as event_id, e.title as event_title
        FROM idea_submissions i
        JOIN users u ON i.user_id = u.id
        JOIN problem_statements ps ON i.problem_statement_id = ps.id
        JOIN events e ON i.event_id = e.id
        WHERE 1=1
      `;
      const params = [];

      if (eventId && eventId !== 'all') {
        params.push(Number(eventId));
        sql += ` AND i.event_id = $${params.length}`;
      }

      if (psId && psId !== 'all') {
        params.push(Number(psId));
        sql += ` AND i.problem_statement_id = $${params.length}`;
      }

      sql += ' ORDER BY i.submitted_at DESC';
      const { rows } = await query(sql, params);

      const submissions = rows.map((r) => ({
        id: r.id,
        _id: r.id,
        ideaTitle: r.idea_title,
        ideaDescription: r.idea_description,
        techStack: typeof r.tech_stack === 'string' ? JSON.parse(r.tech_stack) : r.tech_stack,
        supportingFileUrl: r.supporting_file_url,
        supportingFileName: r.supporting_file_name,
        externalLinks: typeof r.external_links === 'string' ? JSON.parse(r.external_links) : r.external_links,
        status: r.status,
        adminRemarks: r.admin_remarks,
        submittedAt: r.submitted_at,
        user: {
          id: r.user_id,
          _id: r.user_id,
          name: r.user_name,
          email: r.user_email,
          phone: r.user_phone,
          college: r.user_college,
        },
        problemStatement: {
          id: r.ps_id,
          _id: r.ps_id,
          title: r.ps_title,
          psCode: r.ps_code,
          category: r.ps_category,
        },
        event: {
          id: r.event_id,
          _id: r.event_id,
          title: r.event_title,
        },
      }));

      return res.status(200).json({ success: true, count: submissions.length, submissions });
    }
  } catch (error) {
    console.error('Get Submissions Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve submissions.' });
  }
};

// PUT /api/admin/submissions/:type/:id/review
exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status, adminRemarks } = req.body;
    const table = type === 'prototype' ? 'prototype_submissions' : 'idea_submissions';

    const { rows } = await query(
      `UPDATE ${table}
       SET status = COALESCE($1, status),
           admin_remarks = COALESCE($2, admin_remarks)
       WHERE id = $3
       RETURNING *`,
      [status, adminRemarks, Number(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Submission record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Submission review and status updated successfully.',
      submission: { ...rows[0], _id: rows[0].id },
    });
  } catch (error) {
    console.error('Update Submission Review Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update submission review.' });
  }
};

// GET /api/admin/admins
exports.getAdmins = async (req, res) => {
  try {
    const { rows } = await query('SELECT id, name, email, role, created_by, created_at FROM admins ORDER BY created_at DESC');
    const admins = rows.map((r) => ({ ...r, _id: r.id }));
    return res.status(200).json({ success: true, admins });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch admin accounts.' });
  }
};

// POST /api/admin/admins
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await query('SELECT id FROM admins WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An admin account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await query(
      `INSERT INTO admins (name, email, password, role, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role`,
      [name.trim(), normalizedEmail, hashedPassword, role || 'admin', req.user.email]
    );

    const newAdmin = rows[0];
    return res.status(201).json({
      success: true,
      message: 'New admin account created.',
      admin: {
        id: newAdmin.id,
        _id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error('Create Admin Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create admin.' });
  }
};
