import Sequelize, { Model } from "sequelize";

class Portfolio extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: Sequelize.INTEGER,
        name: Sequelize.STRING,
      },
      {
        sequelize,
        timestamps: true
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.PortfolioItem, { foreignKey: "portfolioId", onDelete: 'RESTRICT' });
    this.belongsTo(models.User, { foreignKey: "userId" });
  }
}

export default Portfolio;
