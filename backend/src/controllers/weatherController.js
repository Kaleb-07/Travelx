const fetch = require('node-fetch');

async function getWeather(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: 'city query parameter is required' });
  }

  const url = `${process.env.OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `Upstream API error (status ${response.status})`;
      return res.status(502).json({ message });
    }

    const data = await response.json();

    return res.status(200).json({
      city: data.name,
      condition: data.weather[0].description,
      temperatureCelsius: data.main.temp,
      humidity: data.main.humidity,
      icon: data.weather[0].icon,
    });
  } catch (err) {
    return res.status(502).json({ message: 'Failed to reach weather service' });
  }
}

module.exports = { getWeather };
