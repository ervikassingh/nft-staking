import React, { Component } from "react";

class ShroomYNFTDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div key={this.props.shroomy.tokenId.toNumber()} className="mt-4">
        <p>
          <span className="font-weight-bold">Token Id</span> :{" "}
          {this.props.shroomy.tokenId.toNumber()}
        </p>
        <p>
          <span className="font-weight-bold">Name</span> :{" "}
          {this.props.shroomy.tokenName}
        </p>
        <p>
          <span className="font-weight-bold">Minted By</span> :{" "}
          {this.props.shroomy.mintedBy.substr(0, 5) +
            "..." +
            this.props.shroomy.mintedBy.slice(
              this.props.shroomy.mintedBy.length - 5
            )}
        </p>
        <p>
          <span className="font-weight-bold">Owned By</span> :{" "}
          {this.props.shroomy.currentOwner.substr(0, 5) +
            "..." +
            this.props.shroomy.currentOwner.slice(
              this.props.shroomy.currentOwner.length - 5
            )}
        </p>
        <p>
          <span className="font-weight-bold">Previous Owner</span> :{" "}
          {this.props.shroomy.previousOwner.substr(0, 5) +
            "..." +
            this.props.shroomy.previousOwner.slice(
              this.props.shroomy.previousOwner.length - 5
            )}
        </p>
        <p>
          <span className="font-weight-bold">Price</span> :{" "}
          {window.web3.utils.fromWei(
            this.props.shroomy.price.toString(),
            "ether"
          )}{" "}
          BNB
        </p>
        <p>
          <span className="font-weight-bold">No. of Transfers</span> :{" "}
          {this.props.shroomy.numberOfTransfers.toNumber()}
        </p>
        <div>
          {this.props.accountAddress !== this.props.shroomy.currentOwner ? (
            this.props.shroomy.forSale ? (
              <button
                className="btn btn-outline-primary mt-3 w-100"
                value={this.props.shroomy.price}
                style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
                onClick={(e) =>
                  this.props.buyShroomY(
                    this.props.shroomy.tokenId.toNumber(),
                    e.target.value
                  )
                }
              >
                Buy For{" "}
                {window.web3.utils.fromWei(
                  this.props.shroomy.price.toString(),
                  "Ether"
                )}{" "}
                BNB
              </button>
            ) : (
              <>
                <button
                  disabled
                  style={{ fontSize: "0.7rem", letterSpacing: "0.10rem" }}
                  className="btn btn-outline-primary mt-3 w-100"
                >
                  Buy For{" "}
                  {window.web3.utils.fromWei(
                    this.props.shroomy.price.toString(),
                    "Ether"
                  )}{" "}
                  BNB
                </button>
                <p className="mt-2">Currently not for sale!</p>
              </>
            )
          ) : null}
        </div>
      </div>
    );
  }
}

export default ShroomYNFTDetails;
