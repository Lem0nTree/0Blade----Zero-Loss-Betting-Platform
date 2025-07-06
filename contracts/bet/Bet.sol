// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    function internalOwnerCheck() internal view {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }
    
    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        internalOwnerCheck();
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}

// CAUTION
// This version of SafeMath should only be used with Solidity 0.8 or later,
// because it relies on the compiler's built in overflow checks.

/**
 * @dev Wrappers over Solidity's arithmetic operations.
 *
 * NOTE: `SafeMath` is generally not needed starting with Solidity 0.8, since the compiler
 * now has built in overflow checking.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


/**
 * @title The interface for the events Oracle (`BetOracle`)
 * @notice Declares the functions that the `BetOracle` contract exposes externally
 */
interface OracleInterface {
    function eventExists(bytes32 _eventId)
        external view returns (bool);

    function getEvent(bytes32 _eventId) 
        external view returns (
            bytes32         id,
            string memory   name,
            string[] memory participants,
            uint8           participantCount,
            uint32          catagory,
            uint256         minParticipantionAmount,
            uint            date,
            string[] memory outcome,
            uint16[] memory outcomeMultiplier,
            uint8[] memory  declaredOutcomeIndex,
            int8            winner
        );
    
    function getMinParticipantAmount(
        bytes32 _eventId
    )
        external view returns (uint256);

    function getBetStartTime(
        bytes32 _eventId
    )
        external view returns (uint256);

    function getOutComeCount(bytes32 _eventId) 	
        external view returns (uint256);
        
    function testConnection() 
        external pure returns (bool);
}

interface IStakingHelper {
    function stake() external;
    function unstake(uint256 _amount) external;
    function exit() external;
    function claimToken(address _tokenAddress) external;
}

/** 
 * This Ethereum smart-contract takes bets placed on sport events.  
 * It then invests all bets deposits for a given event (pot) in DeFi.  
 * Then once the event outcome is confirmed,
 * it makes the accrued interests ready for the winners 
 * to withdraw proportionnaly to their initial stake.  
 * Players do not loose their stake.
 *
 * @notice Takes bets and handles payouts for sport events
 * @title  a Smart-Contract in charge of handling bets on a sport event outcome where players do not loose their stake and winners earn the interests accrued on the stakes.
 */
