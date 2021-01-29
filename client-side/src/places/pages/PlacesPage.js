import React, { useState, useEffect } from "react";
import Places from "../components/Places/Places";
import axios from "axios";
import LoadingSpinner from "../../share/UI/LoadingSpinner/LoadingSpinner";

const PlacesPage = (props) => {
  const [places, setPlaces] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const resp = await axios.get("http://localhost:5000/place");
        const places = resp.data;
        if (places && places.length > 0) {
          setPlaces(places);
        } else {
          throw new Error("No places found.");
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    })();
  }, []);

  return (
    <div>
      <LoadingSpinner showSpinner={isLoading} />
      <Places places={places} />
    </div>
  );
};

export default PlacesPage;
