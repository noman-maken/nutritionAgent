import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initChatSession = (sequelize, Types) => {
    class ChatSession extends Model {}

    ChatSession.init(
        {
            id: {
                type: Types.UUID,
                defaultValue: Types.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Types.UUID,
                allowNull: false,
            },
            title: {
                type: Types.STRING,
                allowNull: false,
                defaultValue: "New Chat",
            },
        },
        {
            sequelize,
            modelName: "ChatSession",
            tableName: "chat_sessions",
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    return ChatSession;
};

export default initChatSession(connection, DataTypes);
