import mongoose from "mongoose";


const activityLogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    entityType: {
        type: String,
        required: true
    },
    entityId: {
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});


export const ActivityLog = mongoose.model(
    "ActivityLog",
    activityLogSchema
)