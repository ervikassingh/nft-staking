// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./IUniswapV2Pair.sol";
import "./IUniswapV2Factory.sol";
import "./IUniswapV2Router02.sol";
import "./ERC20.sol";

contract LucidLandsGem is Context, ERC20, Ownable {
    using SafeMath for uint256;

    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;

    address payable public _marketingWalletAddress =
        payable(0x0534474C7D2E7023196c5d5c769cCEc8FcB239BD);

    address payable public _devWalletAddress =
        payable(0xBd25a03B27CD302CD3681bA3274a36F3Aafc84f7);

    address private constant deadWallet =
        0x000000000000000000000000000000000000dEaD;

    uint256 public swapTokensAtAmount = 200000 * (10**18);

    uint256 public _maxTxAmount = 1000000 * (10**18);
    uint256 public _maxWalletAmount = 5000000 * (10**18);

    uint256 private constant _totalsupply = 100000000 * (10**18);

    mapping(address => bool) public _isBlacklisted;

    mapping(address => bool) private _isExcludedFromFees;

    uint256 public _liquidityFee = 3;
    uint256 public _previousLiquidityFee;
    uint256 public _devFee = 4;
    uint256 public _prevDevFee;
    uint256 public _marketingFee = 3;
    uint256 public _prevMarketingFee;
    uint256 public botFee = 99;
    bool public tradingOpen = false;
    uint256 public deadBlocks = 6;
    uint256 public launchedAt = 0;
    bool private swapping;

    uint256 public _totalFees = _liquidityFee.add(_marketingFee).add(_devFee);

    event ExcludeFromFees(address indexed account, bool isExcluded);
    event ExcludeMultipleAccountsFromFees(address[] accounts, bool isExcluded);
    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity
    );

    event UpdateUniswapV2Router(
        address indexed newAddress,
        address indexed oldAddress
    );

    constructor() ERC20("LucidLandsGem", "LLG") {
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(
            0xD99D1c33F9fC3444f8101754aBC46c52416550D1
        );
        // Create a uniswap pair for this new token
        address _uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());

        uniswapV2Router = _uniswapV2Router;
        uniswapV2Pair = _uniswapV2Pair;

        // exclude from paying fees or having max transaction amount
        excludeFromFees(owner(), true);
        excludeFromFees(_marketingWalletAddress, true);
        excludeFromFees(_devWalletAddress, true);
        excludeFromFees(address(this), true);

        /*
            _mint is an internal function in ERC20.sol that is only called here,
            and CANNOT be called ever again
        */
        _mint(owner(), _totalsupply);
    }

    receive() external payable {}

    function updateUniswapV2Router(address newAddress)
        external
        onlyOwner
        returns (bool)
    {
        require(
            newAddress != address(uniswapV2Router),
            "LucidLandsGem: The router already has that address"
        );
        emit UpdateUniswapV2Router(newAddress, address(uniswapV2Router));
        uniswapV2Router = IUniswapV2Router02(newAddress);
        address _uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory())
            .createPair(address(this), uniswapV2Router.WETH());
        uniswapV2Pair = _uniswapV2Pair;

        return true;
    }

    function excludeFromFees(address account, bool excluded)
        public
        onlyOwner
        returns (bool)
    {
        require(
            _isExcludedFromFees[account] != excluded,
            "LucidLandsGem: Account is already excluded from fees"
        );
        _isExcludedFromFees[account] = excluded;

        emit ExcludeFromFees(account, excluded);

        return true;
    }

    function excludeMultipleAccountsFromFees(
        address[] calldata accounts,
        bool excluded
    ) external onlyOwner returns (bool) {
        for (uint256 i = 0; i < accounts.length; i++) {
            _isExcludedFromFees[accounts[i]] = excluded;
        }

        emit ExcludeMultipleAccountsFromFees(accounts, excluded);

        return true;
    }

    function setLiquidityFee(uint256 value) external onlyOwner returns (bool) {
        _liquidityFee = value;

        return true;
    }

    function setMarketingWallet(address wallet)
        external
        onlyOwner
        returns (bool)
    {
        _marketingWalletAddress = payable(wallet);

        return true;
    }

    function setDevWallet(address wallet) external onlyOwner returns (bool) {
        _devWalletAddress = payable(wallet);

        return true;
    }

    function isExcludedFromFees(address account) external view returns (bool) {
        return _isExcludedFromFees[account];
    }

    function blacklistAddress(address account, bool value)
        external
        onlyOwner
        returns (bool)
    {
        _isBlacklisted[account] = value;

        return true;
    }

    function isBlacklisted(address account) external view returns (bool) {
        return _isBlacklisted[account];
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer Amount Should be greater than 0");
        require(
            !_isBlacklisted[from] && !_isBlacklisted[to],
            "Blacklisted address"
        );
        if (!_isExcludedFromFees[from] || !_isExcludedFromFees[to]) {
            require(
                amount <= _maxTxAmount,
                "Transfer amount exceeds the maxTxAmount."
            );
            uint256 accountBalance = balanceOf(to);
            require(
                (accountBalance + amount) <= _maxWalletAmount,
                "Max wallet Exceeded"
            );
        }

        require(tradingOpen, "Trading not open yet");

        if (launchedAt + deadBlocks > block.number) {
            uint256 fees = amount.mul(botFee).div(100);

            amount = amount.sub(fees);

            super._transfer(from, address(this), fees);

            super._transfer(from, to, amount);
        } else {
            uint256 contractTokenBalance = balanceOf(address(this));
            bool canSwap = contractTokenBalance >= swapTokensAtAmount;

            if (
                canSwap &&
                !swapping &&
                from != owner() &&
                to != owner() &&
                from != uniswapV2Pair
            ) {
                swapping = true;

                uint256 feesTokens = contractTokenBalance
                    .mul(_marketingFee + _devFee)
                    .div(_totalFees);
                swapAndSendToFee(feesTokens);

                uint256 swapTokens = contractTokenBalance
                    .mul(_liquidityFee)
                    .div(_totalFees);
                swapAndLiquify(swapTokens);

                swapping = false;
            }

            bool takeFee = !swapping;

            // if any account belongs to _isExcludedFromFee account then remove the fee
            if (_isExcludedFromFees[from] || _isExcludedFromFees[to]) {
                takeFee = false;
            }

            if (takeFee) {
                uint256 fees = amount.mul(_totalFees).div(100);

                amount = amount.sub(fees);

                super._transfer(from, address(this), fees);
            }

            super._transfer(from, to, amount);
        }
    }

    function swapAndLiquify(uint256 tokens) private {
        // split the contract balance into halves
        uint256 half = tokens.div(2);
        uint256 otherHalf = tokens.sub(half);

        // capture the contract's current ETH balance.
        // this is so that we can capture exactly the amount of ETH that the
        // swap creates, and not make the liquidity event include any ETH that
        // has been manually sent to the contract
        uint256 initialBalance = address(this).balance;

        // swap tokens for ETH
        swapTokensForEth(half); // swap half of the tokens for ETH

        // how much ETH did we just swap into?
        uint256 newBalance = address(this).balance.sub(initialBalance);

        // add liquidity to uniswap
        addLiquidity(otherHalf, newBalance);

        emit SwapAndLiquify(half, newBalance, otherHalf);
    }

    function swapAndSendToFee(uint256 tokens) private {
        uint256 initialBalance = address(this).balance;
        swapTokensForEth(tokens);
        uint256 transferredBalance = address(this).balance.sub(initialBalance);

        //Send to Marketing address
        transferToAddressETH(
            _marketingWalletAddress,
            transferredBalance.mul(_marketingFee).div(_totalFees)
        );

        //Send to Dev address
        transferToAddressETH(
            _devWalletAddress,
            transferredBalance.mul(_devFee).div(_totalFees)
        );
    }

    function swapTokensForEth(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // add the liquidity
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(0),
            block.timestamp
        );
    }

    function transferToAddressETH(address payable recipient, uint256 amount)
        private
    {
        recipient.transfer(amount);
    }

    function _removeAllFee() private {
        if (_devFee == 0 && _marketingFee == 0 && _liquidityFee == 0) return;

        _prevDevFee = _devFee;
        _prevMarketingFee = _marketingFee;
        _previousLiquidityFee = _liquidityFee;

        _devFee = 0;
        _marketingFee = 0;
        _liquidityFee = 0;
    }

    function _restoreAllFee() private {
        _devFee = _prevDevFee;
        _marketingFee = _prevMarketingFee;
        _liquidityFee = _previousLiquidityFee;
    }

    function removeAllFee() external onlyOwner {
        _removeAllFee();
    }

    function restoreAllFee() external onlyOwner {
        _restoreAllFee();
    }

    function tradingStatus(bool _status, uint256 _deadBlocks) public onlyOwner {
        tradingOpen = _status;
        if (tradingOpen && launchedAt == 0) {
            launchedAt = block.number;
            deadBlocks = _deadBlocks;
        }
    }

    function withdraw() external onlyOwner returns (bool) {
        payable(msg.sender).transfer(address(this).balance);

        return true;
    }
}
