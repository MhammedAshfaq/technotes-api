import joi from "joi";

//Registration
export const registrationSchema = joi.object({
  name: joi.string().required().messages({
    "string.empty": "Name is required",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Please include a valid email",
    "string.empty": "Email is required",
  }),
  password: joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),
  role: joi.string().valid("doctor", "patient").required().messages({
    "string.empty": "Role is required",
    "any.only": "Role must be either (doctor or patient)",
  }),

  gender: joi.string().valid("Male", "Female", "Other").required().messages({
    "any.only": "Gender must be either (Male, Female or Other)",
    "string.empty": "Gender is required",
  }),

  photo: joi.string().required().messages({
    "string.empty": "Photo is required",
  }),
});

export const userLoginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Please include a valid email",
    "string.empty": "Email is required",
  }),
  password: joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),
});

export const createDoctorReview = joi.object({
  reviewText: joi.string().required().messages({
    "string.empty": "Review text is required",
  }),
  rating: joi.number().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
    "any.required": "Rating is required",
  }),
});

// Time format regex (HH:MM in 24-hour format)
const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const updateDoctorProfile = joi.object({
  name: joi.string().required().messages({
    "string.empty": "Name is required",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Please include a valid email",
    "string.empty": "Email is required",
  }),

  phone: joi.string().required().messages({
    "string.empty": "Phone is required",
  }),

  bio: joi.string().optional().min(5).max(100).messages({
    "string.base": "Bio should be a type of text",
    "string.empty": "Bio cannot be an empty field",
    "string.min": "Bio should have a minimum length of 5 characters",
    "string.max": "Bio should have a maximum length of 100 characters",
  }),

  gender: joi.string().valid("Male", "Female", "Other").required().messages({
    "any.only": "Gender must be either (Male, Female or Other)",
    "string.empty": "Gender is required",
  }),

  specialization: joi.string().required().messages({
    "string.empty": "Specialization is required",
  }),

  ticketPrice: joi.number().required().messages({
    "number.base": "Ticket Price must be a number",
    "any.required": "Ticket Price is required",
  }),

  qualifications: joi
    .array()
    .items(
      joi.object({
        startingDate: joi.date().required().messages({
          "date.base": "Qualification Start date must be a valid date",
          "any.required": "Qualification  Start date is required",
        }),
        endingDate: joi.date().required().messages({
          "date.base": "Qualification End date must be a valid date",
          "any.required": "Qualification End date is required",
        }),
        degree: joi.string().required().messages({
          "string.empty": "Degree is required",
        }),
        university: joi.string().required().messages({
          "string.empty": "University is required",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Qualifications must be an array",
      "array.empty": "Qualifications is required",
    }),

  experiences: joi
    .array()
    .items(
      joi.object({
        startingDate: joi.date().required().messages({
          "date.base": " Experience Start date must be a valid date",
          "any.required": "Experience Start date is required",
        }),
        endingDate: joi.date().required().messages({
          "date.base": "Experience End date must be a valid date",
          "any.required": "Experience End date is required",
        }),
        position: joi.string().required().messages({
          "string.empty": "Position is required",
        }),
        hospital: joi.string().required().messages({
          "string.empty": "Hospital is required",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Experiences must be an array",
      "array.empty": "Experiences is required",
    }),

  timeSlots: joi
    .array()
    .items(
      joi.object({
        startingTime: joi.string().pattern(timeFormat).required().messages({
          "string.pattern.base":
            "Starting time must be a valid time in HH:MM format",
          "string.empty": "Starting time is required",
        }),
        endingTime: joi.string().pattern(timeFormat).required().messages({
          "string.pattern.base":
            "Ending time must be a valid time in HH:MM format",
          "string.empty": "Ending time is required",
        }),
        day: joi.string().required().messages({
          "string.empty": "Day is required",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Time Slots must be an array",
      "array.empty": "Time Slots is required",
    }),

  about: joi.string().required().min(20).max(1000).messages({
    "string.empty": "About is required",
    "string.min": "About should have a minimum length of 20 characters",
    "string.max": "About should have a maximum length of 1000 characters",
  }),

  photo: joi.string().required().messages({
    "string.empty": "Photo is required",
  }),
});

// Forgot password
export const forgotPasswordSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Please include a valid email",
    "string.empty": "Email is required",
  }),
});



// Reset password
export const resetPasswordSchema = joi.object({
  password: joi.string().min(6).required().messages({
    "string.base": "Password should be a type of 'text'",
    "string.empty": "Password is required",
    "string.min": "Password should have a minimum length of 6",
    "any.required": "Password is required"
  }),

  confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
    "string.base": "Confirm password should be a type of 'text'",
    "string.empty": "Confirm password is required",
    "any.only": "Confirm password does not match",
    "any.required": "Confirm password is required"
  }),
});