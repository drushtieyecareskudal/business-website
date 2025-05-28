import mongoose from "mongoose";

const newsSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
});

const NewsSubscriber =
  mongoose.models.NewsSubscriber ||
  mongoose.model("NewsSubscriber", newsSubscriberSchema);

export default NewsSubscriber;
