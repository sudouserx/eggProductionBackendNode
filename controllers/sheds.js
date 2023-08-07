import mongoose from "mongoose";
import record from "../models/Record";
import shed from "../models/Shed";

/**
 * READ: Get all sheds.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getSheds = async (req, res) => {
  try {
    const sheds = await shed.find();
    res.status(200).json(sheds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * READ: Get records by shedId.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getRecordsByshed = async (req, res) => {
  try {
    const shedId = req.params.shedId;
    const records = await record.find({ shedId });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * READ: Get record by recordId.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getRecordById = async (req, res) => {
  // No route yet
  try {
    const recordId = req.params.recordId;
    const record = await record.findById(recordId);
    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * READ: Get egg production percentage by shedId and date range.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const eggProductionPercentageByShed = async (req, res) => {
  try {
    const shedId = req.params.shedId;
    const from = req.query.from || new Date().toISOString();
    const to = req.query.to || new Date().toISOString();

    const shed = await shed.findById(shedId);
    if (!shed) {
      return res.status(404).json({ error: "Shed not found" });
    }

    const records = await record.aggregate([
      {
        $match: {
          shedId,
          createdAt: { $gte: new Date(from), $lte: new Date(to) },
        },
      },
      {
        $group: {
          _id: null,
          totalEggCount: { $sum: "$eggCount" },
          totalHenCount: { $sum: "$henCount" },
        },
      },
    ]);

    const eggProductionPercentage =
      (records[0]?.totalEggCount / records[0]?.totalHenCount) * 100 || 0;

    res.status(200).json({ eggProductionPercentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * READ: Get hen mortality percentage by shedId and date range.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const henMortalityPercentageByShed = async (req, res) => {
  try {
    const shedId = req.params.shedId;
    const from = req.query.from || new Date().toISOString();
    const to = req.query.to || new Date().toISOString();

    const shed = await shed.findById(shedId);
    if (!shed) {
      return res.status(404).json({ error: "Shed not found" });
    }

    const initialRecord = await record.findOne({
      shedId,
      createdAt: { $eq: new Date(from) },
    });
    const finalRecord = await record.findOne({
      shedId,
      createdAt: { $eq: new Date(to) },
    });

    const initialHenCount = initialRecord?.henCount || 0;
    const finalHenCount = finalRecord?.henCount || 0;

    const henMortalityPercentage =
      ((initialHenCount - finalHenCount) / initialHenCount) * 100 || 0;

    res.status(200).json({ henMortalityPercentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * CREATE: Create a new shed.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const createShed = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shedName, initialHenCount, initialFeedPerKg } = req.body;

    const newShed = new shed({
      userId,
      shedName,
      initialHenCount,
      initialFeedPerKg,
    });

    await newShed.save();

    res.status(201).json(newShed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * CREATE: Save daily record by shedId.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const saveDailyRecordByShed = async (req, res) => {
  try {
    const shedId = req.params.shedId;
    const shed = await shed.findById(shedId);
    if (!shed) {
      return res.status(404).json({ error: "Shed not found" });
    }
    const { treyCount, feedPerKg, henCount } = req.body;

    const eggCount = treyCount * 300; // 300 is the egg count per trey

    const newRecord = new record({
      shedId,
      treyCount,
      eggCount,
      feedPerKg,
      henCount,
    });

    await newRecord.save();

    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
