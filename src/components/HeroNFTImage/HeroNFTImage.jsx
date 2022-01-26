import React from "react";

const HeroNFTImage = ({ tokenURI }) => {

  const shroomy_card = {
    display: 'flex',
    justifyContent: 'center',
    border: `2px solid black`,
  };
  const shroomy_image = {
    width: "200px",
    height: "200px",
  };

  const [image, setImage] = React.useState('');

  const getImageData = async () => {
    setImage(tokenURI);
    // console.log(image);
  };

  React.useEffect(() => {
    getImageData();
  }, []);

  return (
    <div>
      {
        (image.substring(image.lastIndexOf('.') + 1, image.length) === 'png') ?
          <div style={shroomy_card}>
            <img src={image} style={shroomy_image} alt='graphic-nft'/>
          </div>
          :
          <div style={shroomy_card}>
            <video src={image} type="video/mp4" autoPlay loop muted style={shroomy_image} />
          </div>
      }
    </div>
  );
};

export default HeroNFTImage;
