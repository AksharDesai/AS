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
    const { phone, otp } = JSON.parse(event.body);

    if (!phone || !otp) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Phone number and OTP are required.",
        }),
      };
    }

    // Retrieve the latest OTP for the phone number
    const { data, error } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "No OTP found for this phone number.",
        }),
      };
    }

    // Verify the OTP
    if (data.otp === otp) {
      // Optionally, delete the OTP after verification
      await supabase
        .from("otp_verifications")
        .delete()
        .eq("id", data.id);

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "OTP verified successfully.",
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Invalid OTP.",
        }),
      };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
}; 