import * as Yup from "yup";
import Share from "../models/Share";
import { BadRequestError, ValidationError } from "../utils/ApiError";

let shareController = {
  add: async (req, res, next) => {
    try {
      const schema = Yup.object().shape({
        symbol: Yup.string().required().matches(/^[A-Z]{3}$/),
        price: Yup.number().required().positive(),
      });

      if (!(await schema.isValid(req.body))) throw new ValidationError();

      const shareExists = await Share.findOne({
        where: { ...req.body },
      });

      if (shareExists) throw new BadRequestError();

      const share = await Share.create(req.body);

      return res.status(200).json(share);
    } catch (error) {
      next(error);
    }
  },
};

export default shareController;
