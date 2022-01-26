import React, { useState, useEffect } from "react";
import HeroNFTImage from "../HeroNFTImage/HeroNFTImage";
import HeroNFTDetails from "../HeroNFTDetails/HeroNFTDetails";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";

const AllHeros = ({
  accountAddress,
  heroesContract,
  totalInMarketplace,
  marketplaceData,
  changeTokenPriceHero,
  toggleForSaleHero,
  buyHero,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Heroes Available On The Platform :{" "}
            {totalInMarketplace}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-1">
        {marketplaceData.map((hero, i) => {
          return (
            <div
              key={i}
              className="w-25 p-1 mt-1 border"
            >
              <Link to={{
                pathname: `/hero-detail/${hero.tokenName}`
              }}>
                {!loading ? (
                  <HeroNFTImage
                    tokenURI={hero.tokenURI}
                  />
                ) : (
                  <Loading />
                )}
              </Link>
              <HeroNFTDetails
                hero={hero}
                accountAddress={accountAddress}
                heroesContract={heroesContract}
                buyHero={buyHero}
              />

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllHeros;
