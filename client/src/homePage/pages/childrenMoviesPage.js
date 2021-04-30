import React, { useState, useEffect } from "react";

import axios from "axios";

import ChildrenMovies from "../Components/ChildrenMovies/ChildrenMovies";

const ChildrenMoviesPage = (props) => {
  const [childrenMovies, setChildrenMovies] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await axios.get(
        "https://api.themoviedb.org/3/discover/movie?api_key=a31d02795054ebca84e5c9d45e915e85&language=en-US&include_adult=false&page=3"
      );
      const data = result.data.results;
      setChildrenMovies(data);
    })();
  }, []);

  return (
    <>
      <ChildrenMovies childrenMovies={childrenMovies} />
    </>
  );
};

export default ChildrenMoviesPage;