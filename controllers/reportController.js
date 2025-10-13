const db = require('../models');
const Reports = db.Reports;
const IncidentTypes = db.IncidentTypes;
const StatusTypes = db.StatusTypes


exports.CreateReport = async (req, res) => {
  try {
    const {
      user_id, // can be null for anonymity, but must be handled
      description,
      date_of_incident,
      location,
      status_id, // FK to StatusTypes
      incident_type_id, // FK to IncidentTypes
      assigned_counsellor_id,
      evidence_path
    } = req.body;

    if (!description || !location || !incident_type_id || !status_id) {
      return res.status(400).json({
        error: 'Description, location, status, and incident type are required'
      });
    }

    // Optional: validate status and incident type exist
    const status = await StatusTypes.findByPk(status_id);
    const incidentType = await IncidentTypes.findByPk(incident_type_id);

    if (!status || !incidentType) {
      return res.status(400).json({ error: 'Invalid status or incident type ID' });
    }

    const newReport = await Reports.create({
      user_id: user_id || null, // allow null for anonymity
      description,
      date_of_incident,
      location,
      status_id,
      incident_type_id,
      assigned_counsellor_id,
      evidence_path
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

    // Validate if user exists and has role 'counsellor'
    const counsellor = await Users.findOne({
      where: { id: counsellorId },
      include: {
        model: UserRoles,
        as: 'role',
        attributes: ['name']
      }
    });

    if (!counsellor || counsellor.role.name.toLowerCase() !== 'counsellor') {
      return res.status(403).json({ error: 'User is not a counsellor' });
    }

    // Fetch reports linked to this counsellor
    const reports = await Reports.findAll({
      where: { assigned_counsellor_id: counsellorId }
    });

    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No reports found for this counsellor' });
    }

    return res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports by counsellor ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.GetReportsBySurvivor = async (req, res) => {
  try {
    const survivorId = req.params.id;

    // Validate if user exists and has role 'survivor'
    const survivor = await Users.findOne({
      where: { id: survivorId },
      include: {
        model: UserRoles,
        as: 'role',
        attributes: ['name']
      }
    });

    if (!survivor || survivor.role.name.toLowerCase() !== 'survivor') {
      return res.status(403).json({ error: 'User is not a survivor' });
    }

    // Fetch reports linked to this survivor
    const reports = await Reports.findAll({
      where: { user_id: survivorId }
    });

    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No reports found for this counsellor' });
    }

    return res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports by counsellor ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.AssignCounsellorToReport = async (req, res) => {
  try{
    const { reportId} = req.params;
    const {counsellorId} = req.body; //difference between req.params and body?

    const report = await Reports.findByPk(reportId);
    if(!report){
      return res.status(404).json({error: "Report Not Found."})
    }

    const counsellor = await Users.findOne({
      where: {id: counsellorId}, //find a key where it equals the counsellor key
      include: ['role']
    });

    if (!counsellor || counsellor.role.name !== 'counsellor') {
      return res.status(403).json({ error: 'User is not a counsellor' });
    }

    // Assign counsellor to report
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
      where: { location },
      include: {
        model: IncidentTypes,
        as: 'incidentType',
        attributes: ['id', 'name']
      }
    });

    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No incident types found for this location' });
    }

    // Extract unique incident types
    const uniqueTypes = [];
    const seen = new Set();

    reports.forEach(report => {
      const type = report.incidentType;
      if (type && !seen.has(type.id)) {
        seen.add(type.id);
        uniqueTypes.push(type);
      }
    });

    return res.status(200).json(uniqueTypes);
  } catch (error) {
    console.error('Error fetching incident types by location:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


