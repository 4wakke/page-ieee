import {errorResponse} from "../controllers/helpers.js"

export const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.parse(req.body);
    next();
  } catch (error) {
    if (Array.isArray(error.errors)) {
        return errorResponse(res,error.errors.map((error) => error.message),400)
    }

    return res.status(400).json(error.message);

  }
};