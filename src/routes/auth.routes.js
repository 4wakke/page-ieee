import Router from "express-promise-router";
import {
  signin,
  signup,
  signout,
  profile,
  payment,
  processPayment,
  checkPaymentStatus,
  getAllUsers,
  getUser,
  updateUser
} from "../controllers/auth.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { signinSchema, signupSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/signin", validateSchema(signinSchema), signin);

router.post("/signup", validateSchema(signupSchema), signup); 

router.post("/signout", signout);

router.post("/payment", payment);

router.get("/profile", isAuth, profile);

router.post("/processPayment", processPayment);

router.get("/checkPaymentStatus",checkPaymentStatus);

router.get('/users', getAllUsers);

router.get('/userDetail', getUser);

router.put('/users/:id', updateUser);

export default router;
