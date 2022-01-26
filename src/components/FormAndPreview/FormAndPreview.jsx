import React, { Component } from "react";

class FormAndPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mintPrice: window.web3.utils.fromWei(props.mintPrice.toString(), "Ether"),
      mintPriceHero: window.web3.utils.fromWei(props.mintPriceHero.toString(), "Ether"),
      mintPriceLLG: window.web3.utils.fromWei(props.mintPriceLLG.toString(), "Ether"),
      noOfToken: '',
      balanceLLG: window.web3.utils.fromWei(props.balanceLLG.toString(), "Ether")
    };
  }

  componentDidMount = async () => {
    await this.props.setMintBtnTimer();
    await this.props.setMintBtnTimerHero();
  };

  callMintMyNFTFromApp = (e) => {
    e.preventDefault();
    this.props.mintMyNFT(
      this.state.mintPrice
    );
  };

  callMintMyNFTFromAppHero = (e) => {
    e.preventDefault();
    this.props.mintMyNFTHero(
      this.state.mintPriceHero
    );
  };

  callMintMyLLG = (e) => {
    e.preventDefault();
    this.props.mintMyLLG(
      this.state.noOfToken
    );
  };

  render() {
    return (
      <div>

        {/* <form onSubmit={this.callMintMyLLG} className="pt-4 mt-1">
          <div className="col-md-6">
            <div>
              <label htmlFor="price">Buy LLG Token</label>
              <br />
              <label htmlFor="price">Available - {this.state.balanceLLG}</label>
              <input
                required
                type="text"
                className="form-control mb-2"
                value={this.noOfToken}
                placeholder="Enter No. of tokens to buy"
                onChange={(e) => { this.state.noOfToken = e.target.value }}
              />
              <h4>{this.state.mintPriceLLG} BNB</h4>
            </div>
            <button
              id="mintBtnLLG"
              style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
              type="submit"
              className="btn mt-4 btn-block btn-outline-primary w-50"
            >
              Buy LLG Token
            </button>
            <div className="mt-4">
            </div>
          </div>
        </form> */}

        <form onSubmit={this.callMintMyNFTFromApp} className="pt-4 mt-1">
          <div className="col-md-6">
            <div>
              <label htmlFor="price">Mint Shroomie for</label>
              <h4>{this.state.mintPrice} BNB</h4>
            </div>
            <button
              id="mintBtn"
              style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
              type="submit"
              className="btn mt-4 btn-block btn-outline-primary w-50"
            >
              Mint My Shroomie
            </button>
            <div className="mt-4">
            </div>
          </div>
        </form>

        <form onSubmit={this.callMintMyNFTFromAppHero} className="pt-4 mt-1">
          <div className="col-md-6">
            <div>
              <label htmlFor="price">Mint Hero for</label>
              <h4>{this.state.mintPriceHero} LLG Tokens</h4>
            </div>
            <button
              id="mintBtnHero"
              style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
              type="submit"
              className="btn mt-4 btn-block btn-outline-primary w-50"
            >
              Mint My Hero
            </button>
            <div className="mt-4">
            </div>
          </div>
        </form>
      </div>

    );
  }
}

export default FormAndPreview;
