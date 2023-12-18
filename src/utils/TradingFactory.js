import Share from "../models/Share";
import Portfolio from "../models/Portfolio";
import PortfolioItem from "../models/PortfolioItem";
import {
  BadRequestError,
  ValidationError,
} from "../utils/ApiError";

export class Trade {
  constructor(userId, item) {
    this.userId = userId;
    this.quantity = item.quantity;
    this.symbol = item.symbol;
  }
  async groupShares() {
    // Object to track quantities based on symbols
    const mergedQuantities = {};
    this.portfolio.PortfolioItems.forEach(pi => {
      const { shareId, qty } = pi;
      mergedQuantities[shareId] = (mergedQuantities[shareId] || 0) + qty;
    });

    return mergedQuantities;
  }
  async validate() {
    // Validate portfolio
    this.portfolio = await Portfolio.findOne({ where: { userId: this.userId }, include: PortfolioItem });
    if (!this.portfolio) throw new BadRequestError("You need to create your portfolio before start trading!");
  }
  async commit() {
    // Save DB
    await PortfolioItem.create({
      portfolioId: this.portfolio.id,
      shareId: this.share.id,
      price: this.share.price,
      qty: this.quantity
    });

    this.share.qty -= this.quantity;
    await Share.update({ qty: this.share.qty }, { where: { id: this.share.id } });
  }
}

export class Buy extends Trade {
  constructor(userId, item) {
    super(userId, item);
  }
  async validate() {
    await super.validate();
    this.share = await Share.findOne({ where: { symbol: this.symbol } });

    if (!this.share) throw new BadRequestError("Share symbol not found!");
    else if (this.quantity > this.share.qty) throw new ValidationError("Not enough share to buy!");
  }
}

export class Sell extends Trade {
  constructor(userId, item) {
    super(userId, item);
  }
  async validate() {
    await super.validate();

    this.share = await Share.findOne({ where: { symbol: this.symbol } });
    if (!this.share) throw new BadRequestError("Share symbol not found!");
    else if (this.quantity > this.share.qty) throw new ValidationError("Not enough share to buy!");

    // Get portfolio item if any
    const portfolioItems = await super.groupShares();
    const portfolioItem = portfolioItems[this.share.id];

    if (portfolioItem) {
      if (Math.abs(this.quantity) > portfolioItem)
        throw new ValidationError("Not enough share to sell!");
    }
    else throw new BadRequestError("You don't own any share to sell!");
  }
}
