import * as Yup from "yup";
import Share from "../models/Share";
import Portfolio from "../models/Portfolio";
import {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError";

let portfolioController = {
  add: async (req, res, next) => {
    try {
      // Schema creation
      const schema = Yup.object().shape({
        name: Yup.string().required()
      });

      // Schema validation
      if (!(await schema.isValid(req.body))) throw new ValidationError();

      const { name } = req.body;

      const portfolioExists = await Portfolio.findOne({
        where: { name },
      });

      if (portfolioExists) throw new BadRequestError("Already exist!");

      const portfolio = await Portfolio.create({
        userId: req.userId,
        name: name
      });

      return res.status(200).json(portfolio);
    } catch (error) {
      next(error);
    }
  },

  addPortfolio: async (req, res, next) => {
    try {
      const { body, userId } = req;

      const schema = Yup.object().shape({
        city: Yup.string().required(),
        state: Yup.string().required(),
        neighborhood: Yup.string().required(),
        country: Yup.string().required(),
      });

      if (!(await schema.isValid(body.address))) throw new ValidationError();

      const user = await User.findByPk(userId);

      let address = await Share.findOne({
        where: { ...body.address },
      });

      if (!address) {
        address = await Share.create(body.address);
      }

      await user.addAddress(address);

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
};

export default portfolioController;
