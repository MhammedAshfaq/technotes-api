import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import {
  failureResponseWithError,
  successResponseWithData,
} from "../utility/commonFunction.js";
import Srtipe from "stripe";
import dotenv from "dotenv";
dotenv.config();

export const getCheckoutSession = async (req, res) => {
  try {
    // Get currently booked doctor
    const doctor = await Doctor.findById(req.params.doctorId);
    // console.log("-----DOCTOR---", doctor);
    const user = await User.findById(req.userId);
    // console.log("-----USER-----", user);

    const stripe = new Srtipe(process.env.STRIPE_SECRET_KEY);
    // console.log("------ STRIPE -----", stripe);

    // Create stripe checkout session
    const sesstion = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor._id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "inr", // Set currency to Indian Rupees (INR)
            unit_amount: Math.round(doctor.ticketPrice * 100),
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    // Create New Booking
    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: sesstion.id,
    });

    // Saving in DB
    await booking.save();
    await Doctor.findByIdAndUpdate(
      req.params.doctorId,
      {
        $push: { appointments: booking._id },
      },
      { new: true, useFindAndModify: false }
    );
    return successResponseWithData(res, 200, "Successfully send", sesstion);
  } catch (error) {
    console.log("STRIPE ", error);
    return failueResponseWithError(
      res,
      400,
      "Error during the Stripe checkout session"
    );
  }
};
