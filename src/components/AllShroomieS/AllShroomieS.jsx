import React, { useState, useEffect } from "react";
import ShroomYNFTImage from "../ShroomYNFTImage/ShroomYNFTImage";
import ShroomYNFTDetails from "../ShroomYNFTDetails/ShroomYNFTDetails";
import Loading from "../Loading/Loading";

const AllShroomieS = ({
  shroomieSContract,
  shroomieS,
  accountAddress,
  totalTokensMinted,
  buyShroomY,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shroomieS.length !== 0) {
      if (shroomieS[0].metaData !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
  }, [shroomieS]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Shroomie's Minted On The Platform :{" "}
            {totalTokensMinted}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-1">
        {shroomieS.map((shroomy) => {
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
              <ShroomYNFTDetails
                shroomy={shroomy}
                accountAddress={accountAddress}
                buyShroomY={buyShroomY}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllShroomieS;
