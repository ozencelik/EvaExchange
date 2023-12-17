import * as Yup from "yup";
import Share from "../models/Share";
import User from "../models/User";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/ApiError";

let tradeController = {
  trade: async (req, res, next) => {
    try {
      // Schema creation
      const schema = Yup.array(
        Yup.object().shape({
          type: Yup.string().required().matches(/(buy|sell)/),
          symbol: Yup.string().required().matches(/^[A-Z]{3}$/),
          qty: Yup.number().required().integer().min(0).max(1000,),
        })
      );

      // Schema validation
      if (!(await schema.isValid(req.body))) throw new ValidationError();



      const trades = req.body;
      // Object to track quantities based on symbols
      const mergedQuantities = {};// // Iterate through transactions and update quantities
      trades.forEach(trade => {
        const { type, symbol, qty } = trade;

        if (type === 'buy') {
          // If it's a buy trade, add to the quantity
          mergedQuantities[symbol] = (mergedQuantities[symbol] || 0) + qty;
        } else if (type === 'sell') {
          // If it's a sell trade, subtract from the quantity
          mergedQuantities[symbol] = (mergedQuantities[symbol] || 0) - qty;
        }
      });


      // Convert mergedQuantities to an array for easy iteration
      const mergedQuantitiesArray = Object.entries(mergedQuantities).map(([symbol, quantity]) => ({ symbol, quantity }));

      // Loop through the mergedQuantitiesArray
      mergedQuantitiesArray.forEach(item => {
        console.log(`Symbol: ${item.symbol}, Quantity: ${item.quantity}`);

        const share = Share.findOne({ where: { symbol: item.symbol } });
        if (!share) return BadRequestError("Share symbol not found!");
        else if(item.quantity > share.qty) return BadRequestError("Not enough share to buy!");
      });


      return res.status(200).json(mergedQuantities);
    } catch (error) {
      next(error);
    }
  },
};

export default tradeController;
