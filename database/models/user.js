import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initUser = (sequelize, Types) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		// static associate(models) {
		// 	// define association here
		// }
	}
	User.init(
		{
			id: {
				type: Types.UUID,
				defaultValue: Types.UUIDV4,
				primaryKey: true,
			},
			first_name: Types.STRING,
			last_name: Types.STRING,
			email: Types.STRING,
			password: Types.STRING,
			phone: Types.STRING,
			role: Types.STRING,
			email_confirmed: Types.BOOLEAN,
			status: Types.BOOLEAN,
			token: Types.STRING,


		},
		{
			sequelize,
			modelName: "User",
			tableName: "users",
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);
	return User;
};

export default initUser(connection, DataTypes);
