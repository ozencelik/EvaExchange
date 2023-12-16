import Sequelize, { Model } from "sequelize";

class Share extends Model {
  static init(sequelize) {
    super.init(
      {
        symbol: Sequelize.STRING,
        price: Sequelize.DECIMAL
      },
      {
        sequelize,
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      through: "PortfolioItems",
      foreignKey: "shareId",
    });
  }
}

export default Share;
