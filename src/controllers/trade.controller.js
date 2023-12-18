import * as Yup from "yup";
import ValidationError from "../utils/ApiError";
import { Buy, Sell } from "../utils/TradingFactory";

let tradeController = {
  trade: async (req, res, next) => {
    try {
      // Schema creation
      const schema = Yup.array(
        Yup.object().shape({
          type: Yup.string().required().matches(/(buy|sell)/),
          symbol: Yup.string().required().matches(/^[A-Z]{3}$/),
          qty: Yup.number().required().integer().min(1).max(1000),
        })
      );
      // Schema validation
      if (!(await schema.isValid(req.body))) throw new ValidationError();

      // Object to track quantities based on symbols
      const mergedQuantities = {};
      req.body.forEach(trade => {
        const { type, symbol, qty } = trade;
        if (type === 'buy') mergedQuantities[symbol] = (mergedQuantities[symbol] || 0) + qty;
        else if (type === 'sell') mergedQuantities[symbol] = (mergedQuantities[symbol] || 0) - qty;
      });

      // Convert mergedQuantities to an array for easy iteration
      const mergedQuantitiesArray = Object
        .entries(mergedQuantities)
        .map(([symbol, quantity]) => ({ symbol, quantity }));

      // Loop through the mergedQuantitiesArray
      for (const item of mergedQuantitiesArray) {
        var newTrade = item.quantity > 0
          ? new Buy(req.userId, item)
          : new Sell(req.userId, item);

        await newTrade.validate();
        await newTrade.commit();
      }

      return res.status(200);
    } catch (error) {
      next(error);
    }
  },
};

export default tradeController;
