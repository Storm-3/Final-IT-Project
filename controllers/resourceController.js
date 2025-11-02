// controllers/resourceController.js
const db = require("../models");
const ResourceDirectories = db.ResourceDirectories;

// CREATE RESOURCE
exports.CreateResource = async (req, res) => {
  try {
    const resourceData = req.body;

    // Check for duplicate email
    const existing = await ResourceDirectories.findOne({
      where: { email: resourceData.email },
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Resource with this email already exists." });
    }

    const newResource = await ResourceDirectories.create(resourceData);

    return res.status(201).json({
      message: "Resource created successfully",
      resource: {
        id: newResource.id,
        name: newResource.name,
        type: newResource.type,
        description: newResource.description,
        phone_number: newResource.phone_number,
        email: newResource.email,
        address: newResource.address,
        website: newResource.website,
      },
    });
  } catch (error) {
    console.error("Error creating resource:", error);
    return res.status(400).json({ error: error.message });
  }
};

// GET ALL RESOURCES (with optional type filter)
exports.GetAllResources = async (req, res) => {
  try {
    const { type } = req.query;
    const where = type ? { type } : {};

    const resources = await ResourceDirectories.findAll({ where });
    return res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET RESOURCE BY ID
exports.GetResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await ResourceDirectories.findByPk(id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    return res.status(200).json(resource);
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE RESOURCE BY ID
exports.UpdateResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = [
      "name",
      "description",
      "email",
      "phone_number",
      "address",
      "website",
      "type",
    ];
    const updates = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const resource = await ResourceDirectories.findByPk(id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    await resource.update(updates);
    return res.status(200).json({
      message: "Resource updated successfully",
      resource: resource,
    });
  } catch (error) {
    console.error("Error updating resource:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE RESOURCE BY ID
exports.DeleteResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await ResourceDirectories.findByPk(id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    await resource.destroy();
    return res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
