import axios from 'axios';
import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography, IconButton, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useState, useMemo } from "react";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const API_FORECAST = `http://api.weatherapi.com/v1/forecast.json?key=dd02788f02fe4de7994205408240406&lang=es&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });

  const [forecast, setForecast] = useState([]);

  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
      },
    }), [darkMode]);

    const onSubmit = async (e) => {
      e.preventDefault();
      setError({ error: false, message: "" });
      setLoading(true);
    
      try {
        if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };
    
        const res = await fetch(API_FORECAST + city + "&days=3");
        const data = await res.json();
    
        if (data.error) {
          throw { message: data.error.message };
        }
    
        console.log(data);
    
        const weatherData = {
          city: data.location.name,
          country: data.location.country,
          temperature: data.current.temp_c,
          condition: data.current.condition.code,
          conditionText: data.current.condition.text,
          icon: data.current.condition.icon,
          forecast: data.forecast.forecastday,
        };
    
        setWeather(weatherData);
        setForecast(data.forecast.forecastday);
    
        await axios.post('http://localhost:5000/api/weather', weatherData);
    
      } catch (error) {
        console.log(error);
        setError({ error: true, message: error.message });
      } finally {
        setLoading(false);
      }
    };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{ mt: 4 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
          >
            Tu Clima
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
        <Box
          sx={{ display: "grid", gap: 2 }}
          component="form"
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <TextField
            id="city"
            label="Donde Vives?"
            variant="outlined"
            size="small"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={error.error}
            helperText={error.message}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            loadingIndicator="Buscando..."
          >
            Buscar
          </LoadingButton>
        </Box>

        {weather.city && (
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gap: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
            >
              {weather.city}, {weather.country}
            </Typography>
            <Box
              component="img"
              alt={weather.conditionText}
              src={weather.icon}
              sx={{ margin: "0 auto" }}
            />
            <Typography
              variant="h5"
              component="h3"
            >
              {weather.temperature} °C
            </Typography>
            <Typography
              variant="h6"
              component="h4"
            >
              {weather.conditionText}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" component="h3">Pronóstico de los próximos días</Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                {forecast.map(day => (
                  <Box key={day.date} sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', minWidth: 'xs', textAlign: 'center' }}>
                    <Typography variant="h6" component="h4">{day.date}</Typography>
                    <Box component="img" alt={day.day.condition.text} src={day.day.condition.icon} sx={{ margin: "0 auto" }} />
                    <Typography>Max: {day.day.maxtemp_c} °C</Typography>
                    <Typography>Min: {day.day.mintemp_c} °C</Typography>
                    <Typography>{day.day.condition.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        <Typography
          textAlign="center"
          sx={{ mt: 2, fontSize: "10px" }}
        >
          Powered by:{" "}
          <a
            href="https://www.weatherapi.com/"
            title="Weather API"
          >
            WeatherAPI.com
          </a>
        </Typography>

        <Typography
          textAlign="center"
          sx={{ mt: 2, fontSize: "15px" }}
        >
          Github: {" "}
          <a
            href="https://github.com/Leanquiroga/consume-apiClima"
            title="Leanquiroga"
          >
          Leanquiroga
          </a>
        </Typography>
      </Container>
    </ThemeProvider>
  );
}
