const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body to get the phone number
    const { phone } = JSON.parse(event.body);

    if (!phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Phone number is required' }),
      };
    }

    // Insert the phone number into Supabase
    const { data, error } = await supabase
      .from('phoneNumbers')
      .insert([{ phoneNumber: phone }]);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Phone number added successfully',
        data
      }),
    };

  } catch (error) {
    console.error('Error adding phone number:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      }),
    };
  }
};
