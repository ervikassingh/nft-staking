import React, { useState, useEffect } from "react";
import HeroNFTImage from "../HeroNFTImage/HeroNFTImage";
import MyHeroNFTDetails from "../MyHeroNFTDetails/MyHeroNFTDetails";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";

const MyHeros = ({
  accountAddress,
  heroesContract,
  totalMyHero,
  myHeroData,
  toggleSale,
  toggleStake,
  changeTokenPriceHero,
  setStakeTimer,
  rewardEarned,
  giftHero
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Heroes You Own : {totalMyHero}
          </h5>
        </div>
      </div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total Reward Earned : {window.web3.utils.fromWei(rewardEarned.toString(), "Ether")}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-1 border">
        {myHeroData.map((hero, i) => {
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
              <MyHeroNFTDetails
                hero={hero}
                accountAddress={accountAddress}
                heroesContract={heroesContract}
                toggleSale={toggleSale}
                toggleStake={toggleStake}
                changeTokenPriceHero={changeTokenPriceHero}
                setStakeTimer={setStakeTimer}
                giftHero={giftHero}
              />

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyHeros;
