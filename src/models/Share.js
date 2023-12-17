import Sequelize, { Model } from "sequelize";

class Share extends Model {
  static init(sequelize) {
    super.init(
      {
        symbol: Sequelize.STRING,
        price: Sequelize.DECIMAL,
        qty: Sequelize.INTEGER
      },
      {
        sequelize,
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.PortfolioItem, { onDelete: 'RESTRICT' });
  }
}

export default Share;
