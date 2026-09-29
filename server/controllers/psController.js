const { query } = require('../config/db');

function formatPS(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    event: row.event_id,
    eventId: row.event_id,
    psCode: row.ps_code,
    title: row.title,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty,
    attachments: typeof row.attachments === 'string' ? JSON.parse(row.attachments) : row.attachments || [],
    createdAt: row.created_at,
  };
}

// GET /api/events/:eventId/problem-statements
exports.getEventProblemStatements = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    const { rows: eventRows } = await query('SELECT * FROM events WHERE id = $1', [eventId]);

    if (eventRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const event = eventRows[0];
    const isAdmin = req.role === 'admin' || req.role === 'superadmin';
    const now = new Date();
    const isReleased =
      isAdmin ||
      event.ps_released_manual ||
      (event.ps_release_time && new Date(event.ps_release_time) <= now);

    if (!isReleased) {
      return res.status(403).json({
        success: false,
        isReleased: false,
        releaseTime: event.ps_release_time,
        message: `Problem statements for this event will be released on ${new Date(
          event.ps_release_time
        ).toLocaleString()}.`,
      });
    }

    // If regular user, ensure they are registered for this event
    if (!isAdmin && req.user) {
      const { rows: regRows } = await query(
        'SELECT id FROM registrations WHERE event_id = $1 AND user_id = $2',
        [eventId, req.user.id]
      );
      if (regRows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'You must be registered for this event to view problem statements.',
        });
      }
    }

    const { rows: statements } = await query(
      'SELECT * FROM problem_statements WHERE event_id = $1 ORDER BY ps_code ASC',
      [eventId]
    );

    return res.status(200).json({
      success: true,
      isReleased: true,
      count: statements.length,
      statements: statements.map(formatPS),
    });
  } catch (error) {
    console.error('Get Problem Statements Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve problem statements.' });
  }
};

// POST /api/events/:eventId/problem-statements (Admin)
exports.createProblemStatement = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    const { psCode, title, description, category, difficulty, attachments } = req.body;

    const { rows } = await query(
      `INSERT INTO problem_statements (event_id, ps_code, title, description, category, difficulty, attachments)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        eventId,
        psCode || `PS-${Date.now().toString().slice(-4)}`,
        title,
        description,
        category || 'General',
        difficulty || 'Medium',
        typeof attachments === 'string' ? attachments : JSON.stringify(attachments || []),
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Problem statement added successfully.',
      statement: formatPS(rows[0]),
    });
  } catch (error) {
    console.error('Create PS Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create problem statement.' });
  }
};

// PUT /api/problem-statements/:id (Admin)
exports.updateProblemStatement = async (req, res) => {
  try {
    const psId = Number(req.params.id);
    const { psCode, title, description, category, difficulty } = req.body;

    const { rows } = await query(
      `UPDATE problem_statements
       SET ps_code = COALESCE($1, ps_code),
           title = COALESCE($2, title),
           description = COALESCE($3, description),
           category = COALESCE($4, category),
           difficulty = COALESCE($5, difficulty)
       WHERE id = $6
       RETURNING *`,
      [psCode, title, description, category, difficulty, psId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Problem statement not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Problem statement updated successfully.',
      statement: formatPS(rows[0]),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update problem statement.' });
  }
};

// DELETE /api/problem-statements/:id (Admin)
exports.deleteProblemStatement = async (req, res) => {
  try {
    const psId = Number(req.params.id);
    await query('DELETE FROM problem_statements WHERE id = $1', [psId]);
    return res.status(200).json({ success: true, message: 'Problem statement deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete problem statement.' });
  }
};