contract BettingProtocol is Ownable, ReentrancyGuard {

    using SafeMath for uint256; 

    /**
     * @dev payload of a bet on a sport event
     */
    struct Bet {
        bytes16     betID;
        address     user;           // who placed it
        uint256     amount;         // bet amount
        uint8       selectedOutCome;   // Index of the team that will win according to the player
        uint256     betTime;        // time of bet
        uint256     betSettlementTime;  // bet Settlement Time
        bool        betSettled;     // boolean for settlement check
        bool        betRevoked;     // boolean for bet reworked check
    }

    /**
     * @dev An instance of ERC20 Token
     */
    IERC20 public participationToken;
    IERC20 public rewardToken;
    uint256 public minimumBet;
    uint256 public platformFee;
    bytes32 public eventId;
    address public betManager;
    address public devAddr;
    uint256 public treasuryFund;
    bytes16[] private betList;
    IStakingHelper public stakingHelper;

    uint256 public bettingPeriod = 7 days;
    uint256 public lockingPeriod = 7 days;
    uint256 public claimingPeriod = 14 days;
    uint256 public WITHDRAW_FEE = 1000; // 10% withdraw Fee

    uint256 public startTime;

    uint256 public totalBettedAmount;
    uint256 public profit;
    uint256 public totalBets;
    mapping(uint8 => uint256) public bettedAmount;
    mapping(uint8 => uint256) public betCount; 
    mapping(address => uint256) public userBetCount;
    mapping(bytes16 => bool) public betIdMap;

    uint16[] private outcomeMultiplier;
    uint8[] private declaredOutcome;
    int private winner;
    uint256 private rewardPerMuliplier;

    /** 
     * @dev list of all bets per player, ie. a map composed (player address => bet id) pairs
     */
    mapping(address => mapping(bytes16 => Bet)) public bets;

    /** 
     * @dev Address of the sport events Oracle
     */
    address internal oracleAddress;

    /**
     *  @dev Instance of the sport events Oracle (used to register sport events get their outcome).
     */
    OracleInterface internal betOracle; 

    /**
     * @dev Sent when once a bet is placed
     */
    event BetPlaced(
            bytes16 indexed _betID,
            address indexed _user,
            uint8   _selectedOutCome, 
            uint    _amount
    );

    event BetRevoked(
            bytes16 indexed _betID,
            address indexed _user,
            uint256 _timestamp
    );

    event BetResultDeclared(
            address indexed _operator,
            uint256 _profit,
            uint256 _platformFee    
    );

    event claimed(
            address indexed _user,
            bytes16 indexed _betId,
            uint256 _bettedAmount,
            uint256 _withdarwFee,
            uint256 _rewardAmount,
            uint256 _timestamp
    );

    event TreasuryDeposit(
            address indexed _operator,
            address _treasury,
            uint256 _amount
    );

    event TreasuryWithdraw(
            address indexed _operator,
            address _treasury,
            uint256 _amount
    );

    event EmergencyWithdarwen(
            address indexed _operator,
            address _wallet,
            uint256 _amount
    );

    event TokenRecovered(
            address indexed _operator,
            address _token,
            uint256 _amount
    );


    /**
     * @param _participationToken the address of the deployed ERC20 DAI token 
     */
    constructor(
        address _participationToken,
        address _rewardToken,
        address _oracleAddress, 
        bytes32 _eventId,
        uint256 _platformFee,
        uint256 _startTime,
        uint256 _bettingPeriod,
        uint256 _lockingPeriod,
        uint256 _claimingPeriod,
        address _devAddr)
    {
        require(_participationToken != address(0), "_participationToken should be valid Address");
        require(_rewardToken != address(0), "_rewardToken should be valid Address");
        require(_oracleAddress != address(0), "_oracleAddress should be valid Address");
        require(OracleInterface(_oracleAddress).testConnection(), "_oracleAddress is valid oracle");
        require(OracleInterface(_oracleAddress).eventExists(_eventId), "_eventId should be valid");
        require(_platformFee <= 10000, "platformFee cann't be more then 100%");
        require(_startTime >= block.timestamp && 
                _startTime < OracleInterface(_oracleAddress).getBetStartTime(_eventId),
                "_startTime should be greater then current time");
        require(_devAddr != address(0), "_devAddr should be valid Address");

        oracleAddress = _oracleAddress;
        betOracle = OracleInterface(_oracleAddress);
        eventId = _eventId;
        participationToken = IERC20(_participationToken);
        rewardToken = IERC20(_rewardToken);
        startTime = _startTime;
        platformFee = _platformFee;
        minimumBet = betOracle.getMinParticipantAmount(_eventId);
        devAddr = _devAddr;
        bettingPeriod = _bettingPeriod;
        lockingPeriod = _lockingPeriod;
        claimingPeriod = _claimingPeriod;

        require(minimumBet > 0, "minimumBet Amount should be non-Zero");
    }


    /**** Modifier's ****/

    modifier onlyOperator() {
        require(msg.sender == owner() ||
                msg.sender == betManager,
                "Access restricted to operator only!!");      
        _;
    }

    /***************************************/

    /**** Internal Function's ****/
    function toBytes16(uint256 x) internal pure returns (bytes16 b) {
       return bytes16(bytes32(x));
    }

    function generateID(address x, uint256 y, bytes1 z) internal pure returns (bytes16 b) {
        b = toBytes16(
            uint256(
                keccak256(
                    abi.encodePacked(x, y, z)
                )
            )
        );
    }

    function updateBetList(bytes16 _betId) internal {
        uint256 length = betList.length;

        for(uint256 i = 0; i < length; i++)
        {
            if (betList[i] == _betId)
            {
                betList[i] = betList[length - 1];
                betList.pop();
                break;
            }
        }
    }

    /***************************************/

    /**** Public View Function's ****/

    /**
     * @return _betId next possible BetId 
     * @param _user user address who next possible betId need to identified
     */
    function generateBetID(address _user) public view returns (bytes16 _betId) {
        return generateID(_user, userBetCount[_user], 0x01);
    }

    /**
     * @return _bets array of bets user has palced
     * @param _user user address whoes betId need to retrive
     * @param _offset starting index of betId
     * @param _length number betId need retrive from _offset index
     */
    function betPagination(
        address _user,
        uint256 _offset,
        uint256 _length
    )
        external
        view
        returns (bytes16[] memory _bets)
    {
        uint256 start = _offset > 0 &&
            userBetCount[_user] > _offset ?
            userBetCount[_user] - _offset : userBetCount[_user];

        uint256 finish = _length > 0 &&
            start > _length ?
            start - _length : 0;

        uint256 i;

        _bets = new bytes16[](start - finish);

        for (uint256 _index = start; _index > finish; _index--) {
            bytes16 _betID = generateID(_user, _index - 1, 0x01);
            if (bets[_user][_betID].amount > 0) {
                _bets[i] = _betID; i++;
            }
        }
    }

    function getBetDetails(address _user, bytes16 _betId) 
        public view 
        returns (
            uint256 amount_,
            uint8 selectedOutCome_,
            uint256 betTime_,
            uint256 betSettlementTime_,
            bool betSettled_,
            bool betRevoked_,
            bool winner_, 
            uint256 rewardAmount_
        ) 
    {

       Bet memory betDetails =  bets[_user][_betId];
       
       amount_ = betDetails.amount;
       selectedOutCome_ = betDetails.selectedOutCome;
       betTime_ = betDetails.betTime;
       betSettlementTime_ = betDetails.betSettlementTime;
       betSettled_ = betDetails.betSettled;
       betRevoked_ = betDetails.betRevoked;
       winner_ = isWinner(_user, _betId);
       if (winner_) {
           rewardAmount_ = claimableReward(_user, _betId);
       }
    }

    /**
     * @return returns true if bet result is declared else return false
     */
    function resultDeclared() 
        public view 
        returns (bool)
    {
        if (declaredOutcome.length != 0)
        {
            return true;
        }
        return false;
    }

    /**
     * @return returns true if _user has won bet, else return false
     * @param _user user address 
     * @param _betId betId who result need to check
     */
    function isWinner(
        address _user,
        bytes16 _betId
    )
        public view
        returns (bool) 
    {
        if (declaredOutcome.length != 0)
        {
            Bet memory betDetail = bets[_user][_betId];

            for (uint8 i=0; i < declaredOutcome.length; i++)
            {
                if(betDetail.selectedOutCome == declaredOutcome[i])
                {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @return _rewardAmount profit claimable amount if user won bet, else return 0
     * @param _user user address 
     * @param _betId betId who result need to check
     */
    function claimableReward(
        address _user,
        bytes16 _betId
    )
        public view
        returns (uint256 _rewardAmount) 
    {
        require(betIdMap[_betId], "Invalid Bet!!!");

        if (isWinner(_user, _betId) == false) {
            return 0;
        } 

        Bet memory betDetail = bets[_user][_betId];
        uint256 rewardPerToken = rewardPerMuliplier
                                 .mul(outcomeMultiplier[betDetail.selectedOutCome-1])
                                 .mul(1e18)
                                 .div(bettedAmount[betDetail.selectedOutCome]);
        
        _rewardAmount = rewardPerToken.mul(betDetail.amount).div(1e18);
    }

    function getBetList() public view returns (bytes16[] memory) 
    {
        return betList;
    }

    /**
     * @notice for testing purposes: make sure that the sport event oracle is callable 
     */
    function testOracleConnection() 
        public view returns (bool)
    {
        return oracleAddress != address(0) && betOracle.testConnection(); 
    }

   /**
     * @return the address of the oracle we use to get the sport events and their outcomes
     */
    function getOracleAddress() 
        external view returns (address)
    {
        return oracleAddress;
    }

    /**
     * @notice gets the specified sport event and return its data
     * @return _id   the id of the event
     * @return _name the name of the event
     * @return _participants array of participants with the name of the event's
     * @return _participantCount the number of the event's participants
     * @return _catagory index of sports catagory
     * @return _minParticipationAmount min amount of token with which user can participant in bet
     * @return _date when the event takes place
     * @return _outcome array of possible outcome an String Array that represents the event 
     * @return _outcomeMultiplier array of outcomes multiplier 
     * @return _declaredOutcomeIndex array of declaredOutcomeIndex an integer that represents the event 
     * @return _winner the index of the winner
     */
    function getEventDetails()
        external view returns (
            bytes32         _id,
            string memory   _name,
            string[] memory _participants,
            uint8           _participantCount,
            uint32          _catagory,
            uint256         _minParticipationAmount,
            uint            _date,
            string[] memory _outcome,
            uint16[] memory _outcomeMultiplier,
            uint8[] memory  _declaredOutcomeIndex,
            int8            _winner
        )
    { 
        return betOracle.getEvent(eventId); 
    }

    /***************************************/


    /**** Access Restricted Function's ****/

    /**
     * @notice sets the address of the sport event bet oracle contract to use 
     * @dev setting a wrong address may result in false return value, or error 
     * @param _oracleAddress the address of the sport event bet oracle 
     */
    function setOracleAddress(address _oracleAddress)
        external onlyOwner
    {
        require(OracleInterface(_oracleAddress).testConnection(), "_oracleAddress is valid oracle");

        oracleAddress = _oracleAddress;
        betOracle = OracleInterface(oracleAddress);
        minimumBet = betOracle.getMinParticipantAmount(eventId);
        require(minimumBet > 0, "minimumBet Amount should be non-Zero");
    }

    /**
     * @dev sets the betting platform staking Helper Address 
     * @param _stakingHelper staking helper contract address
     */
    function setStakingHelper(address _stakingHelper)
        external onlyOwner 
    {
        stakingHelper = IStakingHelper(_stakingHelper);
    }

    /**
     * @dev sets the Bet withdraw fee
     * @param _fee Bet Withdraw fee
     */
    function setWithdrawFee(uint256 _fee)
        external onlyOwner 
    {
        WITHDRAW_FEE = _fee;
    }

    /**
     * @dev sets the betting platform fee 
     * @param _platformFee platform fee in percentage with 2 decimal multiplier (i.e 10% == 1000)
     */
    function setPlatformFee(uint256 _platformFee)
        external onlyOwner 
    {
        require(_platformFee <= 10000, "platformFee cann't be more then 100%");

        platformFee = _platformFee;
    }

    /**
     * @dev sets the betManager address 
     * @param _betManager betManager wallet address
     */
    function setBetManager(address _betManager)
        external onlyOwner 
    {
        betManager = _betManager;
    }

    /**
     * @dev sets the dev address 
     * @param _dev dev wallet address where platfrom fee will be transfered
     */
    function setDevAddr(address _dev)
        external onlyOwner 
    {
        devAddr = _dev;
    }

    /**
     * @dev sets the betting periods
     * @param _bettingPeriod betting period in Seconds
     * @param _lockingPeriod locking period in Seconds
     * @param _claimingPeriod claiming period in Seconds
     */
    function setBettingPeriod(uint256 _bettingPeriod, uint256 _lockingPeriod, uint256 _claimingPeriod)
        external onlyOwner 
    {
        if(_bettingPeriod > 0)
            bettingPeriod = _bettingPeriod;
        
        if(_lockingPeriod > 0)
            lockingPeriod = _lockingPeriod;

        if(_claimingPeriod > 0)
            claimingPeriod = _claimingPeriod;
    }

    /**
     * @dev declare bet result
     */
    function declareBetResult() 
        external onlyOperator 
    {
    
        require(!resultDeclared(), 
                "Result is already Declared!!");

        (, , , , , , , ,outcomeMultiplier, declaredOutcome, winner) = betOracle.getEvent(eventId);

        require(winner != -1 && 
                declaredOutcome.length != 0,
                "Event result is not yet declared on BetOracle, Try later!!!");

        uint16 totalMultiplier;
        for (uint8 i; i < declaredOutcome.length; i++)
        {
            if (betCount[declaredOutcome[i]] > 0) {
                totalMultiplier += outcomeMultiplier[declaredOutcome[i]-1];
            }
            
        }

        stakingHelper.exit();
        uint256 profitBeforeFee;
        if (address(participationToken) == address(rewardToken)) {
            profitBeforeFee = rewardToken.balanceOf(address(this))
                                        .sub(totalBettedAmount)
                                        .sub(treasuryFund);
        } else {
            profitBeforeFee = rewardToken.balanceOf(address(this));
        }
        
        uint256 fee = profitBeforeFee.mul(platformFee).div(10000);

        profit = profitBeforeFee.sub(fee);
        if (totalMultiplier > 0) {
            rewardPerMuliplier = profit.div(totalMultiplier);
        }

        rewardToken.transfer(devAddr, fee);
        emit BetResultDeclared(msg.sender, profit, fee);
    }

    /**
     * @dev recover ERC20 token sent to contract by mistake
     * @param _token ERC20 token address
     * @param _amount amount of ERC20 token need to recover
     */
    function recoverToken(
        address _token,
        uint256 _amount
    )
        external onlyOwner
    {
        require(_token != address(0x0) && 
                IERC20(_token).totalSupply() > 0,
                 "_token shoule be valid ERC20 token Address");
        
        IERC20(_token).transfer(owner(), _amount);

        emit TokenRecovered(msg.sender, _token, _amount);
    }

    /**
     * @dev emergency withdraw participation Token
     */
    function emergencyWithdarw()
        external onlyOwner
    {
        stakingHelper.exit();
        participationToken.transfer(owner(), participationToken.balanceOf(address(this)));

        if (address(participationToken) != address(rewardToken)) {
            rewardToken.transfer(owner(), rewardToken.balanceOf(address(this)));
        }
        
        emit EmergencyWithdarwen(msg.sender, owner(), participationToken.balanceOf(address(this)));
    }

    /**
     * @dev deposit extra fund to increase reward of betting platform
     * @param _treasury treasury wallet address who funds extra fund
     * @param _amount amount of token treasury want's to contribute
     */
    function treasuryDeposit(
        address _treasury,
        uint256 _amount
    )
        external onlyOwner
    {
        require(_treasury != address(0x0),
                "_treasury should be valid address.");

        require(_amount != 0,
                "_amount should be > 0");
        
        require(block.timestamp < startTime.add(bettingPeriod).add(lockingPeriod), 
                "Time laps to deposit treasury fund");

        participationToken.transferFrom(_treasury, address(stakingHelper), _amount);
        stakingHelper.stake();
        treasuryFund = treasuryFund.add(_amount);

        emit TreasuryDeposit(msg.sender, _treasury, _amount);
    }

    /**
     * @dev withdraw extra fund sent by treasury to increase reward
     * @param _treasury treasury wallet address who funds extra fund
     * @param _amount amount of token treasury want's to recover
     */
    function treasuryWithdraw(
        address _treasury,
        uint256 _amount
    )
        external onlyOwner
    {
        require(_treasury != address(0x0),
                "_treasury should be valid address.");

        require(_amount <= treasuryFund,
                "_amount should be <= treasuryFund");

        if (!resultDeclared()) {
            stakingHelper.unstake(_amount);    
        }
        
        participationToken.transfer(_treasury, _amount);
        treasuryFund = treasuryFund.sub(_amount);

        emit TreasuryWithdraw(msg.sender, _treasury, _amount);
    }
    /***************************************/

    
    /**** External Function's ****/

    /**
     * @notice places a bet on the given event 
     * @param _amount amount of token with which you want to bet 
     * @param _selectedOutcome index of the supposed winner team
     */
    function placeBet(uint256 _amount, uint8 _selectedOutcome) 
        external
        nonReentrant
    {
        require(block.timestamp >= startTime, 
                "Event not open for betting");

        require(block.timestamp <= startTime.add(bettingPeriod), 
                "Event is closed for betting");

        // At least a minimum amout is required to bet
        require(_amount >= minimumBet, 
                "Bet amount must be >= minimum bet");

        // Make sure this is sport event exists (ie. already registered in the Oracle)
        require( _selectedOutcome > 0 &&
                _selectedOutcome <= betOracle.getOutComeCount(eventId), 
                "_selectedOutcome is not a valid outome"); 

        // transfer the player's money into the contract's account 
        participationToken.transferFrom(msg.sender, address(stakingHelper), _amount);
        stakingHelper.stake();

        bytes16 betID = generateBetID(msg.sender);

        // add the new bet 
        Bet memory newBet = Bet(betID, msg.sender, _amount, _selectedOutcome, block.timestamp, 0, false, false);
        bets[msg.sender][betID] = newBet;

        totalBettedAmount += _amount;
        bettedAmount[_selectedOutcome] += _amount;
        userBetCount[msg.sender]++;
        betCount[_selectedOutcome]++;
        totalBets++;
        betIdMap[betID] = true;
        betList.push(betID);

        emit BetPlaced(
            betID,
            msg.sender,
            _selectedOutcome, 
            _amount
        );
    }

    /**
     * @notice rvoke placed bet
     * @param _betId betId which user want to revoke
     * Note: Bet can only be revoke before bettingPeriod gets over
     */
    function revokeBet(bytes16 _betId) 
        external
        nonReentrant
    {
        require(betIdMap[_betId], "Invalid Bet!!!");

        require(block.timestamp <= startTime.add(bettingPeriod), 
                "Revoking period is over, you can't revoke Bet");

        Bet storage betDetail = bets[msg.sender][_betId];

        require(!betDetail.betSettled, 
                "Bet is already settled!!");

        stakingHelper.unstake(betDetail.amount);
        participationToken.transfer(msg.sender, betDetail.amount);

        totalBettedAmount = totalBettedAmount.sub(betDetail.amount);
        bettedAmount[betDetail.selectedOutCome] = bettedAmount[betDetail.selectedOutCome].sub(betDetail.amount);
        betCount[betDetail.selectedOutCome]--;
        totalBets--;
        betIdMap[_betId] = false;

        updateBetList(_betId);

        betDetail.betSettlementTime = block.timestamp;
        betDetail.betSettled = true;
        betDetail.betRevoked = true;

        bets[msg.sender][_betId] = betDetail;

        emit BetRevoked(
            _betId,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice claim bet
     * @param _betId betId which user you have participated
     */
    function claim(bytes16 _betId)
        external
        nonReentrant
    {

        require(resultDeclared(), 
                "Betting Result is not yet declared!!");
        
        require(block.timestamp >= startTime.add(bettingPeriod).add(lockingPeriod), 
                "Claiming period is not yet started!!");
        
        require(block.timestamp <= startTime.add(bettingPeriod).add(lockingPeriod).add(claimingPeriod),
                "Claiming period is over, you cann't claim now!!");
        
        Bet storage betDetail = bets[msg.sender][_betId];

        require(!betDetail.betSettled, 
                "Bet is already settled!!");

        uint256 rewardAmount = claimableReward(msg.sender, _betId);
        uint256 withdrawFee = betDetail.amount.mul(WITHDRAW_FEE).div(10000);

        if (withdrawFee == 0 || isWinner(msg.sender, _betId)) {
            participationToken.transfer(msg.sender, betDetail.amount);
        } else {    
            participationToken.transfer(msg.sender, betDetail.amount.sub(withdrawFee));
            participationToken.transfer(devAddr, withdrawFee);
        }
        
        if (rewardAmount > 0) 
        {
            rewardToken.transfer(msg.sender, rewardAmount);
        }

        betDetail.betSettlementTime = block.timestamp;
        betDetail.betSettled = true;

        emit claimed(msg.sender, _betId, betDetail.amount, withdrawFee, rewardAmount, block.timestamp);
    }
    /***************************************/
}
