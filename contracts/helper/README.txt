# **SushiV3StakingHelper Contract Documentation**

This document provides a comprehensive overview of the SushiV3StakingHelper smart contract, its functionalities, and how it interacts within the "Zero Loss Protocol" betting system.

## **1\. Introduction**

The SushiV3StakingHelper contract acts as a specialized intermediary for the BettingProtocol to interact with SushiSwap V3's concentrated liquidity pools. Its primary purpose is to receive a single participationToken from the BettingProtocol, convert it into the necessary token0 and token1 amounts for a 50/50 value-based liquidity provision, mint and manage a SushiSwap V3 NFT liquidity position, collect accrued fees, and convert all withdrawn assets back into the participationToken before returning them to the BettingProtocol.

This contract abstracts away the complexities of SushiSwap V3's concentrated liquidity, allowing the BettingProtocol to focus on its core betting logic while still benefiting from DeFi yield generation.

## **2\. Core Functionality**

The SushiV3StakingHelper performs the following key operations:

* **Staking (stake):** Receives participationToken from the BettingProtocol, calculates the required token0 and token1 amounts for a 50/50 value split at the current market price, performs necessary swaps, and then either mints a new SushiSwap V3 NFT position or increases liquidity in an existing one within a dynamically calculated price range.  
* **Harvesting (collectFees):** Claims accumulated trading fees from the active SushiSwap V3 NFT position, converts them back to participationToken, and sends them to the BettingProtocol.  
* **Unstaking (Partial Withdrawal) (decreaseLiquidityAndUnstake):** Reduces the liquidity of the NFT position by a specified percentage, withdraws the corresponding token0 and token1, collects any outstanding fees, converts all received tokens back to participationToken, and transfers them to the BettingProtocol.  
* **Exiting (Full Withdrawal) (burnPositionAndExit):** Decreases all liquidity from the NFT position, collects all underlying token0 and token1 and fees, burns the NFT, converts all received tokens back to participationToken, and transfers them to the BettingProtocol.

## **3\. Key Features**

* **BettingProtocol Compatibility:** Designed to seamlessly integrate with the existing BettingProtocol by accepting and returning a single participationToken.  
* **Automated Token Swaps:** Handles the conversion of participationToken into the required token0 and token1 for liquidity provision, and vice-versa for withdrawals and fee collection, using the SushiSwap V3 Router.  
* **Dynamic Concentrated Liquidity:** Allows the owner to define a liquiditySpreadTicks parameter, which dynamically calculates the tickLower and tickUpper bounds for the concentrated liquidity position around the current market price. This provides control over the concentration of liquidity.  
* **NFT Position Management:** Manages the lifecycle of the SushiSwap V3 NFT representing the liquidity position, including minting, increasing/decreasing liquidity, collecting fees, and burning.  
* **Access Control:** Utilizes the Ownable pattern to secure critical configuration functions and the isAllowed modifier to ensure that only the contract owner or the designated BettingProtocol can initiate staking, harvesting, and withdrawal operations.

## **4\. Interfaces**

The contract interacts with several external interfaces:

* **IBEP20**: Standard ERC20 token interface for interacting with participationToken, token0, and token1.  
* **IUniswapV3Pool**: Interface for querying the specific SushiSwap V3 liquidity pool (e.g., AUSD/WETH) to get its current tick, sqrtPriceX96, and tickSpacing.  
* **INonfungiblePositionManager**: Interface for interacting with the core SushiSwap V3 contract responsible for minting, managing, and burning NFT liquidity positions.  
* **ISwapRouter**: Interface for performing token swaps on SushiSwap V3.

## **5\. Constructor Parameters**

When deploying the SushiV3StakingHelper contract, the following parameters must be provided:

* \_positionManager (address): The address of the SushiSwap V3 NonfungiblePositionManager contract.  
* \_swapRouter (address): The address of the SushiSwap V3 SwapRouter contract.  
* \_poolAddress (address): The address of the specific SushiSwap V3 pool (e.g., AUSD/WETH pool) that this helper will provide liquidity to.  
* \_token0 (address): The address of the first token in the liquidity pair (e.g., AUSD).  
* \_token1 (address): The address of the second token in the liquidity pair (e.g., WETH).  
* \_fee (uint24): The fee tier of the target SushiSwap V3 pool (e.g., 500 for 0.05%, 3000 for 0.3%, 10000 for 1%). This must match the actual pool's fee.  
* \_liquiditySpreadTicks (uint256): The number of tick spacings to spread the liquidity around the current price. A smaller number means more concentrated liquidity.  
* \_participationToken (address): The address of the ERC20 token that the BettingProtocol uses for bets.  
* \_betPlatform (address): The address of the BettingProtocol contract that will utilize this helper.

## **6\. Public and External Functions**

* **setPositionManager(address \_positionManager) (external onlyOwner)**  
  * Sets the address of the NonfungiblePositionManager.  
* **setSwapRouter(address \_swapRouter) (external onlyOwner)**  
  * Sets the address of the SwapRouter.  
* **setPoolAddress(address \_poolAddress) (external onlyOwner)**  
  * Sets the address of the target SushiSwap V3 pool.  
* **setBetProtocolAddr(address \_betProtocolAddr) (external onlyOwner)**  
  * Sets the address of the BettingProtocol contract.  
