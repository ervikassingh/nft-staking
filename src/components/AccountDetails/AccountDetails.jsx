import React from "react";

const AccountDetails = ({ accountAddress, accountBalance }) => {
  return (
    <div>
      <div className="jumbotron">
        <h1 className="display-5">Shroomie's NFT Marketplace</h1>
        <p className="lead">
          Shroomie's marketplace where you can mint, buy or sell{" "}
          <i>Shroomies</i> and manage them.
        </p>
        <hr className="my-4" />
        <p className="lead">Account address :</p>
        <h4>{accountAddress}</h4>
        <p className="lead">Account balance :</p>
        <h4>{accountBalance} BNB</h4>
      </div>
    </div>
  );
};

export default AccountDetails;
