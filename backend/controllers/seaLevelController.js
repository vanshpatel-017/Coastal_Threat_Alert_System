import axios from "axios";

export const getSeaLevel = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter",
      {
        params: {
          product: "water_level", // ✅ must be valid
          date: "latest",
          station: "9461710 Atka, AK", // Example: Newport, RI
          time_zone: "gmt",
          units: "metric",
          format: "json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ Error fetching sea level:", err.message);
    res.status(500).json({ message: "Failed to fetch sea level data" });
  }
};
