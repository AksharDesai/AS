// netlify/functions/send-otp.js
const fetch = require("node-fetch");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { phone } = JSON.parse(event.body);

    if (!phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Phone number is required.",
        }),
      };
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP: ${otp} for phone: ${phone}`);

    // Store OTP in Supabase
    const { data, error } = await supabase
      .from("otp_verifications")
      .insert([{ phone, otp, created_at: new Date() }]);

    if (error) {
      console.error("Error storing OTP:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Failed to store OTP.",
        }),
      };
    }

    // Send OTP via Fast2SMS
    const settings = {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY, // Use environment variable
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: phone,
      }),
    };

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", settings);
    const dataResponse = await response.json();
    console.log("Fast2SMS Response:", dataResponse);

    if (dataResponse.return === true) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: true,
          message: "OTP sent successfully.",
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Failed to send OTP via Fast2SMS.",
          apiResponse: dataResponse,
        }),
      };
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