* **setPoolParameters(address \_token0, address \_token1, uint24 \_fee) (external onlyOwner)**  
  * Sets the addresses of token0, token1, and the pool's fee tier.  
* **setParticipationToken(address \_participationToken) (external onlyOwner)**  
  * Sets the address of the participationToken.  
* **setLiquiditySpreadTicks(uint256 \_liquiditySpreadTicks) (external onlyOwner)**  
  * Sets the liquiditySpreadTicks for concentrated liquidity.  
* **stake(uint256 \_amount) (public isAllowed)**  
  * Receives \_amount of participationToken from msg.sender (expected to be BettingProtocol).  
  * Converts participationToken into token0 and token1 for a 50/50 value split.  
  * Calculates dynamic tickLower and tickUpper based on current price and liquiditySpreadTicks.  
  * Mints a new NFT position or increases liquidity in an existing one.  
* **collectFees() (public isAllowed)**  
  * Claims accumulated fees (in token0 and token1) from the NFT position.  
  * Converts collected fees back to participationToken.  
  * Transfers the participationToken fees to betProtocolAddr.  
* **decreaseLiquidityAndUnstake(uint128 liquidityPercentage) (public isAllowed)**  
  * Decreases liquidity of the NFT position by liquidityPercentage.  
  * Withdraws corresponding token0 and token1 and collects any remaining fees.  
  * Converts all received tokens back to participationToken.  
  * Transfers the participationToken to betProtocolAddr.  
* **burnPositionAndExit() (external isAllowed)**  
  * Decreases all liquidity from the NFT position.  
  * Collects all underlying token0 and token1 and fees.  
  * Burns the NFT position.  
  * Converts all received tokens back to participationToken.  
  * Transfers the participationToken to betProtocolAddr.  
* **claimToken(address \_wallet, address \_tokenAddress) (external isAllowed)**  
  * Allows the owner or BettingProtocol to transfer any accidentally sent ERC20 tokens from this contract to \_wallet.  
* **getPositionInfo() (public view)**  
  * Returns the current liquidity, tokensOwed0, and tokensOwed1 for the active NFT position.  
* **getParticipationTokenBalance() (public view)**  
  * Returns the current balance of participationToken held by this contract.

## **7\. Internal Helper Functions**

* **\_getPoolTickAndSpacing() (internal view)**  
  * Retrieves the current tick and tickSpacing from the target SushiSwap V3 pool.  
* **\_getNearestUsableTick(int24 tick, int24 tickSpacing) (internal pure)**  
  * Calculates the nearest tick that is a valid multiple of the pool's tickSpacing.  
* **\_getBalancedTokensForLiquidity(uint256 \_totalParticipationTokenAmount) (internal)**  
  * Takes a total amount of participationToken.  
  * Performs exactInputSingle swaps to convert this amount into token0 and token1 in a 50/50 value ratio based on the current market price.  
  * Returns the calculated amount0 and amount1 to be used for liquidity provision.  
* **\_convertTokensToParticipationToken(address \_tokenAddress, uint256 \_amount) (internal)**  
  * Converts a given \_amount of \_tokenAddress (either token0 or token1) back into the participationToken using exactInputSingle swap.  
  * Returns the amount of participationToken received.

## **8\. Events**

* **TokensSwapped(address indexed tokenIn, address indexed tokenOut, uint256 amountOut)**  
  * Emitted when a token swap occurs within the contract.  
* **FeesCollected(uint256 amount0, uint256 amount1, uint256 participationTokenAmount)**  
  * Emitted when fees are collected from the NFT position, showing original token0/token1 amounts and the final participationToken amount.  
* **LiquidityDecreased(uint256 amount0Withdrawn, uint256 amount1Withdrawn, uint256 participationTokenAmount)**  
  * Emitted when liquidity is partially decreased, showing withdrawn token0/token1 and the final participationToken amount.  
* **PositionBurned(uint256 amount0, uint256 amount1, uint256 participationTokenAmount)**  
  * Emitted when the NFT position is fully burned, showing the total token0/token1 amounts recovered and the final participationToken amount.

## **9\. Usage Notes and Considerations**

* **Slippage Control:** The amountOutMinimum and amountMin parameters in swap and liquidity functions are currently set to 0 for simplicity. **In a production environment, these should be carefully calculated and set based on acceptable slippage tolerance** to protect against unfavorable price movements.  
* **Gas Costs:** Interacting with SushiSwap V3 (especially minting and managing concentrated liquidity) can be gas-intensive.  
* **Price Range Management:** The liquiditySpreadTicks parameter offers a basic way to control concentration. More advanced strategies might involve dynamic rebalancing or multiple positions to optimize yield and minimize impermanent loss.  
* **Token Decimals:** Ensure that the IBEP20 interface and all token interactions correctly account for the decimal places of participationToken, token0, and token1.  
* **Testnet Deployment:** Before deploying to a mainnet, thoroughly test this contract on a testnet with realistic scenarios and actual SushiSwap V3 testnet addresses.  
* **Pool Address Verification:** The \_poolAddress provided in the constructor must be the correct, existing SushiSwap V3 pool address for the specified token0, token1, and fee tier.