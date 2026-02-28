# Time and Weather Agent

An AI agent that provides current time and weather information for any city.

## Features

- **Dynamic Time**: Gets the actual current time (not hardcoded)
- **Weather Data**: Fetches real-time weather information using OpenWeatherMap API

## Setup

1. **Get an API Key**
   - Go to [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key from the API keys section

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Replace `your_api_key_here` with your actual API key

   ```bash
   # On Windows PowerShell
   Copy-Item .env.example .env
   ```

3. **Set Environment Variable**
   
   **Windows PowerShell:**
   ```powershell
   $env:OPENWEATHER_API_KEY="your_actual_api_key"
   ```

   **Windows Command Prompt:**
   ```cmd
   set OPENWEATHER_API_KEY=your_actual_api_key
   ```

   **For permanent setup (Windows):**
   - Open System Properties > Environment Variables
   - Add a new user variable: `OPENWEATHER_API_KEY` with your API key value

## Usage

Run the agent:
```bash
npm run run
```

Or start the web interface:
```bash
npm run web
```

## Example Queries

- "What's the current time in New York?"
- "What's the weather in London?"
- "Tell me the time and weather in Tokyo"

## Tools Available

1. **get_current_time**: Returns the current date and time
2. **get_weather**: Returns current weather conditions including temperature, humidity, and wind speed
