// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

// Interface for a generic ERC20 token
interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address _owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address to, uint256 amount) external returns (bool);
}

// Struct for position details from the NonfungiblePositionManager
struct Position {
    uint96 nonce;
    address operator;
    address token0;
    address token1;
    uint24 fee;
    int24 tickLower;
    int24 tickUpper;
    uint128 liquidity;
    uint256 feeGrowthInside0LastX128;
    uint256 feeGrowthInside1LastX128;
    uint128 tokensOwed0;
    uint128 tokensOwed1;
}

// Interface for Uniswap V3 Pool (relevant functions for getting tick and sqrtPriceX96)
interface IUniswapV3Pool {
    function fee() external view returns (uint24);
    function tickSpacing() external view returns (int24);
    function slot0() external view returns (
        uint160 sqrtPriceX96,
        int24 tick,
        uint16 observationIndex,
        uint16 observationCardinality,
        uint16 observationCardinalityNext,
        uint8 feeProtocol,
        bool unlocked
    );
    function liquidity() external view returns (uint128);
    function token0() external view returns (address);
    function token1() external view returns (address);
}

// Interface for Uniswap V3 NonfungiblePositionManager
// Sushiswap V3's NonfungiblePositionManager should have a very similar interface
interface INonfungiblePositionManager {
    function mint(
        tuple(
            address token0,
            address token1,
            uint24 fee,
            int24 tickLower,
            int24 tickUpper,
            uint256 amount0Desired,
            uint256 amount1Desired,
            uint256 amount0Min,
            uint256 amount1Min,
            address recipient,
            uint256 deadline
        ) params
    ) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);

    function increaseLiquidity(
        tuple(
            uint256 tokenId,
            uint256 amount0Desired,
            uint256 amount1Desired,
            uint256 amount0Min,
            uint256 amount1Min,
            uint256 deadline
        ) params
    ) external payable returns (uint128 liquidity, uint256 amount0, uint256 amount1);

    function decreaseLiquidity(
        tuple(
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0Min,
            uint256 amount1Min,
            uint256 deadline
        ) params
    ) external returns (uint256 amount0, uint256 amount1);

    function collect(
        tuple(
            uint256 tokenId,
            address recipient,
            uint128 amount0Max,
            uint128 amount1Max
        ) params
    ) external returns (uint256 amount0, uint256 amount1);

    function burn(uint256 tokenId) external payable;

    function positions(uint256 tokenId) external view returns (
        uint96 nonce,
        address operator,
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity,
        uint256 feeGrowthInside0LastX128;
        uint256 feeGrowthInside1LastX128;
        uint128 tokensOwed0;
        uint128 tokensOwed1;
    );
}

// Interface for Uniswap V3 Swap Router (Sushiswap V3 router should have similar functions)
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);

    struct ExactOutputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountOut;
        uint256 amountInMaximum;
        uint160 sqrtPriceLimitX96;
    }

    function exactOutputSingle(ExactOutputSingleParams calldata params) external payable returns (uint256 amountIn);

    // For multi-hop swaps, if needed in the future
    // function exactInput(tuple(bytes path, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint256 deadline) params) external payable returns (uint256 amountOut);
    // function exactOutput(tuple(bytes path, address recipient, uint256 amountOut, uint256 amountInMaximum, uint256 deadline) params) external payable returns (uint256 amountIn);
}

// Basic context contract for sender information
abstract contract Context {
    constructor() {}
    function _msgSender() internal view returns (address) {
        return msg.sender;
    }
}

// Ownable contract for access control
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

/**
 * @title SushiV3StakingHelper
 * @notice A staking helper contract designed to create, manage, and redeem
 * Sushiswap V3 concentrated liquidity positions (NFTs).
 * This contract will receive participation tokens from the BettingProtocol,
 * convert them to token0 and token1 for liquidity, mint an NFT position,
 * collect fees, and convert all back to participation token upon withdrawal.
 */
