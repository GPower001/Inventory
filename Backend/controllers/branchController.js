// import Branch from "../models/branchModel.js";

// // ✅ Create a new branch
// export const createBranch = async (req, res) => {
//   try {
//     const { name, location } = req.body;

//     if (!name) {
//       return res.status(400).json({ success: false, message: "Branch name is required" });
//     }

//     // Check if branch already exists
//     const existing = await Branch.findOne({ name });
//     if (existing) {
//       return res.status(400).json({ success: false, message: "Branch already exists" });
//     }

//     const branch = new Branch({ name, location });
//     await branch.save();

//     res.status(201).json({ success: true, data: branch });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ Get all branches
// export const getBranches = async (req, res) => {
//   try {
//     const branches = await Branch.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: branches });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ Get a single branch by ID
// export const getBranchById = async (req, res) => {
//   try {
//     const branch = await Branch.findById(req.params.id);
//     if (!branch) {
//       return res.status(404).json({ success: false, message: "Branch not found" });
//     }
//     res.status(200).json({ success: true, data: branch });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ Delete a branch
// export const deleteBranch = async (req, res) => {
//   try {
//     const branch = await Branch.findByIdAndDelete(req.params.id);
//     if (!branch) {
//       return res.status(404).json({ success: false, message: "Branch not found" });
//     }
//     res.status(200).json({ success: true, message: "Branch deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


import Branch from "../models/branchModel.js";

// Add a new branch
export const createBranch = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Branch name is required" });
    }

    // Check if branch with same name exists
    const existing = await Branch.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: "Branch already exists" });
    }

    const branch = new Branch({ name, location });
    await branch.save();

    res.status(201).json({ success: true, data: branch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all branches
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().select("_id name location");
    res.status(200).json({ success: true, data: branches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

