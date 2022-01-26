import React, { Component } from "react";

class ShroomYNFTDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noHeroBuy: 0,
    };
  }

  render() {
    return (
      <div key={this.props.hero.tokenId} className="mt-4">
        <p>
          <span className="font-weight-bold">Token Id</span> :{" "}
          {this.props.hero.tokenId}
        </p>
        <p>
          <span className="font-weight-bold">Name</span> :{" "}
          {this.props.hero.tokenName}
        </p>
        <p>
          <span className="font-weight-bold">Owner</span> :{" "}
          {this.props.hero.userAddress.substr(0, 5) +
            "..." +
            this.props.hero.userAddress.slice(
              this.props.hero.userAddress.length - 5
            )}
        </p>
        <p>
          <span className="font-weight-bold">No. of heroes available</span> :{" "}
          {this.props.hero.noInSale}
        </p>
        <p>
          <span className="font-weight-bold">Price</span> :{" "}
          {this.props.hero.salePrice} LLG Tokens
        </p>
        <div>
          {this.props.accountAddress !== this.props.hero.userAddress ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (this.state.noHeroBuy <= 0) {
                  alert("No. of Heroes cannot be negative or zero");
                } else {
                  if (this.state.noHeroBuy > this.props.hero.noInSale) {
                    alert(this.state.noHeroBuy + " Heroes not available");
                  } else {
                    this.props.buyHero(this.props.hero.tokenId, this.state.noHeroBuy, this.props.hero.userAddress, this.props.hero.salePrice);
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
                  value={this.state.noHeroBuy}
                  className="form-control w-100"
                  placeholder="Enter new price"
                  onChange={(e) =>
                    this.setState({
                      noHeroBuy: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
                className="btn btn-outline-info mt-0 w-80"
              >
                Buy Hero
              </button>
            </form>
          ) : null}
        </div>
      </div>
    );
  }
}

export default ShroomYNFTDetails;
