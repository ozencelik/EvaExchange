import * as Yup from "yup";
import Share from "../models/Share";
import User from "../models/User";
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError";

let tradeController = {
  trade: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      const { email } = req.body;

      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) throw new BadRequestError();

      const user = await User.create(req.body);

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
};

export default tradeController;
