import React, { useState, useEffect } from "react";
import ShroomYNFTImage from "../ShroomYNFTImage/ShroomYNFTImage";
import MyShroomYNFTDetails from "../MyShroomYNFTDetails/MyShroomYNFTDetails";
import Loading from "../Loading/Loading";

const MyShroomieS = ({
  shroomieSContract,
  accountAddress,
  shroomieS,
  totalTokensOwnedByAccount,
  changeTokenPrice,
  toggleForSale,
  giftShroomY
}) => {
  const [loading, setLoading] = useState(false);
  const [myShroomieS, setMyShroomieS] = useState([]);

  useEffect(() => {
    if (shroomieS.length !== 0) {
      if (shroomieS[0].metaData !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
    const my_shroomies = shroomieS.filter(
      (shroomy) => shroomy.currentOwner === accountAddress
    );
    setMyShroomieS(my_shroomies);
  }, [shroomieS]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Shroomie's You Own : {totalTokensOwnedByAccount}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-1 border">
        {myShroomieS.map((shroomy) => {
          return (
            <div
              key={shroomy.tokenId.toNumber()}
              className="w-25 p-1 mt-1 border" 
            >
                {!loading ? (
                  <ShroomYNFTImage
                    tokenId={shroomy.tokenId.toNumber()}
                    shroomieSContract={shroomieSContract}
                  />
                ) : (
                  <Loading />
                )}
                <MyShroomYNFTDetails
                  shroomy={shroomy}
                  accountAddress={accountAddress}
                  changeTokenPrice={changeTokenPrice}
                  toggleForSale={toggleForSale}
                  giftShroomY={giftShroomY}
                />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyShroomieS;
