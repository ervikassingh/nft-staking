import React from "react";
import herodata from "../../data/hero-metadata.json";
import Loading from "../Loading/Loading";

const HeroDetail = (props) => {

  const [loading, setLoading] = React.useState(false);
  const [item, setItem] = React.useState({});

  React.useEffect(() => {
    let heroName = window.location.href.split('/');
    heroName = heroName[heroName.length - 1];
    console.log(heroName)

    setLoading(true);
    let matchedItem;
    herodata.forEach((item, i) => {
      if (item.name === heroName) {
        matchedItem = item;
      }
    });
    setItem(matchedItem);
    setLoading(false);
  }, []);

  const shroomy_card = {
    display: 'flex',
    justifyContent: 'center',
    border: `2px solid black`,
  };
  const shroomy_image = {
    width: "80%",
  };

  return (

    <div>
      {!loading ? (
        <div className="mt-4 ml-5 mr-5">
          <div>
            <div style={shroomy_card}>
              <video src={item.image} type="video/mp4" autoPlay loop style={shroomy_image} />
            </div>
          </div>

          <p>
            <span className="font-weight-bold">DNA</span> :{" "}
            {item.dna}
          </p>
          <p>
            <span className="font-weight-bold">Name</span> :{" "}
            {item.name}
          </p>
          <p>
            <span className="font-weight-bold">Rarity</span> :{" "}
            {item.rarity}
          </p>
          <p>
            <span className="font-weight-bold">Description</span> :{" "}
            {item.description}
          </p>

        </div>

      ) : (
        <Loading />
      )}
    </div>
  )

};

export default HeroDetail;
