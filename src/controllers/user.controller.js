import * as Yup from "yup";
import Portfolio from "../models/Portfolio";
import User from "../models/User";
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError";

let userController = {
  add: async (req, res, next) => {
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

  update: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        password: Yup.string()
          .min(6)
          .when("oldPassword", (oldPassword, field) => {
            if (oldPassword) {
              return field.required();
            } else {
              return field;
            }
          }),
        confirmPassword: Yup.string().when("password", (password, field) => {
          if (password) {
            return field.required().oneOf([Yup.ref("password")]);
          } else {
            return field;
          }
        }),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      const { email, oldPassword } = req.body;

      const user = await User.findByPk(req.userId);

      if (email) {
        const userExists = await User.findOne({
          where: { email },
        });

        if (!userExists) throw new BadRequestError();
      }

      if (oldPassword && !(await user.checkPassword(oldPassword)))
        throw new UnauthorizedError();

      const newUser = await user.update(req.body);

      return res.status(200).json(newUser);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) throw new BadRequestError();

      user.destroy();

      return res.status(200).json({ msg: "Deleted" });
    } catch (error) {
      next(error);
    }
  },


  //Portfolio
  createPortfolio: async (req, res, next) => {
    try {
      // Schema creation
      const schema = Yup.object().shape({
        name: Yup.string().optional() // Optional
      });

      // Schema validation
      if (!(await schema.isValid(req.body))) throw new ValidationError();

      const portfolioExists = await Portfolio.findOne({
        where: { userId: req.userId },
      });

      if (portfolioExists) throw new BadRequestError("Already exist!");

      const { name } = req.body;
      const portfolio = await Portfolio.create({
        userId: req.userId,
        name: name || 'Portfolio-'.concat(req.userId)
      });

      return res.status(200).json(portfolio);
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
