const { query } = require('../config/db');

function formatEvent(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    bannerImage: row.banner_image,
    category: row.category,
    venue: row.venue,
    mode: row.mode,
    startDate: row.start_date,
    endDate: row.end_date,
    time: row.time,
    status: row.status,
    registrationOpen: row.registration_open,
    registrationDeadline: row.registration_deadline,
    maxTeamSize: row.max_team_size,
    rules: typeof row.rules === 'string' ? JSON.parse(row.rules) : row.rules || [],
    prizes: typeof row.prizes === 'string' ? JSON.parse(row.prizes) : row.prizes || [],
    schedule: {
      psReleaseTime: row.ps_release_time,
      psReleasedManual: row.ps_released_manual,
      prototypeOpenTime: row.prototype_open_time,
      prototypeCloseTime: row.prototype_close_time,
      prototypeManualOverride: row.prototype_manual_override,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (title ILIKE $${params.length} OR short_description ILIKE $${params.length} OR category ILIKE $${params.length})`;
    }

    sql += ' ORDER BY start_date DESC';
    const { rows } = await query(sql, params);
    const events = rows.map(formatEvent);

    return res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    console.error('Get All Events Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch events.' });
  }
};

// GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const { rows } = await query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const event = formatEvent(rows[0]);
    let isRegistered = false;
    let registrationDetails = null;
    let userIdeaSubmission = null;
    let userPrototypeSubmission = null;

    if (req.user && req.role === 'user') {
      const regRes = await query('SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2', [eventId, req.user.id]);
      if (regRes.rows.length > 0) {
        isRegistered = true;
        registrationDetails = { ...regRes.rows[0], _id: regRes.rows[0].id };

        const ideaRes = await query(
          `SELECT i.*, p.title as ps_title, p.ps_code, p.category as ps_category
           FROM idea_submissions i
           LEFT JOIN problem_statements p ON i.problem_statement_id = p.id
           WHERE i.event_id = $1 AND i.user_id = $2`,
          [eventId, req.user.id]
        );
        if (ideaRes.rows.length > 0) {
          const r = ideaRes.rows[0];
          userIdeaSubmission = {
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
            problemStatement: {
              id: r.problem_statement_id,
              _id: r.problem_statement_id,
              title: r.ps_title,
              psCode: r.ps_code,
              category: r.ps_category,
            },
          };
        }

        const protoRes = await query(
          'SELECT * FROM prototype_submissions WHERE event_id = $1 AND user_id = $2',
          [eventId, req.user.id]
        );
        if (protoRes.rows.length > 0) {
          const p = protoRes.rows[0];
          userPrototypeSubmission = {
            id: p.id,
            _id: p.id,
            prototypeTitle: p.prototype_title,
            description: p.description,
            githubUrl: p.github_url,
            liveDemoUrl: p.live_demo_url,
            driveUrl: p.drive_url,
            uploadedFileUrl: p.uploaded_file_url,
            uploadedFileName: p.uploaded_file_name,
            status: p.status,
            adminRemarks: p.admin_remarks,
            submittedAt: p.submitted_at,
          };
        }
      }
    }

    const now = new Date();
    const isPSReleased =
      event.schedule.psReleasedManual ||
      (event.schedule.psReleaseTime && new Date(event.schedule.psReleaseTime) <= now);

    const isPrototypeOpen =
      event.schedule.prototypeManualOverride ||
      (event.schedule.prototypeOpenTime &&
        event.schedule.prototypeCloseTime &&
        new Date(event.schedule.prototypeOpenTime) <= now &&
        now <= new Date(event.schedule.prototypeCloseTime));

    const isPrototypeClosed =
      event.schedule.prototypeCloseTime &&
      now > new Date(event.schedule.prototypeCloseTime) &&
      !event.schedule.prototypeManualOverride;

    return res.status(200).json({
      success: true,
      event,
      userState: {
        isRegistered,
        registrationDetails,
        userIdeaSubmission,
        userPrototypeSubmission,
      },
      scheduleState: {
        isPSReleased,
        isPrototypeOpen,
        isPrototypeClosed,
        currentTime: now,
      },
    });
  } catch (error) {
    console.error('Get Event By ID Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch event details.' });
  }
};

// POST /api/events/:id/register
exports.registerForEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const { rows } = await query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const event = rows[0];
    if (!event.registration_open) {
      return res.status(400).json({ success: false, message: 'Registrations are currently closed for this event.' });
    }

    if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed.' });
    }

    const { teamName, collegeOrOrg } = req.body;

    // Check duplicate
    const existing = await query('SELECT id FROM registrations WHERE event_id = $1 AND user_id = $2', [eventId, req.user.id]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event.' });
    }

    const insertRes = await query(
      `INSERT INTO registrations (event_id, user_id, team_name, college_or_org, status)
       VALUES ($1, $2, $3, $4, 'Registered')
       RETURNING *`,
      [eventId, req.user.id, teamName || `${req.user.name}'s Team`, collegeOrOrg || req.user.college || '']
    );

    return res.status(201).json({
      success: true,
      message: `Congratulations! You are successfully registered for ${event.title}.`,
      registration: { ...insertRes.rows[0], _id: insertRes.rows[0].id },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Error registering for event.' });
  }
};

// GET /api/events/user/my-events
exports.getMyEvents = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT r.id as reg_id, r.team_name, r.college_or_org, r.status as reg_status, r.registered_at,
              e.*
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = $1
       ORDER BY r.registered_at DESC`,
      [req.user.id]
    );

    const registrations = rows.map((r) => ({
      id: r.reg_id,
      _id: r.reg_id,
      teamName: r.team_name,
      collegeOrOrg: r.college_or_org,
      status: r.reg_status,
      registeredAt: r.registered_at,
      event: formatEvent(r),
    }));

    return res.status(200).json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    console.error('Get My Events Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch registered events.' });
  }
};

// POST /api/events (Admin)
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      category,
      mode,
      venue,
      startDate,
      endDate,
      time,
      status,
      registrationOpen,
      registrationDeadline,
      maxTeamSize,
      rules,
      prizes,
    } = req.body;

    let bannerImage = req.body.bannerImage || '';
    if (req.file) {
      bannerImage = `/uploads/${req.file.filename}`;
    }

    const { rows } = await query(
      `INSERT INTO events (
        title, short_description, description, banner_image, category, mode, venue,
        start_date, end_date, time, status, registration_open, registration_deadline,
        max_team_size, rules, prizes,
        ps_release_time, ps_released_manual, prototype_open_time, prototype_close_time, prototype_manual_override
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [
        title,
        shortDescription,
        description,
        bannerImage,
        category || 'Hackathon',
        mode || 'Online',
        venue || 'Virtual',
        startDate,
        endDate,
        time || '10:00 AM - 05:00 PM',
        status || 'Upcoming',
        registrationOpen !== 'false' && registrationOpen !== false,
        registrationDeadline || null,
        Number(maxTeamSize) || 4,
        typeof rules === 'string' ? rules : JSON.stringify(rules || []),
        typeof prizes === 'string' ? prizes : JSON.stringify(prizes || []),
        startDate,
        false,
        startDate,
        endDate,
        false,
      ]
    );

    return res.status(201).json({ success: true, message: 'Event created successfully.', event: formatEvent(rows[0]) });
  } catch (error) {
    console.error('Create Event Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create event.' });
  }
};

