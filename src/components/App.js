import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import Web3 from "web3";

import ShroomieS from "../abis/ShroomieS.json";
import Heroes from "../abis/Heroes.json";
import HeroesSale from "../abis/HeroesSale.json";
import LucidLandsGem from "../abis/LucidLandsGem.json";

import FormAndPreview from "../components/FormAndPreview/FormAndPreview";
import AllShroomieS from "./AllShroomieS/AllShroomieS";
import AllHeros from "./AllHeros/AllHeros";
import AccountDetails from "./AccountDetails/AccountDetails";
import ContractNotDeployed from "./ContractNotDeployed/ContractNotDeployed";
import ConnectToMetamask from "./ConnectMetamask/ConnectToMetamask";
import Loading from "./Loading/Loading";
import Navbar from "./Navbar/Navbar";
import MyShroomieS from "./MyShroomieS/MyShroomieS";
import MyHeros from "./MyHeros/MyHeros";
import Queries from "./Queries/Queries";
import ChangeMintPrice from "./ChangeMintPrice/ChangeMintPrice";
import HeroDetail from "./HeroDetail/HeroDetail";

import data from "../data/metadata.json";
import herodata from "../data/hero-metadata.json";

// const ipfsClient = require("ipfs-http-client");
// const ipfs = ipfsClient({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
// });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: "",
      accountBalance: "",
      loading: true,
      metamaskConnected: false,
      contractDetected: false,

      contractOwner: "",
      mintPrice: 0,
      mintPriceHero: 0,
      mintPriceLLG: 0,

      shroomieSContract: null,
      shroomieSCount: 0,
      shroomieS: [],

      totalTokensMinted: 0,
      totalTokensOwnedByAccount: 0,

      heroesContract: null,
      heroesCount: 0,
      heroes: [],
      usersCount: 0,
      users: [],

      heroesSaleContract: null,
      heroesSaleContractAddress: '',

      lastMintTime: null,
      lastMintTimeHero: null,

      totalInMarketplace: 0,
      marketplaceData: [],
      totalMyHero: 0,
      myHeroData: [],

      LLGContractAddress: '0x33A4d5A32BA66B2Bb0F79dF8b0a8577E95E2da6A',
      LLGContractOwner: '0x1cD8bEE77Ff02261C0A69aD3b64ca75C8456CB01',
      balanceLLG: 0,
      LLGContract: null,

      stakeTimeStamp: 0,
      rewardEarned: 0
    };
  }

  componentDidMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setMetaData();
    await this.setMintBtnTimer();
    await this.setMintBtnTimerHero();
    await this.setStakeTimer();
    await this.setMarketplace();
    await this.setMyHeroes();
  };

  setMarketplace = async () => {
    for (var k = 0; k < this.state.heroes.length; k++) {
      var item = this.state.heroes[k];
      var tokenid = item.tokenId.toNumber();

      for (var l = 0; l < this.state.users.length; l++) {
        var useritem = this.state.users[l];
        var useraddress = useritem.userAddress;
        if (useritem.sales[tokenid - 1].toNumber() > 0) {
          this.setState(
            {
              ...this.state,
              totalInMarketplace: this.state.totalInMarketplace + useritem.sales[tokenid - 1].toNumber()
            });
          var data = {
            tokenId: tokenid,
            tokenName: item.tokenName,
            tokenURI: item.tokenURI,
            userAddress: useraddress,
            noInSale: useritem.sales[tokenid - 1].toNumber(),
            salePrice: window.web3.utils.fromWei(useritem.salePrice[tokenid - 1].toString(), "Ether"),
          };
          // console.log(data)
          this.setState(
            {
              ...this.state,
              marketplaceData: [...this.state.marketplaceData, data]
            });
        }
      }
    }
  };

  setMyHeroes = async () => {
    let my_data = this.state.users.filter(
      (user) => user.userAddress === this.state.accountAddress
    );
    my_data = my_data[0];

    if (my_data) {
      for (var k = 0; k < this.state.heroes.length; k++) {
        var item = this.state.heroes[k];
        var tokenid = item.tokenId.toNumber();
        var no = await this.state.heroesContract.methods.balanceOf(this.state.accountAddress, tokenid).call();
        if (no < 1) {
          continue;
        }
        this.setState(
          {
            ...this.state,
            totalMyHero: this.state.totalMyHero + no.toNumber()
          });
        let hero = {
          tokenId: tokenid,
          tokenName: item.tokenName,
          tokenURI: item.tokenURI,
          balance: no.toNumber(),
          sales: my_data.sales[tokenid - 1].toNumber(),
          stakes: my_data.stakes[tokenid - 1].toNumber(),
          salePrice: window.web3.utils.fromWei(my_data.salePrice[tokenid - 1].toString(), "Ether"),
        };
        // console.log(hero)
        this.setState(
          {
            ...this.state,
            myHeroData: [...this.state.myHeroData, hero]
          });
      }
    }
  };

  setMintBtnTimer = () => {
    const mintBtn = document.getElementById("mintBtn");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.setState({
        lastMintTime: localStorage.getItem(this.state.accountAddress),
      });
      this.state.lastMintTime === undefined || this.state.lastMintTime === null
        ? (mintBtn.innerHTML = "Mint My Shroomie")
        : this.checkIfCanMint(parseInt(this.state.lastMintTime));
    }
  };
  setMintBtnTimerHero = () => {
    const mintBtn = document.getElementById("mintBtnHero");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.setState({
        lastMintTimeHero: localStorage.getItem(this.state.accountAddress + "Hero"),
      });
      this.state.lastMintTimeHero === undefined || this.state.lastMintTimeHero === null
        ? (mintBtn.innerHTML = "Mint My Hero")
        : this.checkIfCanMintHero(parseInt(this.state.lastMintTimeHero));
    }
  };

  checkIfCanMint = (lastMintTime) => {
    const mintBtn = document.getElementById("mintBtn");
    const timeGap = 300000; //5min in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Mint My Shroomie";
        localStorage.removeItem(this.state.accountAddress);
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };
  checkIfCanMintHero = (lastMintTime) => {
    const mintBtn = document.getElementById("mintBtnHero");
    const timeGap = 300000; //5min in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Mint My Hero";
        localStorage.removeItem(this.state.accountAddress + "Hero");
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };

  setStakeTimer = () => {
    const mintBtn = document.getElementById("stakeBtn");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.state.stakeTimeStamp === undefined || this.state.stakeTimeStamp === null
        ? (mintBtn.innerHTML = "Change No. of tokens on Stake")
        : this.checkIfCanStake(parseInt(this.state.stakeTimeStamp));
    }
  };
  checkIfCanStake = (lastMintTime) => {
    const mintBtn = document.getElementById("stakeBtn");
    const timeGap = 3 * 24 * 60 * 60 * 1000; //3days in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Change No. of tokens on Stake";
        clearInterval(interval);
      } else {
        const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 7);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next Change in ${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    }
    // else if (window.web3) {
    //   window.web3 = new Web3(window.web3.currentProvider);
    // }
    else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      this.setState({ accountBalance });
      this.setState({ loading: false });
      const networkId = await web3.eth.net.getId();
      const networkData = ShroomieS.networks[networkId];
      if (networkData) {
        this.setState({ loading: true });
        const shroomieSContract = web3.eth.Contract(
          ShroomieS.abi,
          networkData.address
        );
        this.setState({ shroomieSContract });
        this.setState({ contractDetected: true });
        const shroomieSCount = await shroomieSContract.methods
          .shroomYCounter()
          .call();
        this.setState({ shroomieSCount });
        var i;
        for (i = 1; i <= shroomieSCount; i++) {
          const shroomY = await shroomieSContract.methods
            .allShroomieS(i)
            .call();
          this.setState({
            shroomieS: [...this.state.shroomieS, shroomY],
          });
          // console.log(shroomY)
        }
        let totalTokensMinted = await shroomieSContract.methods
          .getNumberOfTokensMinted()
          .call();
        totalTokensMinted = totalTokensMinted.toNumber();
        this.setState({ totalTokensMinted });
        let totalTokensOwnedByAccount = await shroomieSContract.methods
          .getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress)
          .call();
        totalTokensOwnedByAccount = totalTokensOwnedByAccount.toNumber();
        this.setState({ totalTokensOwnedByAccount });
        let contractOwner = await shroomieSContract.methods
          .getOwner()
          .call();
        this.setState({ contractOwner });
        let mintPrice = await shroomieSContract.methods
          .getMintPrice()
          .call();
        this.setState({ mintPrice });


        const networkDataHero = Heroes.networks[networkId];
        if (networkDataHero) {
          const heroesContract = web3.eth.Contract(
            Heroes.abi,
            networkDataHero.address
          );
          this.setState({ heroesContract });

          const stakeTimeStamp = await heroesContract.methods
            .timestamps(this.state.accountAddress).call();
          this.setState({ stakeTimeStamp });
          const rewardEarned = await heroesContract.methods
            .rewards(this.state.accountAddress).call();
          this.setState({ rewardEarned });

          const heroesCount = await heroesContract.methods
            .heroCounter().call();
          const usersCount = await heroesContract.methods
            .userCounter().call();
          this.setState({ heroesCount });
          this.setState({ usersCount });

          let mintPriceHero = await heroesContract.methods
            .getMintPrice()
            .call();
          // console.log(mintPriceHero)
          this.setState({ mintPriceHero });

          for (i = 1; i <= heroesCount; i++) {
            const hero = await heroesContract.methods
              .allHeroes(i).call();
            this.setState({
              heroes: [...this.state.heroes, hero],
            });
            // console.log(hero);
          }

          for (i = 1; i <= usersCount; i++) {
            var sales = [];
            var stakes = [];
            var salePrice = [];
            var address = await heroesContract.methods
              .allUsers(i).call();

            var j = 1; var temp = 0;
            for (j = 1; j <= heroesCount; j++) {
              temp = await heroesContract.methods
                .getSales(address, j).call();
              sales = [...sales, temp];
            }
            for (j = 1; j <= heroesCount; j++) {
              temp = await heroesContract.methods
                .getStakes(address, j).call();
              stakes = [...stakes, temp];
            }
            for (j = 1; j <= heroesCount; j++) {
              temp = await heroesContract.methods
                .getSalePrice(address, j).call();
              salePrice = [...salePrice, temp];
            }
            var data = { userAddress: address, sales: sales, stakes: stakes, salePrice: salePrice };
            this.setState({
              users: [...this.state.users, data]
            });
            // console.log(data);
          }

        }

        const networkDataHeroSale = HeroesSale.networks[networkId];
        if (networkDataHeroSale) {
          const heroesSaleContract = web3.eth.Contract(
            HeroesSale.abi,
            networkDataHeroSale.address
          );
          this.setState({ heroesSaleContract });
          this.setState({ ...this.state, heroesSaleContractAddress: networkDataHeroSale.address });

        }


        const LLGContract = web3.eth.Contract(
          LucidLandsGem.abi,
          this.state.LLGContractAddress
        );
        this.setState({ LLGContract });
        // console.log(LLGContract);

        const balanceLLG = await LLGContract.methods.balanceOf(this.state.LLGContractOwner).call();
        this.setState({ balanceLLG });
        // console.log(window.web3.utils.fromWei(balanceLLG.toString(), "Ether"));

        this.setState({ loading: false });
      } else {
        this.setState({ contractDetected: false });
      }
    }
  };

  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };

  setMetaData = async () => {
    if (this.state.shroomieS.length !== 0) {
      this.state.shroomieS.map(async (shroomy) => {
        const result = await fetch(shroomy.tokenURI);
        const metaData = await result.json();
        this.setState({
          shroomieS: this.state.shroomieS.map((shroomy) =>
            shroomy.tokenId.toNumber() === Number(metaData.tokenId)
              ? {
                ...shroomy,
                metaData,
              }
              : shroomy
          ),
        });
      });
    }
  };

  mintMyNFT = async (tokenPrice) => {
    this.setState({ loading: true });

    let shroomYCounter = await this.state.shroomieSContract.methods
      .shroomYCounter()
      .call();
    shroomYCounter = shroomYCounter.toNumber();
    shroomYCounter = shroomYCounter + 1;
    shroomYCounter = '#' + shroomYCounter;

    let index = 0;
    data.forEach((item, i) => {
      if (item.name === shroomYCounter) {
        index = i;
        return i;
      }
    });
    // console.log(data[index]);

    const uriIsUsed = await this.state.shroomieSContract.methods
      .tokenURIExists(data[index].image)
      .call();

    const nameIsUsed = await this.state.shroomieSContract.methods
      .tokenNameExists(data[index].name)
      .call();

    if (!nameIsUsed && !uriIsUsed) {

      const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");
      this.state.shroomieSContract.methods
        .mintShroomY(data[index].name, data[index].image, price)
        .send({ from: this.state.accountAddress, value: price })
        .on("confirmation", () => {
          localStorage.setItem(this.state.accountAddress, new Date().getTime());
          this.setState({ loading: false });
          window.location.reload();
        });
    } else {
      alert('Unable to Mint NFT');
      this.setState({ loading: false });
    }
  };

  randomPick = arr => {
    let k = Math.random()
    // get the first value that makes "rnd int" negative on subtraction
    let res = arr.find(val => (k -= val) < 0)
    return res || arr.pop() // else pop the last one
  }
  mintMyNFTHero = async (tokenPrice) => {
    this.setState({ loading: true });
    let prob = [0.003, 0.150, 0.350, 0.497]
    let random = this.randomPick(prob);
    let rarityid = 3;
    for (let i = 0; i < prob.length; i++) {
      if (prob[i] === random) {
        rarityid = i;
        break;
      }
    }
    let heroes_rarity_match = [];
    herodata.forEach((item, i) => {
      if (item.rarity_id === rarityid) {
        heroes_rarity_match = [...heroes_rarity_match, item];
      }
    });
    var hero_matched = heroes_rarity_match[Math.floor(Math.random() * heroes_rarity_match.length)];
    // console.log(hero_matched);

    this.state.LLGContract.methods
      .transfer(this.state.LLGContractOwner, window.web3.utils.toWei(tokenPrice.toString(), "Ether"))
      .send({ from: this.state.accountAddress })
      .once('receipt', (receipt) => {
        this.state.heroesContract.methods
          .mintHero(hero_matched.name, hero_matched.image)
          .send({ from: this.state.accountAddress })
          .on("confirmation", () => {
            localStorage.setItem(this.state.accountAddress + "Hero", new Date().getTime());
            this.setState({ loading: false });
            window.location.reload();
          });
      });

  };

  mintMyLLG = async (noOfToken) => {
    this.setState({ loading: true });

    //   // web3.eth.sendTransaction({ to: this.state.LLGContractOwner, from: this.state.accountAddress, value: 0.001 * noOfToken })
    //   // .once('receipt', (receipt) => {
    //   this.state.LLGContract.methods
    //     .transferFrom(this.state.LLGContractOwner, this.state.accountAddress, window.web3.utils.toWei(noOfToken.toString(), "Ether"))
    //     .send({ from: this.state.accountAddress })
    //     .on("confirmation", () => {
    //       this.setState({ loading: false });
    //       window.location.reload();
    //     })
    //   // }

    this.setState({ loading: false });
  };

  toggleForSale = (tokenId) => {
    this.setState({ loading: true });
    this.state.shroomieSContract.methods
      .toggleForSale(tokenId)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  changeTokenPrice = (tokenId, newPrice) => {
    this.setState({ loading: true });
    const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
    this.state.shroomieSContract.methods
      .changeTokenPrice(tokenId, newTokenPrice)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  buyShroomY = (tokenId, price) => {
    this.setState({ loading: true });
    this.state.shroomieSContract.methods
      .buyToken(tokenId)
      .send({ from: this.state.accountAddress, value: price })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  giftShroomY = (tokenId, receiver) => {
    this.setState({ loading: true });
    this.state.shroomieSContract.methods
      .giftToken(tokenId, receiver)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  toggleSale = (tokenId, amount, toggle) => {
    // console.log(this.state.heroesSaleContractAddress)
    this.setState({ loading: true });
    this.state.heroesContract.methods
      .toggleForSale(tokenId, amount, toggle, this.state.heroesSaleContractAddress)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };


  calculateReward = async (now, tokenName) => {
    // const reward = [2000, 1000, 500, 300];
    let timestamp = await this.state.heroesContract.methods
      .timestamps(this.state.accountAddress)
      .call();
    timestamp = timestamp.toNumber();
    if (timestamp === 0) {
      return 0;
    } else {
      let diff = now - timestamp;
      diff = diff / (365 * 24 * 60 * 60 * 1000);

      let matchedItem;
      herodata.forEach((item, i) => {
        if (item.name === tokenName) {
          matchedItem = item;
        }
      });
      // let rarity_id = matchedItem.rarity_id;
      let res = diff * (matchedItem.reward_per_year);
      res = window.web3.utils.toWei(res.toString(), "Ether");
      return res;
    }
  }

  toggleStake = async (tokenId, tokenName, amount, toggle) => {
    this.setState({ loading: true });
    const now = new Date().getTime();
    let reward = await this.calculateReward(now, tokenName);
    // console.log(reward);

    this.state.heroesContract.methods
      .toggleForStake(tokenId, amount, toggle, now, reward)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });

  };

  changeTokenPriceHero = (tokenId, newPrice) => {
    this.setState({ loading: true });
    const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
    this.state.heroesContract.methods
      .setPrice(tokenId, newTokenPrice)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  buyHero = (tokenId, amount, from, price) => {
    this.setState({ loading: true });
    this.state.LLGContract.methods
      .transfer(from, window.web3.utils.toWei(price.toString(), "Ether"))
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.state.heroesSaleContract.methods
          .buyHero(tokenId, amount, from)
          .send({ from: this.state.accountAddress })
          .on("confirmation", () => {
            this.setState({ loading: false });
            window.location.reload();
          });
      });
  };

  giftHero = (tokenId, amount, to) => {
    this.setState({ loading: true });

    this.state.heroesSaleContract.methods
      .giftHero(tokenId, amount, to)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  render() {
    return (
      <div className="w-100">
        {!this.state.metamaskConnected ? (
          <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
        ) : !this.state.contractDetected ? (
          <ContractNotDeployed />
        ) : this.state.loading ? (
          <Loading />
        ) : (
          <>
            <HashRouter basename="/">
              <Navbar state={{ accountAddress: this.state.accountAddress, contractOwner: this.state.contractOwner }} />
              <Route
                path="/"
                exact
                render={() => (
                  <AccountDetails
                    accountAddress={this.state.accountAddress}
                    accountBalance={this.state.accountBalance}
                  />
                )}
              />
              <Route
                path="/mint"
                render={() => (
                  <FormAndPreview
                    mintMyNFT={this.mintMyNFT}
                    mintPrice={this.state.mintPrice}
                    setMintBtnTimer={this.setMintBtnTimer}
                    mintMyNFTHero={this.mintMyNFTHero}
                    mintPriceHero={this.state.mintPriceHero}
                    setMintBtnTimerHero={this.setMintBtnTimerHero}
                    mintPriceLLG={this.state.mintPriceLLG}
                    mintMyLLG={this.mintMyLLG}
                    balanceLLG={this.state.balanceLLG}
                  />
                )}
              />
              <Route
                path="/marketplace"
                render={() => (
                  <AllShroomieS
                    shroomieSContract={this.state.shroomieSContract}
                    accountAddress={this.state.accountAddress}
                    shroomieS={this.state.shroomieS}
                    totalTokensMinted={this.state.totalTokensMinted}
                    buyShroomY={this.buyShroomY}
                  />
                )}
              />
              <Route
                path="/marketplace-hero"
                render={() => (
                  <AllHeros
                    accountAddress={this.state.accountAddress}
                    heroesContract={
                      this.state.heroesContract
                    }
                    totalInMarketplace={this.state.totalInMarketplace}
                    marketplaceData={this.state.marketplaceData}
                    changeTokenPriceHero={this.changeTokenPriceHero}
                    toggleForSaleHero={this.toggleForSaleHero}
                    buyHero={this.buyHero}
                  />
                )}
              />
              <Route
                path="/my-tokens"
                render={() => (
                  <MyShroomieS
                    shroomieSContract={this.state.shroomieSContract}
                    accountAddress={this.state.accountAddress}
                    shroomieS={this.state.shroomieS}
                    totalTokensOwnedByAccount={
                      this.state.totalTokensOwnedByAccount
                    }
                    changeTokenPrice={this.changeTokenPrice}
                    toggleForSale={this.toggleForSale}
                    giftShroomY={this.giftShroomY}
                  />
                )}
              />
              <Route
                path="/my-hero"
                render={() => (
                  <MyHeros
                    accountAddress={this.state.accountAddress}
                    heroesContract={
                      this.state.heroesContract
                    }
                    totalMyHero={this.state.totalMyHero}
                    myHeroData={this.state.myHeroData}
                    toggleSale={this.toggleSale}
                    toggleStake={this.toggleStake}
                    changeTokenPriceHero={this.changeTokenPriceHero}
                    setStakeTimer={this.setStakeTimer}
                    rewardEarned={this.state.rewardEarned}
                    giftHero={this.giftHero}
                  />
                )}
              />
              <Route
                path="/queries"
                render={() => (
                  <Queries shroomieSContract={this.state.shroomieSContract} />
                )}
              />
              <Route
                path="/change-price"
                render={() => (
                  <ChangeMintPrice shroomieSContract={this.state.shroomieSContract}
                    heroesContract={this.state.heroesContract}
                    accountAddress={this.state.accountAddress}
                    mintPrice={this.state.mintPrice}
                    mintPriceHero={this.state.mintPriceHero} />
                )}
              />
              <Route
                path="/hero-detail/:name"
                render={() => (
                  <HeroDetail
                    shroomieSContract={this.state.shroomieSContract}
                    accountAddress={this.state.accountAddress}
                    mintPrice={this.state.mintPrice} />
                )} />
            </HashRouter>
          </>
        )}
      </div>
    );
  }
}

export default App;
