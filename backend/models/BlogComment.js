import mongoose from "mongoose";

const BlogCommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },

    comment: {
      type: String,
      required: true,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogComment",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BlogCommentSchema.index({ post: 1, parentComment: 1, createdAt: -1 });

BlogCommentSchema.virtual("replies", {
  ref: "BlogComment",
  localField: "_id",
  foreignField: "parentComment",
});

BlogCommentSchema.pre("deleteMany", async function (next) {
  try {
    const condition = await this.getQuery();
    if (condition.post) {
      await mongoose.model("BlogComment").deleteMany({
        parentComment: {
          $in: await mongoose
            .model("BlogComment")
            .find(condition)
            .distinct("_id"),
        },
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

BlogCommentSchema.pre("findOneAndDelete", async function (next) {
  try {
    const comment = await this.model.findOne(this.getQuery());
    if (comment) {
      await mongoose.model("BlogComment").deleteMany({
        parentComment: comment._id,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("BlogComment", BlogCommentSchema);