contract SushiV3StakingHelper is Ownable {

    // Address of the BettingProtocol contract that uses this helper
    address public betProtocolAddr;
    // Interface to the Sushiswap V3 NonfungiblePositionManager contract
    INonfungiblePositionManager public positionManager;
    // Interface to the Sushiswap V3 Swap Router
    ISwapRouter public swapRouter;
    // Interface to the specific Uniswap V3 Pool (e.g., AUSD/WETH pool)
    IUniswapV3Pool public pool;

    // The ID of the minted NFT position
    uint256 public nftTokenId;

    // The two tokens in the liquidity pair
    address public token0;
    address public token1;
    // The fee tier of the pool (e.g., 500, 3000, 10000)
    uint24 public fee;

    // The token used by the BettingProtocol (e.g., MMO token)
    IBEP20 public participationToken;

    // How concentrated the liquidity should be around the current price, in number of tick spacings
    // E.g., 10 means 10 tick spacings below current tick and 10 tick spacings above.
    uint256 public liquiditySpreadTicks; // Renamed from liquiditySpreadBps for clarity in V3 context

    // Events for tracking actions
    event TokensSwapped(address indexed tokenIn, address indexed tokenOut, uint256 amountOut);
    event FeesCollected(uint256 amount0, uint256 amount1, uint256 participationTokenAmount);
    event LiquidityDecreased(uint256 amount0Withdrawn, uint256 amount1Withdrawn, uint256 participationTokenAmount);
    event PositionBurned(uint256 amount0, uint256 amount1, uint256 participationTokenAmount);

    // Modifier to restrict access to the owner or the linked BettingProtocol
    modifier isAllowed() {
        require(
            (_msgSender() == betProtocolAddr) || (_msgSender() == owner()),
            "SushiV3StakingHelper: Operation not allowed"
        );
        _;
    }

    /**
     * @dev Constructor to initialize the SushiV3StakingHelper.
     * @param _positionManager The address of the Sushiswap V3 NonfungiblePositionManager contract.
     * @param _swapRouter The address of the Sushiswap V3 Swap Router contract.
     * @param _poolAddress The address of the specific Sushiswap V3 pool (e.g., AUSD/WETH pool).
     * @param _token0 The address of the first token in the pair (e.g., AUSD).
     * @param _token1 The address of the second token in the pair (e.g., WETH).
     * @param _fee The fee tier of the pool (e.g., 500 for 0.05%, 3000 for 0.3%, 10000 for 1%).
     * @param _liquiditySpreadTicks The number of tick spacings to spread liquidity around the current tick.
     * @param _participationToken The address of the ERC20 token used by the BettingProtocol.
     * @param _betPlatform The address of the BettingProtocol contract that will use this helper.
     */
    constructor(
        address _positionManager,
        address _swapRouter,
        address _poolAddress,
        address _token0,
        address _token1,
        uint24 _fee,
        uint256 _liquiditySpreadTicks,
        address _participationToken,
        address _betPlatform
    ) {
        require(_positionManager != address(0), "PositionManager address cannot be zero");
        require(_swapRouter != address(0), "SwapRouter address cannot be zero");
        require(_poolAddress != address(0), "Pool address cannot be zero");
        require(_token0 != address(0), "Token0 address cannot be zero");
        require(_token1 != address(0), "Token1 address cannot be zero");
        require(_betPlatform != address(0), "BetPlatform address cannot be zero");
        require(_participationToken != address(0), "ParticipationToken address cannot be zero");
        require(_token0 != _token1, "Tokens cannot be the same");

        positionManager = INonfungiblePositionManager(_positionManager);
        swapRouter = ISwapRouter(_swapRouter);
        pool = IUniswapV3Pool(_poolAddress);
        token0 = _token0;
        token1 = _token1;
        fee = _fee;
        liquiditySpreadTicks = _liquiditySpreadTicks;
        participationToken = IBEP20(_participationToken);
        betProtocolAddr = _betPlatform;

        // Approve the position manager and swap router to spend tokens from this contract
        IBEP20(token0).approve(address(positionManager), type(uint256).max);
        IBEP20(token1).approve(address(positionManager), type(uint256).max);
        participationToken.approve(address(swapRouter), type(uint256).max);
        IBEP20(token0).approve(address(swapRouter), type(uint256).max); // In case token0 needs to be swapped to token1
        IBEP20(token1).approve(address(swapRouter), type(uint256).max); // In case token1 needs to be swapped to token0
    }

    /**
     * @dev Sets the address of the NonfungiblePositionManager. Only callable by the owner.
     * @param _positionManager The new PositionManager address.
     */
    function setPositionManager(address _positionManager) external onlyOwner {
        require(_positionManager != address(0), "PositionManager address cannot be zero");
        positionManager = INonfungiblePositionManager(_positionManager);
        IBEP20(token0).approve(address(positionManager), type(uint256).max);
        IBEP20(token1).approve(address(positionManager), type(uint256).max);
    }

    /**
     * @dev Sets the address of the Swap Router. Only callable by the owner.
     * @param _swapRouter The new Swap Router address.
     */
    function setSwapRouter(address _swapRouter) external onlyOwner {
        require(_swapRouter != address(0), "SwapRouter address cannot be zero");
        swapRouter = ISwapRouter(_swapRouter);
        participationToken.approve(address(swapRouter), type(uint256).max);
        IBEP20(token0).approve(address(swapRouter), type(uint256).max);
        IBEP20(token1).approve(address(swapRouter), type(uint256).max);
    }

    /**
     * @dev Sets the address of the Uniswap V3 Pool. Only callable by the owner.
     * @param _poolAddress The new Pool address.
     */
    function setPoolAddress(address _poolAddress) external onlyOwner {
        require(_poolAddress != address(0), "Pool address cannot be zero");
        pool = IUniswapV3Pool(_poolAddress);
    }

    /**
     * @dev Sets the BettingProtocol address. Only callable by the owner.
     * @param _betProtocolAddr The new BettingProtocol address.
     */
    function setBetProtocolAddr(address _betProtocolAddr) external onlyOwner {
        require(_betProtocolAddr != address(0), "BetProtocol address cannot be zero");
        betProtocolAddr = _betProtocolAddr;
    }

    /**
     * @dev Sets the token addresses and fee tier for the liquidity pool. Only callable by the owner.
     * @param _token0 The new token0 address.
     * @param _token1 The new token1 address.
     * @param _fee The new fee tier.
     */
    function setPoolParameters(address _token0, address _token1, uint24 _fee) external onlyOwner {
        require(_token0 != address(0), "Token0 address cannot be zero");
        require(_token1 != address(0), "Token1 address cannot be zero");
        require(_token0 != _token1, "Tokens cannot be the same");
        token0 = _token0;
        token1 = _token1;
        fee = _fee;
        IBEP20(token0).approve(address(positionManager), type(uint256).max);
        IBEP20(token1).approve(address(positionManager), type(uint256).max);
        IBEP20(token0).approve(address(swapRouter), type(uint256).max);
        IBEP20(token1).approve(address(swapRouter), type(uint256).max);
    }

    /**
     * @dev Sets the participation token address. Only callable by the owner.
     * @param _participationToken The new participation token address.
     */
    function setParticipationToken(address _participationToken) external onlyOwner {
        require(_participationToken != address(0), "ParticipationToken address cannot be zero");
        participationToken = IBEP20(_participationToken);
        participationToken.approve(address(swapRouter), type(uint256).max);
    }

    /**
     * @dev Sets the liquidity spread in terms of tick spacings. Only callable by the owner.
     * @param _liquiditySpreadTicks The new number of tick spacings to spread liquidity.
     */
    function setLiquiditySpreadTicks(uint256 _liquiditySpreadTicks) external onlyOwner {
        liquiditySpreadTicks = _liquiditySpreadTicks;
    }

    /**
     * @dev Helper function to get the current tick and tick spacing from the pool.
     * @return currentTick_ The current tick of the pool.
     * @return tickSpacing_ The tick spacing of the pool.
     */
    function _getPoolTickAndSpacing() internal view returns (int24 currentTick_, int24 tickSpacing_) {
        ( , currentTick_, , , , , ) = pool.slot0();
        tickSpacing_ = pool.tickSpacing();
    }

    /**
     * @dev Helper function to get the nearest usable tick that is a multiple of tickSpacing.
     * @param tick The raw tick value.
     * @param tickSpacing The tick spacing of the pool.
     * @return The nearest usable tick.
     */
    function _getNearestUsableTick(int24 tick, int24 tickSpacing) internal pure returns (int24) {
        return (tick / tickSpacing) * tickSpacing;
    }

    /**
     * @dev Calculates the desired amounts of token0 and token1 for a 50/50 value split
     * from the total participation token amount. Performs necessary swaps.
     * @param _totalParticipationTokenAmount The total amount of participationToken to use for liquidity.
     * @return amount0_ The calculated amount of token0 to provide.
     * @return amount1_ The calculated amount of token1 to provide.
     */
    function _getBalancedTokensForLiquidity(uint256 _totalParticipationTokenAmount) internal returns (uint256 amount0_, uint256 amount1_) {
        // Transfer the participationToken from the BettingProtocol to this contract first
        // This is handled in the stake() function before calling this.

        uint256 halfAmountIn = _totalParticipationTokenAmount / 2;

        // Swap half of participationToken to token0
        // Ensure approval is done in constructor/setters
        amount0_ = swapRouter.exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(participationToken),
                tokenOut: token0,
                fee: fee, // Use the pool's fee for this swap
                recipient: address(this),
                deadline: block.timestamp + 300, // 5 minutes deadline
                amountIn: halfAmountIn,
                amountOutMinimum: 0, // Consider adding slippage control (e.g., halfAmountIn * 99 / 100)
                sqrtPriceLimitX96: 0
            })
        );
        emit TokensSwapped(address(participationToken), token0, amount0_);

        // Swap the remaining participationToken to token1
        // (total - halfAmountIn might be slightly different due to odd/even division, use balance)
        uint256 remainingParticipationTokenBalance = participationToken.balanceOf(address(this));
        amount1_ = swapRouter.exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(participationToken),
                tokenOut: token1,
                fee: fee, // Use the pool's fee for this swap
                recipient: address(this),
                deadline: block.timestamp + 300,
                amountIn: remainingParticipationTokenBalance, // Use remaining balance
                amountOutMinimum: 0, // Consider adding slippage control
                sqrtPriceLimitX96: 0
            })
        );
        emit TokensSwapped(address(participationToken), token1, amount1_);
    }

    /**
     * @dev Stakes the `participationToken` received from the BettingProtocol by
     * converting it to token0 and token1, then providing liquidity to Sushiswap V3.
     * This function is called by the BettingProtocol.
     * @param _amount The amount of participationToken to stake.
     */
    function stake(uint256 _amount) public isAllowed {
        require(_amount > 0, "Amount to stake must be greater than 0");

        // Transfer participationToken from BettingProtocol to this helper
        participationToken.transferFrom(msg.sender, address(this), _amount);

        // Get balanced token amounts for liquidity provision
        (uint256 amount0Desired, uint256 amount1Desired) = _getBalancedTokensForLiquidity(_amount);

        // Calculate tickLower and tickUpper based on current price and spread
        (int24 currentTick, int24 tickSpacing) = _getPoolTickAndSpacing();
        int24 adjustedTickLower = _getNearestUsableTick(currentTick - int24(liquiditySpreadTicks * tickSpacing), tickSpacing);
        int24 adjustedTickUpper = _getNearestUsableTick(currentTick + int24(liquiditySpreadTicks * tickSpacing), tickSpacing);

        // Ensure tickLower is less than tickUpper and within bounds
        require(adjustedTickLower < adjustedTickUpper, "Calculated tickLower must be less than tickUpper");

        // Define slippage tolerance (e.g., 1% slippage)
        uint256 amount0Min = amount0Desired * 99 / 100;
        uint256 amount1Min = amount1Desired * 99 / 100;

        if (nftTokenId == 0) {
            // Mint a new position if no NFT exists yet
            (nftTokenId, , , ) = positionManager.mint(
                INonfungiblePositionManager.mintParams({
                    token0: token0,
                    token1: token1,
                    fee: fee,
                    tickLower: adjustedTickLower,
                    tickUpper: adjustedTickUpper,
                    amount0Desired: amount0Desired,
                    amount1Desired: amount1Desired,
                    amount0Min: amount0Min,
                    amount1Min: amount1Min,
                    recipient: address(this), // This contract holds the NFT
                    deadline: block.timestamp + 300 // 5 minutes deadline
                })
            );
        } else {
            // Increase liquidity for the existing position
            positionManager.increaseLiquidity(
                INonfungiblePositionManager.increaseLiquidityParams({
                    tokenId: nftTokenId,
                    amount0Desired: amount0Desired,
                    amount1Desired: amount1Desired,
                    amount0Min: amount0Min,
                    amount1Min: amount1Min,
                    deadline: block.timestamp + 300 // 5 minutes deadline
                })
            );
        }
    }

    /**
     * @dev Collects accumulated fees from the NFT position, converts them to participationToken,
     * and transfers them to the BettingProtocol. This acts as the "harvest" mechanism.
     */
    function collectFees() public isAllowed {
        require(nftTokenId != 0, "No NFT position exists to collect fees from");

        // Get current position details to know owed tokens
        Position memory currentPosition = positionManager.positions(nftTokenId);

        (uint256 amount0Collected, uint256 amount1Collected) = positionManager.collect(
            INonfungiblePositionManager.collectParams({
                tokenId: nftTokenId,
                recipient: address(this), // Collect to this contract first
                amount0Max: type(uint128).max, // Collect all owed token0
                amount1Max: type(uint128).max  // Collect all owed token1
            })
        );

        uint256 totalParticipationTokenCollected = 0;
        if (amount0Collected > 0) {
            totalParticipationTokenCollected += _convertTokensToParticipationToken(token0, amount0Collected);
        }
        if (amount1Collected > 0) {
            totalParticipationTokenCollected += _convertTokensToParticipationToken(token1, amount1Collected);
        }

        // Transfer combined participationToken to BettingProtocol
        if (totalParticipationTokenCollected > 0) {
            participationToken.transfer(betProtocolAddr, totalParticipationTokenCollected);
        }

        emit FeesCollected(amount0Collected, amount1Collected, totalParticipationTokenCollected);
    }

    /**
     * @dev Decreases liquidity for the NFT position, converts the underlying tokens
     * and any collected fees back to participationToken, and transfers them to the BettingProtocol.
     * @param liquidityPercentage The percentage of total liquidity to decrease (e.g., 50 for 50%).
     */
    function decreaseLiquidityAndUnstake(uint128 liquidityPercentage) public isAllowed {
        require(nftTokenId != 0, "No NFT position exists to decrease liquidity from");
        require(liquidityPercentage > 0 && liquidityPercentage <= 100, "Percentage must be between 1 and 100");

        // Get current position liquidity
        Position memory currentPosition = positionManager.positions(nftTokenId);
        uint128 liquidityToDecrease = currentPosition.liquidity * liquidityPercentage / 100;
        require(liquidityToDecrease > 0, "Calculated liquidity to decrease is zero");

        // Define slippage tolerance for withdrawal (e.g., 1% slippage)
        uint256 amount0MinWithdraw = 0; // Can be calculated based on current price and liquidity
        uint256 amount1MinWithdraw = 0; // Can be calculated based on current price and liquidity

        (uint256 amount0Withdrawn, uint256 amount1Withdrawn) = positionManager.decreaseLiquidity(
            INonfungiblePositionManager.decreaseLiquidityParams({
                tokenId: nftTokenId,
                liquidity: liquidityToDecrease,
                amount0Min: amount0MinWithdraw,
                amount1Min: amount1MinWithdraw,
                deadline: block.timestamp + 300 // 5 minutes deadline
            })
        );

        // Collect any remaining fees for the decreased liquidity
        (uint256 amount0CollectedFees, uint256 amount1CollectedFees) = positionManager.collect(
            INonfungiblePositionManager.collectParams({
                tokenId: nftTokenId,
                recipient: address(this), // Collect to this contract first
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );

        uint256 totalParticipationTokenReturned = 0;
        if (amount0Withdrawn > 0) {
            totalParticipationTokenReturned += _convertTokensToParticipationToken(token0, amount0Withdrawn);
        }
        if (amount1Withdrawn > 0) {
            totalParticipationTokenReturned += _convertTokensToParticipationToken(token1, amount1Withdrawn);
        }
        if (amount0CollectedFees > 0) {
            totalParticipationTokenReturned += _convertTokensToParticipationToken(token0, amount0CollectedFees);
        }
        if (amount1CollectedFees > 0) {
            totalParticipationTokenReturned += _convertTokensToParticipationToken(token1, amount1CollectedFees);
        }

        // Transfer combined participationToken to BettingProtocol
        if (totalParticipationTokenReturned > 0) {
            participationToken.transfer(betProtocolAddr, totalParticipationTokenReturned);
        }

        emit LiquidityDecreased(amount0Withdrawn, amount1Withdrawn, totalParticipationTokenReturned);
    }

    /**
     * @dev Burns the entire NFT position, withdraws all underlying tokens and fees,
     * converts them back to participationToken, and transfers them to the BettingProtocol.
     * This acts as the "exit" mechanism.
     */
    function burnPositionAndExit() external isAllowed {
        require(nftTokenId != 0, "No NFT position exists to burn");

        // Decrease all liquidity first
        Position memory currentPosition = positionManager.positions(nftTokenId);
        if (currentPosition.liquidity > 0) {
            // Define slippage tolerance for full withdrawal
            uint256 amount0MinFullWithdraw = 0; // Can be calculated
            uint256 amount1MinFullWithdraw = 0; // Can be calculated

            positionManager.decreaseLiquidity(
                INonfungiblePositionManager.decreaseLiquidityParams({
                    tokenId: nftTokenId,
                    liquidity: currentPosition.liquidity,
                    amount0Min: amount0MinFullWithdraw,
                    amount1Min: amount1MinFullWithdraw,
                    deadline: block.timestamp + 300
                })
            );
        }

        // Collect any remaining tokens (liquidity and fees)
        (uint256 amount0Collected, uint256 amount1Collected) = positionManager.collect(
            INonfungiblePositionManager.collectParams({
                tokenId: nftTokenId,
                recipient: address(this), // Collect to this contract first
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );

        // Burn the NFT
        positionManager.burn(nftTokenId);
        nftTokenId = 0; // Reset tokenId as position is burned

        uint256 totalParticipationTokenReturned = 0;
        if (amount0Collected > 0) {
            totalParticipationTokenReturned += _convertTokensToParticipationToken(token0, amount0Collected);
        }
        if (amount1Collected > 0) {
            totalParticipationTokenReturned += _convertTokensToParticipationToken(token1, amount1Collected);
        }

        // Transfer combined participationToken to BettingProtocol
        if (totalParticipationTokenReturned > 0) {
            participationToken.transfer(betProtocolAddr, totalParticipationTokenReturned);
        }

        emit PositionBurned(amount0Collected, amount1Collected, totalParticipationTokenReturned);
    }

    /**
     * @dev Converts a given amount of a specified token back into the participationToken.
     * @param _tokenAddress The address of the token to convert (token0 or token1).
     * @param _amount The amount of the token to convert.
     * @return The amount of participationToken received from the swap.
     */
    function _convertTokensToParticipationToken(address _tokenAddress, uint256 _amount) internal returns (uint256) {
        if (_tokenAddress == address(participationToken)) {
            return _amount; // No conversion needed if it's already the participation token
        }
        if (_amount == 0) {
            return 0; // No amount to convert
        }

        // Perform the swap from _tokenAddress to participationToken
        uint256 amountOut = swapRouter.exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: _tokenAddress,
                tokenOut: address(participationToken),
                fee: fee, // Assuming the same fee tier for this swap, or determine dynamically
                recipient: address(this), // Swap to this contract
                deadline: block.timestamp + 300,
                amountIn: _amount,
                amountOutMinimum: 0, // Consider adding slippage control
                sqrtPriceLimitX96: 0
            })
        );
        emit TokensSwapped(_tokenAddress, address(participationToken), amountOut);
        return amountOut;
    }

    /**
     * @dev Returns the current liquidity and collected fees for the NFT position.
     * @return liquidity_ The current liquidity of the position.
     * @return tokensOwed0_ The amount of token0 fees owed.
     * @return tokensOwed1_ The amount of token1 fees owed.
     */
    function getPositionInfo() public view returns (uint128 liquidity_, uint128 tokensOwed0_, uint128 tokensOwed1_) {
        if (nftTokenId == 0) {
            return (0, 0, 0);
        }
        Position memory currentPosition = positionManager.positions(nftTokenId);
        return (currentPosition.liquidity, currentPosition.tokensOwed0, currentPosition.tokensOwed1);
    }

    /**
     * @dev Returns the current balance of participationToken held by this contract.
     * @return The balance of participationToken.
     */
    function getParticipationTokenBalance() public view returns (uint256) {
        return participationToken.balanceOf(address(this));
    }
}
