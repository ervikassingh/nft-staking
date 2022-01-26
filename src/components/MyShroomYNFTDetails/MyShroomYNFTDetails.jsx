import React from "react";

const MyShroomYNFTDetails = (props) => {
  const {
    tokenId,
    tokenName,
    price,
    mintedBy,
    previousOwner,
    numberOfTransfers,
  } = props.shroomy;

  const [state, setState] = React.useState({
    newShroomYPrice: "",
    receiver: ""
  });

  const callChangeTokenPriceFromApp = (tokenId, newPrice) => {
    props.changeTokenPrice(tokenId, newPrice);
  };

  const callGift = (tokenId, receiver) => {
    props.giftShroomY(tokenId, receiver);
  };

  return (
    <div key={tokenId.toNumber()} className="mt-4">
      <p>
        <span className="font-weight-bold">Token Id</span> :{" "}
        {tokenId.toNumber()}
      </p>
      <p>
        <span className="font-weight-bold">Name</span> : {tokenName}
      </p>
      <p>
        <span className="font-weight-bold">Price</span> :{" "}
        {window.web3.utils.fromWei(price.toString(), "Ether")} BNB
      </p>
      <p>
        <span className="font-weight-bold">No. of Transfers</span> :{" "}
        {numberOfTransfers.toNumber()}
      </p>
      {props.accountAddress === mintedBy &&
      props.accountAddress !== previousOwner ? (
        <div className="alert alert-success w-100 text-center m-auto">
          Minted
        </div>
      ) : (
        <div className="alert alert-info w-100 text-center m-auto">Bought</div>
      )}
              <div>
          {props.accountAddress === props.shroomy.currentOwner ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                callChangeTokenPriceFromApp(
                  props.shroomy.tokenId.toNumber(),
                  state.newShroomYPrice
                );
              }}
            >
              <div className="form-group mt-4 ">
                <label htmlFor="newShroomYPrice">
                  <span className="font-weight-bold">Change Token Price</span> :
                </label>{" "}
                <input
                  required
                  type="number"
                  name="newShroomYPrice"
                  id="newShroomYPrice"
                  value={state.newShroomYPrice}
                  className="form-control w-100"
                  placeholder="Enter new price"
                  onChange={(e) =>
                    setState({
                      ...state,
                      newShroomYPrice: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
                className="btn btn-outline-info mt-0 w-100"
              >
                change price
              </button>
            </form>
          ) : null}
        </div>
        <div>
          {props.accountAddress === props.shroomy.currentOwner ? (
            props.shroomy.forSale ? (
              <button
                className="btn btn-outline-danger mt-4 w-100"
                style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
                onClick={() =>
                  props.toggleForSale(
                    props.shroomy.tokenId.toNumber()
                  )
                }
              >
                Remove from sale
              </button>
            ) : (
              <button
                className="btn btn-outline-success mt-4 w-100"
                style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
                onClick={() =>
                  props.toggleForSale(
                    props.shroomy.tokenId.toNumber()
                  )
                }
              >
                Keep for sale
              </button>
            )
          ) : null}
        </div>

        <div>
        <form
              onSubmit={(e) => {
                e.preventDefault();
                callGift(
                  props.shroomy.tokenId.toNumber(),
                  state.receiver
                );
              }}
            >
              <div className="form-group mt-4 ">
                <label htmlFor="receiver">
                  <span className="font-weight-bold">Transfer Shroomie To</span> :
                </label>{" "}
                <input
                  required
                  name="receiver"
                  id="receiver"
                  value={state.receiver}
                  className="form-control w-100"
                  placeholder="Enter Receiver Address"
                  onChange={(e) =>
                    setState({
                      ...state,
                      receiver: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
                className="btn btn-outline-info mt-0 w-100"
              >
                Send Shroomie
              </button>
            </form>
        </div>

    </div>
  );
};

export default MyShroomYNFTDetails;
