// import { registerUser, loginUser } from "../services/authService.js";

// const register = async (req, res) => {
//   try {
//     const response = await registerUser(req.body);
//     res.status(201).json(response);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const response = await loginUser(req.body);
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// export { register, login };


import { registerUser, loginUser } from "../services/authService.js";

const register = async (req, res) => {
  try {
    const { name, role, branchId, branchName, branchLocation, password } = req.body;

    const response = await registerUser({ name, role, branchId, branchName, branchLocation, password });
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const response = await loginUser({ name, password });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { register, login };
