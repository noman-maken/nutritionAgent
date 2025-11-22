import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initMessage = (sequelize, Types) => {
    class Message extends Model {}

    Message.init(
        {
            id: {
                type: Types.UUID,
                defaultValue: Types.UUIDV4,
                primaryKey: true,
            },
            session_id: {
                type: Types.UUID,
                allowNull: false,
            },
            role: {
                type: Types.ENUM("user", "assistant", "system"),
                allowNull: false,
                defaultValue: "user",
            },
            content: {
                type: Types.TEXT,
                allowNull: true, // may be empty if only audio sent (we'll fill transcript)
            },
            audio_url: {
                type: Types.STRING,
                allowNull: true,
            },
            transcript: {
                type: Types.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Message",
            tableName: "messages",
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [{ fields: ["session_id", "created_at"] }],
        }
    );

    return Message;
};

export default initMessage(connection, DataTypes);
