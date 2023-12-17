import * as Yup from "yup";
import Share from "../models/Share";
import Portfolio from "../models/Portfolio";
import PortfolioItem from "../models/PortfolioItem";
import {
  BadRequestError,
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
          qty: Yup.number().required().integer().min(1).max(1000),
        })
      );
      // Schema validation
      if (!(await schema.isValid(req.body))) throw new ValidationError();

      // Validate portfolio
      const portfolio = await Portfolio.findOne({ where: { userId: req.userId } });
      if (!portfolio) throw new BadRequestError("You need to create your portfolio before start trading!");

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
        const share = await Share.findOne({ where: { symbol: item.symbol } });
        if (!share) throw new BadRequestError("Share symbol not found!");

        // Save DB
        await PortfolioItem.create({
          portfolioId: portfolio.id,
          shareId: share.id,
          price: share.price,
          qty: item.quantity
        });

        share.qty -= item.quantity;
        await Share.update({ qty: share.qty }, { where: { id: share.id } });
        /*
        else if (item.quantity > share.qty) throw new BadRequestError("Not enough share to buy!");

        // Get portfolio item if any
        const portfolioItem = portfolio.PortfolioItems.find(x => x.shareId === share.id);
        if (!portfolioItem) {
          if (item.quantity < 0) throw new BadRequestError("You don't have this share!");
          else if (item.quantity > 0) {
            //Save to db
            portfolio.PortfolioItems.push(new PortfolioItem({
              shareId: share.id,
              price: share.price,
              qty: item.quantity
            }));
            share.qty -= item.quantity;

            portfolio.save();
            share.save();
          }


        }
        else {

          if (item.quantity < 0) {
            if (Math.abs(item.quantity) > portfolioItem.qty) throw new BadRequestError("Not enough share to sell!");
            portfolioItem.qty -= item.quantity;
          }
          else if (item.quantity > 0) {
            //Save to db
            portfolio.PortfolioItems.push(new PortfolioItem({
              shareId: share.id,
              price: share.price,
              qty: item.quantity
            }));
            share.qty -= item.quantity;

            portfolio.save();
            share.save();
          }
        }*/
      }


      //return res.status(200).json(portfolio);
      return res.status(200).json(mergedQuantitiesArray);
    } catch (error) {
      next(error);
    }
  },
};

export default tradeController;
