import Sequelize, { Model } from "sequelize";

class PortfolioItem extends Model {
  static init(sequelize) {
    super.init(
      {
        portfolioId: Sequelize.INTEGER,
        shareId: Sequelize.INTEGER,
        price: Sequelize.DECIMAL,
        qty: Sequelize.INTEGER
      },
      {
        sequelize,
        timestamps: true
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Portfolio, { foreignKey: "portfolioId" });
    this.belongsTo(models.Share, { foreignKey: "shareId" });
  }
}

export default PortfolioItem;
