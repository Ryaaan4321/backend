const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const enRollMentSchema = new mongoose.Schema(
  {
    auhtor: {
      type: Schema.Types.ObjectId,
      ref: "",
    },
    payNow: {
      type: Boolean,
    },
    paymentStatus: {
      type: Boolean,
      default: 0,
    },
    paymentId: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
    enrollDate: {
      type: Date,
    },
    month: {
      type: String,
      enum: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    batch: {
      type: String,
      enum: ["6-7 am", "7-8 am", "8-9 am", "7-8pm"],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);
export default mongoose.model("Enrollments" , enRollMentSchema);