// PUT /api/events/:id (Admin)
exports.updateEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const {
      title,
      shortDescription,
      description,
      category,
      mode,
      venue,
      startDate,
      endDate,
      time,
      status,
      registrationOpen,
      registrationDeadline,
      maxTeamSize,
      rules,
      prizes,
    } = req.body;

    let bannerImage = req.body.bannerImage;
    if (req.file) {
      bannerImage = `/uploads/${req.file.filename}`;
    }

    const { rows } = await query(
      `UPDATE events
       SET title = COALESCE($1, title),
           short_description = COALESCE($2, short_description),
           description = COALESCE($3, description),
           banner_image = COALESCE($4, banner_image),
           category = COALESCE($5, category),
           mode = COALESCE($6, mode),
           venue = COALESCE($7, venue),
           start_date = COALESCE($8, start_date),
           end_date = COALESCE($9, end_date),
           time = COALESCE($10, time),
           status = COALESCE($11, status),
           registration_open = COALESCE($12, registration_open),
           registration_deadline = COALESCE($13, registration_deadline),
           max_team_size = COALESCE($14, max_team_size),
           rules = COALESCE($15, rules),
           prizes = COALESCE($16, prizes),
           updated_at = NOW()
       WHERE id = $17
       RETURNING *`,
      [
        title,
        shortDescription,
        description,
        bannerImage,
        category,
        mode,
        venue,
        startDate,
        endDate,
        time,
        status,
        registrationOpen !== undefined ? (registrationOpen === 'true' || registrationOpen === true) : null,
        registrationDeadline,
        maxTeamSize ? Number(maxTeamSize) : null,
        rules ? (typeof rules === 'string' ? rules : JSON.stringify(rules)) : null,
        prizes ? (typeof prizes === 'string' ? prizes : JSON.stringify(prizes)) : null,
        eventId,
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    return res.status(200).json({ success: true, message: 'Event updated successfully.', event: formatEvent(rows[0]) });
  } catch (error) {
    console.error('Update Event Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
};

// DELETE /api/events/:id (Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    await query('DELETE FROM events WHERE id = $1', [eventId]);
    return res.status(200).json({ success: true, message: 'Event and associated records deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
};

// PUT /api/events/:id/schedule (Admin)
exports.updateSchedule = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const { psReleaseTime, psReleasedManual, prototypeOpenTime, prototypeCloseTime, prototypeManualOverride } = req.body;

    const { rows } = await query(
      `UPDATE events
       SET ps_release_time = COALESCE($1, ps_release_time),
           ps_released_manual = COALESCE($2, ps_released_manual),
           prototype_open_time = COALESCE($3, prototype_open_time),
           prototype_close_time = COALESCE($4, prototype_close_time),
           prototype_manual_override = COALESCE($5, prototype_manual_override),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        psReleaseTime,
        psReleasedManual !== undefined ? psReleasedManual : null,
        prototypeOpenTime,
        prototypeCloseTime,
        prototypeManualOverride !== undefined ? prototypeManualOverride : null,
        eventId,
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const event = formatEvent(rows[0]);
    return res.status(200).json({
      success: true,
      message: 'Event schedule timing and override rules updated.',
      schedule: event.schedule,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update schedule.' });
  }
};
