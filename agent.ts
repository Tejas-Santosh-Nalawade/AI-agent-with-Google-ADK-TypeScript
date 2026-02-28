import { FunctionTool, LlmAgent } from "@google/adk";
import { z } from "zod";

/* Dynamic time tool implementation */
const getCurrentTime = new FunctionTool({
  name: "get_current_time",
  description: "Returns the current time in a specified city.",
  parameters: z.object({
    city: z
      .string()
      .describe("The name of the city for which to retrieve the current time."),
  }),
  execute: ({ city }) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const dateString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return {
      status: "success",
      report: `The current time in ${city} is ${timeString} on ${dateString}`,
    };
  },
});

/* Weather tool with API integration */
const getWeather = new FunctionTool({
  name: "get_weather",
  description: "Returns the current weather conditions for a specified city.",
  parameters: z.object({
    city: z
      .string()
      .describe("The name of the city for which to retrieve weather information."),
  }),
  execute: async ({ city }) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return {
        status: "error",
        report: `Weather API key not configured. Please set OPENWEATHER_API_KEY environment variable. Get your free API key at: https://openweathermap.org/api`,
      };
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            status: "error",
            report: `City "${city}" not found. Please check the city name and try again.`,
          };
        }
        return {
          status: "error",
          report: `Failed to fetch weather data: ${response.statusText}`,
        };
      }

      const data = await response.json();
      const temp = Math.round(data.main.temp);
      const feelsLike = Math.round(data.main.feels_like);
      const description = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      return {
        status: "success",
        report: `Current weather in ${city}: ${description}. Temperature: ${temp}°C (feels like ${feelsLike}°C). Humidity: ${humidity}%. Wind speed: ${windSpeed} m/s.`,
      };
    } catch (error) {
      return {
        status: "error",
        report: `Error fetching weather data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});

export const rootAgent = new LlmAgent({
  name: "time_and_weather_agent",
  model: "gemini-2.5-flash",
  description: "Tells the current time and weather in a specified city.",
  instruction: `You are a helpful assistant that provides current time and weather information for cities.
                Use the 'get_current_time' tool to get the current time.
                Use the 'get_weather' tool to get current weather conditions.
                Be friendly and provide clear, formatted responses.`,
  tools: [getCurrentTime, getWeather],
});