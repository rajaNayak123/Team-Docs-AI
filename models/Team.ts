import mongoose from "mongoose"

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "editor", "viewer"],
          default: "viewer",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    billingInfo: {
      customerId: String,
      subscriptionId: String,
      nextBillingDate: Date,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Team || mongoose.model("Team", TeamSchema)
