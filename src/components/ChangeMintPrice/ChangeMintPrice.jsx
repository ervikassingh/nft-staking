import React, { useState } from "react";

const ChangeMintPrice = (props) => {
  const [newPrice, setnewPrice] = useState(window.web3.utils.fromWei(props.mintPrice.toString(), "Ether"));
  const [priceUpdatedError, setpriceUpdatedError] = useState(false);

  const [newPriceHero, setnewPriceHero] = useState(
    window.web3.utils.fromWei(props.mintPriceHero.toString(), "Ether")
    );
  const [priceUpdatedErrorHero, setpriceUpdatedErrorHero] = useState(false);

  const changePrice = async (e) => {
    e.preventDefault();
    let res = await props.shroomieSContract.methods
      .setMintPrice(window.web3.utils.toWei(newPrice.toString(), "Ether"))
      .send({ from: props.accountAddress });

    setpriceUpdatedError(!res);
    setnewPrice(window.web3.utils.fromWei(props.mintPrice.toString(), "Ether"));
    window.location.reload();
  };

  const changePriceHero = async (e) => {
    e.preventDefault();
    let res = await props.heroesContract.methods
      .setMintPrice(window.web3.utils.toWei(newPriceHero.toString(), "Ether"))
      .send({ from: props.accountAddress });

    setpriceUpdatedErrorHero(!res);
    setnewPriceHero(window.web3.utils.fromWei(props.mintPriceHero.toString(), "Ether"));
    window.location.reload();
  };

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>Change Mint Price Shroomie</h5>
        </div>
      </div>
      <div className="p-4 mt-1 border">
        <div className="row">
          <div className="col-md-5">
            <h5>New Price</h5>
            <form onSubmit={changePrice}>
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={newPrice}
                  placeholder="New Price"
                  onChange={(e) => setnewPrice(e.target.value)}
                />
              </div>
              <button className="mt-3 btn btn-outline-primary" type="submit">
                Change Mint Price
              </button>
              {priceUpdatedError ? (
                <div className="alert alert-danger alert-dissmissible mt-4">
                  <button type="button" className="close" data-dismiss="alert">
                    <span>&times;</span>
                  </button>
                  <strong>Error Updating The Price</strong>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>

      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>Change Mint Price Hero</h5>
        </div>
      </div>
      <div className="p-4 mt-1 border">
        <div className="row">
          <div className="col-md-5">
            <h5>New Price</h5>
            <form onSubmit={changePriceHero}>
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={newPriceHero}
                  placeholder="New Price"
                  onChange={(e) => setnewPriceHero(e.target.value)}
                />
              </div>
              <button className="mt-3 btn btn-outline-primary" type="submit">
                Change Mint Price
              </button>
              {priceUpdatedErrorHero ? (
                <div className="alert alert-danger alert-dissmissible mt-4">
                  <button type="button" className="close" data-dismiss="alert">
                    <span>&times;</span>
                  </button>
                  <strong>Error Updating The Price</strong>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeMintPrice;
