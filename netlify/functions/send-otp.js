// netlify/functions/send-otp.js




exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Origin": "*", // Adjust as necessary for security
      },
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { phone } = JSON.parse(event.body);
    
    if (!phone) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Adjust as necessary for security
        },
        body: JSON.stringify({ success: false, message: "Phone number is required." }),
      };
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP: ${otp} for phone: ${phone}`);

    const settings = { 
      method: "POST",
      headers: {
        "authorization": process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: phone,
      }),
    };

    // Use the global fetch provided by Netlify Functions
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", settings);
    const data = await response.json();
    console.log("Fast2SMS Response:", data);

    if (data.return && data.return === true) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Adjust as necessary for security
        },
        body: JSON.stringify({
          success: true,
          otp,
          apiResponse: data,
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Adjust as necessary for security
        },
        body: JSON.stringify({
          success: false,
          message: "Failed to send OTP via Fast2SMS.",
          apiResponse: data,
        }),
      };
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Adjust as necessary for security
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};


