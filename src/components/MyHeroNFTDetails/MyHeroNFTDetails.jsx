import React from "react";

const MyHeroNFTDetails = (props) => {
  const {
    tokenId,
    tokenName,
    tokenURI,
    balance,
    sales,
    stakes,
    salePrice
  } = props.hero;

  const accountAddress = props.accountAddress;
  const heroesContract = props.heroesContract;

  const [newPrice, setNewPrice] = React.useState(0);
  const [onSale, setOnSale] = React.useState(0);
  const [onStake, setOnStake] = React.useState(0);
  const [toGift, setToGift] = React.useState(0);
  const [receiver, setReceiver] = React.useState('');

  React.useEffect(() => {
    setNewPrice(salePrice);
    setOnSale(sales);
    setOnStake(stakes);
    props.setStakeTimer();
  }, []);

  return (
    <div key={tokenId} className="mt-4">
      <p>
        <span className="font-weight-bold">Token Id</span> :{" "}
        {tokenId}
      </p>
      <p>
        <span className="font-weight-bold">Name</span> : {tokenName}
      </p>
      <p>
        <span className="font-weight-bold">Price</span> :{" "}
        {salePrice} LLG Tokens
      </p>
      <p>
        <span className="font-weight-bold">Total Heroes Owned</span> :{" "}
        {balance}
      </p>
      <p>
        <span className="font-weight-bold">Total Heroes up for Sale</span> :{" "}
        {sales}
      </p>
      <p>
        <span className="font-weight-bold">Total Heroes on Stake</span> :{" "}
        {stakes}
      </p>


      {(true) ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newPrice <= 0) {
              alert("Price cannot be negative or zero");
            } else {
              props.changeTokenPriceHero(tokenId, newPrice);
            }
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
              value={newPrice}
              className="form-control w-100"
              placeholder="Enter new price"
              onChange={(e) =>
                setNewPrice(e.target.value)
              }
            />
          </div>
          <button
            type="submit"
            style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
            className="btn btn-outline-info mt-0 w-80"
          >
            Change Price
          </button>
        </form>
      ) : null}


      {(balance - stakes > 0) ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onSale < 0) {
              alert("Value cannot be negative");
            } else {
              if (sales > onSale) {
                props.toggleSale(tokenId, sales - onSale, false);
              } else if (sales < onSale) {
                props.toggleSale(tokenId, onSale - sales, true);
              }
            }
          }}
        >
          <div className="form-group mt-4 ">
            <label htmlFor="newShroomYPrice">
              <span className="font-weight-bold">Change No. of tokens on Sale</span> :
            </label>{" "}
            <input
              required
              type="number"
              name="newShroomYPrice"
              id="newShroomYPrice"
              value={onSale}
              className="form-control w-100"
              placeholder="No. of tokens"
              onChange={(e) =>
                setOnSale(e.target.value)
              }
            />
          </div>
          <button
            type="submit"
            style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
            className="btn btn-outline-info mt-0 w-80"
          >
            Change No. of tokens on Sale
          </button>
        </form>
      ) : null}



      {(balance - sales > 0) ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onStake < 0) {
              alert("Stake value cannot be negative");
            } else {
              if (stakes > onStake) {
                props.toggleStake(tokenId, tokenName, stakes - onStake, false);
              } else if (stakes < onStake) {
                props.toggleStake(tokenId, tokenName, onStake - stakes, true);
              }
            }
          }}
        >
          <div className="form-group mt-4 ">
            <label htmlFor="newShroomYPrice">
              <span className="font-weight-bold">Change No. of tokens on Stake</span> :
            </label>{" "}
            <input
              required
              type="number"
              name="newShroomYPrice"
              id="newShroomYPrice"
              value={onStake}
              className="form-control w-100"
              placeholder="No. of tokens"
              onChange={(e) =>
                setOnStake(e.target.value)
              }
            />
          </div>
          <button
            id="stakeBtn"
            type="submit"
            style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
            className="btn btn-outline-info mt-0 w-80"
          >
            Change No. of tokens on Stake
          </button>
        </form>
      ) : null}

      {(sales > 0) ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (toGift <= 0) {
              alert("No. of Heroes cannot be negative or zero");
            } else {
              if (toGift > sales) {
                alert(toGift + " Heroes not available");
              } else {
                props.giftHero(tokenId, toGift, receiver);
              }
            }
          }}
        >
          <div className="form-group mt-4 ">
            <label htmlFor="newShroomYPrice">
              <span className="font-weight-bold">No of Heroes</span> :
            </label>{" "}
            <input
              required
              type="number"
              name="newShroomYPrice"
              id="newShroomYPrice"
              value={toGift}
              className="form-control w-100"
              placeholder="Enter new price"
              onChange={(e) =>{
                setToGift(e.target.value)
              }}
            />
            <label htmlFor="newShroomYPrice">
              <span className="font-weight-bold">Receiver</span> :
            </label>{" "}
            <input
              required
              name="newShroomYPrice"
              id="newShroomYPrice"
              value={receiver}
              className="form-control w-100"
              placeholder="Enter Receiver Address"
              onChange={(e) =>{
                setReceiver(e.target.value)
              }}
            />
          </div>
          <button
            type="submit"
            style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
            className="btn btn-outline-info mt-0 w-80"
          >
            Send Hero
          </button>
        </form>
      ) : null}

    </div>
  );
};

export default MyHeroNFTDetails;
