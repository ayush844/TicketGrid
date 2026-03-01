import { ActivityLog } from "../models/activityLog.model.js";
import type {Role, EntityType, Action} from "../constants.js"


interface LogParams {
    userId: string;
    role: Role;
    action: Action;
    entityType: EntityType;
    entityId?: string;
    metadata?: any;
}


export const createLog = async({
    userId, role, action, entityType, entityId, metadata
}: LogParams) => {

    try {

        await ActivityLog.create({
            userId,
            role,
            action,
            entityType,
            ...(entityId && {entityId}),
            ...(metadata && {metadata})
        })
    } catch (error) {
        console.error("Log creation failed");
    }

}