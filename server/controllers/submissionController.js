const { query } = require('../config/db');

// POST /api/events/:eventId/submissions/idea
exports.submitIdea = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    const { problemStatementId, ideaTitle, ideaDescription, techStack, externalLinks } = req.body;

    const { rows: eventRows } = await query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Verify user registration
    const { rows: regRows } = await query(
      'SELECT id FROM registrations WHERE event_id = $1 AND user_id = $2',
      [eventId, req.user.id]
    );
    if (regRows.length === 0) {
      return res.status(403).json({ success: false, message: 'You must register for this event before submitting an idea.' });
    }

    // Verify problem statement
    const { rows: psRows } = await query(
      'SELECT id FROM problem_statements WHERE id = $1 AND event_id = $2',
      [Number(problemStatementId), eventId]
    );
    if (psRows.length === 0) {
      return res.status(400).json({ success: false, message: 'Selected problem statement is invalid for this event.' });
    }

    let fileUrl = '';
    let fileName = '';
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
    }

    const techStackJson = typeof techStack === 'string' ? techStack : JSON.stringify(techStack || []);
    const extLinksJson = typeof externalLinks === 'string' ? externalLinks : JSON.stringify(externalLinks || {});

    // Check if exists
    const { rows: existing } = await query(
      'SELECT id FROM idea_submissions WHERE event_id = $1 AND user_id = $2',
      [eventId, req.user.id]
    );

    let submission;
    if (existing.length > 0) {
      const updateRes = await query(
        `UPDATE idea_submissions
         SET problem_statement_id = $1,
             idea_title = $2,
             idea_description = $3,
             tech_stack = $4,
             supporting_file_url = CASE WHEN $5 <> '' THEN $5 ELSE supporting_file_url END,
             supporting_file_name = CASE WHEN $6 <> '' THEN $6 ELSE supporting_file_name END,
             external_links = $7,
             submitted_at = NOW()
         WHERE event_id = $8 AND user_id = $9
         RETURNING *`,
        [Number(problemStatementId), ideaTitle, ideaDescription, techStackJson, fileUrl, fileName, extLinksJson, eventId, req.user.id]
      );
      submission = updateRes.rows[0];
    } else {
      const insertRes = await query(
        `INSERT INTO idea_submissions (
           event_id, user_id, problem_statement_id, idea_title, idea_description,
           tech_stack, supporting_file_url, supporting_file_name, external_links
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [eventId, req.user.id, Number(problemStatementId), ideaTitle, ideaDescription, techStackJson, fileUrl, fileName, extLinksJson]
      );
      submission = insertRes.rows[0];
    }

    return res.status(200).json({
      success: true,
      message: 'Idea proposal saved successfully.',
      submission: { ...submission, _id: submission.id },
    });
  } catch (error) {
    console.error('Submit Idea Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit idea proposal.' });
  }
};

// POST /api/events/:eventId/submissions/prototype
exports.submitPrototype = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    const { prototypeTitle, description, githubUrl, liveDemoUrl, driveUrl } = req.body;

    const { rows: eventRows } = await query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const event = eventRows[0];
    const now = new Date();
    const isManualOverride = event.prototype_manual_override;
    const isOpen =
      isManualOverride ||
      (event.prototype_open_time &&
        event.prototype_close_time &&
        new Date(event.prototype_open_time) <= now &&
        now <= new Date(event.prototype_close_time));

    if (!isOpen) {
      if (event.prototype_open_time && now < new Date(event.prototype_open_time)) {
        return res.status(403).json({
          success: false,
          message: `Prototype submission window opens on ${new Date(event.prototype_open_time).toLocaleString()}.`,
        });
      }
      return res.status(403).json({
        success: false,
        message: 'The prototype submission deadline has passed. Submissions are now closed.',
      });
    }

    // Check Stage 1 idea exists
    const { rows: ideaRows } = await query(
      'SELECT id, problem_statement_id FROM idea_submissions WHERE event_id = $1 AND user_id = $2',
      [eventId, req.user.id]
    );
    if (ideaRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'You must submit an initial idea proposal before submitting your prototype.',
      });
    }

    const idea = ideaRows[0];
    let fileUrl = '';
    let fileName = '';
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
    }

    const { rows: existing } = await query(
      'SELECT id FROM prototype_submissions WHERE event_id = $1 AND user_id = $2',
      [eventId, req.user.id]
    );

    let prototype;
    if (existing.length > 0) {
      const updateRes = await query(
        `UPDATE prototype_submissions
         SET prototype_title = $1,
             description = $2,
             github_url = COALESCE($3, github_url),
             live_demo_url = COALESCE($4, live_demo_url),
             drive_url = COALESCE($5, drive_url),
             uploaded_file_url = CASE WHEN $6 <> '' THEN $6 ELSE uploaded_file_url END,
             uploaded_file_name = CASE WHEN $7 <> '' THEN $7 ELSE uploaded_file_name END,
             submitted_at = NOW()
         WHERE event_id = $8 AND user_id = $9
         RETURNING *`,
        [prototypeTitle, description, githubUrl, liveDemoUrl, driveUrl, fileUrl, fileName, eventId, req.user.id]
      );
      prototype = updateRes.rows[0];
    } else {
      const insertRes = await query(
        `INSERT INTO prototype_submissions (
           event_id, user_id, problem_statement_id, idea_submission_id,
           prototype_title, description, github_url, live_demo_url, drive_url,
           uploaded_file_url, uploaded_file_name
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [eventId, req.user.id, idea.problem_statement_id, idea.id, prototypeTitle, description, githubUrl || '', liveDemoUrl || '', driveUrl || '', fileUrl, fileName]
      );
      prototype = insertRes.rows[0];
    }

    return res.status(200).json({
      success: true,
      message: 'Prototype submitted successfully!',
      submission: { ...prototype, _id: prototype.id },
    });
  } catch (error) {
    console.error('Submit Prototype Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit prototype.' });
  }
};

// GET /api/events/:eventId/submissions/mine
exports.getMySubmissions = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);

    const ideaRes = await query(
      `SELECT i.*, p.title as ps_title, p.ps_code, p.category as ps_category
       FROM idea_submissions i
       LEFT JOIN problem_statements p ON i.problem_statement_id = p.id
       WHERE i.event_id = $1 AND i.user_id = $2`,
      [eventId, req.user.id]
    );

    const protoRes = await query(
      `SELECT pr.*, p.title as ps_title, p.ps_code
       FROM prototype_submissions pr
       LEFT JOIN problem_statements p ON pr.problem_statement_id = p.id
       WHERE pr.event_id = $1 AND pr.user_id = $2`,
      [eventId, req.user.id]
    );

    let idea = null;
    if (ideaRes.rows.length > 0) {
      const r = ideaRes.rows[0];
      idea = {
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

    let prototype = null;
    if (protoRes.rows.length > 0) {
      const p = protoRes.rows[0];
      prototype = {
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

    return res.status(200).json({ success: true, idea, prototype });
  } catch (error) {
    console.error('Get My Submissions Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch your submissions.' });
  }
};
