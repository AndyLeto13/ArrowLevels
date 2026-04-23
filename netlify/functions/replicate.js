exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { action, predictionId, prompt, negativePrompt, apiKey } = JSON.parse(event.body);
    const key = apiKey;

    if (action === 'create') {
      const res = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': 'Token ' + key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf',
          input: {
            prompt: prompt,
            negative_prompt: negativePrompt,
            width: 768,
            height: 768,
            num_outputs: 1,
            num_inference_steps: 25,
            guidance_scale: 7.5,
            scheduler: 'DPMSolverMultistep',
          }
        })
      });
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (action === 'poll') {
      const res = await fetch('https://api.replicate.com/v1/predictions/' + predictionId, {
        headers: { 'Authorization': 'Token ' + key }
      });
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };

  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
