const db = require('../models');
const Reports = db.Reports;
const IncidentTypes = db.IncidentTypes;
const StatusTypes = db.StatusTypes;
const Users = db.Users;
const UserRoles = db.UserRoles;
const Sequelize = db.Sequelize;

//const defaultStatusId = 1; // Replace with your actual default status ID
//const finalStatusId = status_id || defaultStatusId;


exports.CreateReport = async (req, res) => {
  try {
    const {
      description,
      date_of_incident: rawDate,
      location,
      incident_type_id,
      assigned_counsellor_id,
      evidence_path,
    } = req.body;

    // 🩹 Patch: Normalize empty date string
    const date_of_incident = rawDate && rawDate.trim() !== "" ? rawDate : null;

    console.log('Resolved user_id:', req.user);

    const user_id = req.user?.id || null;

    if (!description || !location || !incident_type_id) {
      return res.status(400).json({
        error: 'Description, location, and incident type are required'
      });
    }

    const incidentType = await IncidentTypes.findByPk(incident_type_id);
    if (!incidentType) {
      return res.status(400).json({ error: 'Invalid incident type ID' });
    }

    const newReport = await Reports.create({
      user_id,
      description,
      date_of_incident, // ✅ Now safely null if empty
      location,
      incident_type_id,
      assigned_counsellor_id,
      evidence_path,
      status_id: 1
    });

    return res.status(201).json({
      message: 'Report created successfully',
      report: newReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return res.status(500).json({ error: error.message });
  }
};

exports.GetAllReports = async (req, res) => {
  try {
    const { type } = req.query;

    const where = type ? { incident_type_id: type } : {};

    const reports = await Reports.findAll({
      where,
      include: [
        { model: IncidentTypes, as: 'IncidentType', attributes: ['id', 'name'] },
        { model: StatusTypes, as: 'StatusType', attributes: ['id', 'name'] }
      ]
    });

    return res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.GetReportById = async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await Reports.findByPk(reportId, {
      include: [
        { model: IncidentTypes, as: 'IncidentType', attributes: ['id', 'name'] },
        { model: StatusTypes, as: 'StatusType', attributes: ['id', 'name'] }
      ]
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.GetReportsByCounsellor = async (req, res) => {
  try {
    const counsellorId = req.params.id;

    const counsellor = await Users.findByPk(counsellorId);

    if (!counsellor) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (counsellor.role_id !== 2) {
      return res.status(403).json({ error: 'User is not a counsellor' });
    }

    const reports = await Reports.findAll({
      where: { assigned_counsellor_id: counsellorId }
    });

    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No reports found for this counsellor' });
    }

    return res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports for counsellor:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.GetReportsBySurvivor = async (req, res) => {
  try {
    const survivorId = req.params.id;

    const survivor = await Users.findByPk(survivorId);

    if (!survivor) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (survivor.role_id !== 1) {
      return res.status(403).json({ error: 'User is not a survivor' });
    }

    const reports = await Reports.findAll({
      where: { user_id: survivorId }
    });

    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No reports found for this user.' });
    }

    return res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports for survivor:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.AssignCounsellorToReport = async (req, res) => {
  try {
    const { id: reportId } = req.params;
    const { counsellorId } = req.body; // Correct: from JSON


    const report = await Reports.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report Not Found." });
    }

    const counsellor = await Users.findByPk(counsellorId);
    if (!counsellor) {
      return res.status(404).json({ error: "Counsellor user not found" });
    }

    if (counsellor.role_id !== 2) { 
      return res.status(403).json({ error: 'User is not a counsellor' });
    }

    report.counsellor_id = counsellorId;
    await report.save();

    return res.status(200).json({
      message: 'Counsellor assigned successfully',
      report
    });
  } catch (error) {
    console.error('Error assigning counsellor:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.GetIncidentTypesByLocation = async (req, res) => {
  try {
    const location = req.params.location;

    const reports = await Reports.findAll({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('Reports.location')),
        location.toLowerCase()
      ),
      include: {
        model: IncidentTypes,
        as: 'IncidentType', // match association alias used elsewhere
        attributes: ['id', 'name']
      }
    });

    const uniqueTypes = [];
    const seen = new Set();

    reports.forEach(report => {
      const type = report.IncidentType;
      if (type && !seen.has(type.id)) {
        seen.add(type.id);
        uniqueTypes.push(type);
      }
    });

    return res.status(200).json(uniqueTypes);
  } catch (error) {
    console.error('Error fetching incident types by location:', error.message || error);

    const orig = error.original || (error.parent && error.parent.original);
    if (orig) {
      console.error('SQL:', orig.sql || orig);
      if (Array.isArray(orig.errors)) {
        orig.errors.forEach((e, i) =>
          console.error(`RequestError[${i}]:`, e.message, 'number=', e.number, 'state=', e.state)
        );
      } else if (orig.message) {
        console.error('Original error message:', orig.message);
      } else {
        console.error('Original error object:', orig);
      }
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.GetReportStatusSummary = async (req, res) => {
  try {
    const summary = await Reports.findAll({
      attributes: [
        'status_id',                                 // FK on Reports
        [Sequelize.col('StatusType.name'), 'status_name'], // use joined alias used by Sequelize
        [Sequelize.fn('COUNT', Sequelize.col('Reports.id')), 'count'] // count rows
      ],
      include: {
        model: StatusTypes,
        as: 'StatusType',       // explicit alias to match the JOIN alias
        attributes: ['id', 'name']
      },
      group: [
        Sequelize.col('Reports.status_id'),
        Sequelize.col('StatusType.id'),
        Sequelize.col('StatusType.name')
      ],
      raw: true
    });

    return res.json(summary);
  } catch (err) {
    console.error("Status summary error:", err.message || err);

    const orig = err.original || (err.parent && err.parent.original);
    if (orig) {
      console.error('SQL:', orig.sql || orig);
      if (Array.isArray(orig.errors)) {
        orig.errors.forEach((e, i) => {
          console.error(`RequestError[${i}]:`, e.message, 'number=', e.number, 'state=', e.state);
        });
      } else if (orig.message) {
        console.error('Original error message:', orig.message);
      } else {
        console.error('Original error object:', orig);
      }
    }

    return res.status(500).json({ error: "Failed to fetch report status summary." });
  }
};


exports.GetIncidentTypeSummary = async (req, res) => {
  try {
    const summary = await Reports.findAll({
      attributes: [
        'incident_type_id',                                      // FK on Reports
        [Sequelize.col('IncidentType.name'), 'incident_type'],   // readable label via association alias
        [Sequelize.fn('COUNT', Sequelize.col('Reports.id')), 'count']
      ],
      include: {
        model: IncidentTypes,
        as: 'IncidentType',                                      // must match association used in other queries
        attributes: ['id', 'name']
      },
      group: [
        Sequelize.col('Reports.incident_type_id'),
        Sequelize.col('IncidentType.id'),
        Sequelize.col('IncidentType.name')
      ],
      raw: true
    });

    return res.json(summary);
  } catch (err) {
    console.error("Type summary error:", err.message || err);

    const orig = err.original || (err.parent && err.parent.original);
    if (orig) {
      console.error('SQL:', orig.sql || orig);
      if (Array.isArray(orig.errors)) {
        orig.errors.forEach((e, i) => {
          console.error(`RequestError[${i}]:`, e.message, 'number=', e.number, 'state=', e.state);
        });
      } else if (orig.message) {
        console.error('Original error message:', orig.message);
      } else {
        console.error('Original error object:', orig);
      }
    }

    return res.status(500).json({ error: "Failed to fetch report type summary." });
  }
};

exports.getIncidentTypes = async (req, res) => {
  try {
    // Fetch incident types from the database with id and name
    const incidentTypes = await IncidentTypes.findAll({
      attributes: ['id', 'name']
    });

    res.status(200).json({ incidentTypes });
  } catch (error) {
    console.error('Error fetching incident types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

