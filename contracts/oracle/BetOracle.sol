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

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
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


/**
 * @title An smart-contract Oracle that register sport events, retrieve their outcomes and communicate their results when asked for.
 * @notice Collects and provides information on sport events and their outcomes
 */
contract BetOracle is Ownable, ReentrancyGuard {

    /**
     * @dev all the sport events
     */
    SportEvent[] events;

    /*
     * @dev map of composed {eventId (SHA3 of event key infos) => eventIndex (in events)} pairs
     */
    mapping(bytes32 => uint) eventIdToIndex;

    /*
     * @dev admin who can has limited access to add/revoke sports event
     */
    address public admin;

    /*
     * @dev total number of events
     */
    uint256 public totalEventCount;

    /**
      * @dev defines a sport event along with its outcome
      */
    struct SportEvent {
        bytes32      id;
        string       name;
        string[]     participants;
        uint8        participantCount;
        uint32       catagory;
        uint256      minParticipationAmount;
        uint256      date;
        string[]     outcome;
        uint16[]     outcomeMultiplier;
        uint8[]      declaredOutcomeIndex;
        int8         winner;
    }

    /**
     * @dev Triggered once an event has been added
     */
    event SportEventAdded(
        bytes32 indexed _eventId,
        string          _name,
        string[]        _participants,
        uint32          _catagory,
        uint256         _minParticipationAmount,
        uint256         _date,
        string[]        _eventOutcome,
        uint16[]        _eventOutcomeMultiplier
    );

    /**
     * @dev Triggered once an event outcome has been declared
     */
    event SportEventOutcomeDeclared(
        bytes32 indexed _eventId,
        uint8[]         _eventOutcome,
        int8            _winner
    );

    /**
     * @dev Triggered once an event has been revoked
     */
    event SportEventRevoked(
        bytes32 indexed _eventId,
        uint256         _timestamp
    );

    /**
     * @dev Triggered once an event has been revoked
     */
    event AdminModified(
        address indexed _operator,
        address         _oldAdmin,
        address         _newAdmin
    );


    modifier onlyOperator() {
        require (_msgSender() == owner() || 
                 _msgSender() == admin, 
                 "Not an operator");
        _;
    }

    constructor() {
        admin = _msgSender();
    }

    /**
     * @notice Add a new pending sport event into the blockchain
     * @param _name descriptive name for the sport event (e.g. Pac vs. Mayweather 2016)
     * @param _catagory index of sports catagory
     * @param _participants array of participants names (e.g. ["Montpellier", "Monaco"])
     * @param _participantCount number of participants
     * @param _minParticipationAmount minimum amount of token with user can participant in bet
     * @param _outcomes array of possible outcome of an event (e.g. ["Montpellier", "Monaco", "DRAW", "1-2", "2-1"])
     * @param _outcomesMultiplier array of outcomes multiplier(e.g. [100, 150, 120, 100, 130])
     * @param _date date set for the sport event 
     * @return the unique id of the newly created sport event
     */
    function addSportEvent(
        string memory   _name,
        uint32          _catagory,
        string[] memory _participants,
        uint8           _participantCount,
        uint256         _minParticipationAmount,
        string[] memory _outcomes,
        uint16[] memory _outcomesMultiplier,
        uint            _date
        
    ) 
        public onlyOperator nonReentrant
        returns (bytes32)
    {
        bytes memory bytesName = bytes(_name);
        require(bytesName.length > 0, 
                    "_name cannot be empty");

        require(_participants.length == _participantCount, 
                    "_participants and _participantCount are not matching");
                    
        require(_outcomes.length > 0 && 
                _outcomes.length == _outcomesMultiplier.length, 
                    "_outcomes cannot be empty");

        // Hash key fields of the sport event to get a unique id
        bytes32 eventId = keccak256(abi.encodePacked(_name, _participantCount, _date, totalEventCount));

        // Make sure that the sport event is unique and does not exist yet
        require( !eventExists(eventId), 
                    "Event already exists");

        // Dummy declared outcome
        uint8[] memory dummy;

        // Add the sport event
        events.push( SportEvent(eventId, _name, _participants, _participantCount, _catagory, _minParticipationAmount, _date, _outcomes, _outcomesMultiplier, dummy, -1));
        uint newIndex           = events.length - 1;
        eventIdToIndex[eventId] = newIndex + 1;
        totalEventCount++;

        emit SportEventAdded(
            eventId,
            _name,
            _participants,
            _catagory,
            _minParticipationAmount,
            _date,
            _outcomes,
            _outcomesMultiplier
        );

        // Return the unique id of the new sport event
        return eventId;
    }
    
    /**
     * @notice Sets the outcome of a predefined match, permanently on the blockchain
     * @param _eventId unique id of the match to modify
     * @param _outcome array of outcome of the match
     * @param _winner 0-based id of the winnner
     */
    function declareOutcome(
        bytes32 _eventId, 
        uint8[] memory _outcome, 
        int8 _winner
    )
        external onlyOperator
    {
        // Require that it exists 
        require(eventExists(_eventId), "Invalid _eventId");
        require(_outcome.length > 0, "_outcome cannot be non-zero/negative");

        // Get the event
        uint index = _getMatchIndex(_eventId);
        SportEvent storage theMatch = events[index];

        require(_winner >= 0 && theMatch.participantCount >= uint8(_winner));
        theMatch.winner = _winner;

        for (uint8 i = 0; i < _outcome.length; i++){
            require(_outcome[i] > 0, "Declared outcome should be greater then zero");
            require(_outcome[i] <= theMatch.outcome.length, "Declared outcome index out of Scope");
        }

        theMatch.declaredOutcomeIndex = _outcome;

        emit SportEventOutcomeDeclared(
            _eventId,
            _outcome,
            _winner
        );
    }

    /**
     * @notice revoke event already published event
     * @param _eventId unique id of the match to modify
     */
    function revokeEvent(
        bytes32 _eventId
    )
        external onlyOperator
    {
        require(eventExists(_eventId), "Invalid _eventId");

        uint256 eventIndex = _getMatchIndex(_eventId);
        SportEvent storage theMatch = events[eventIndex];

        require(theMatch.date > block.timestamp, "Event is already started, You can't revoke now");
        eventIdToIndex[events[events.length - 1].id] = eventIdToIndex[events[eventIndex].id];
        eventIdToIndex[events[eventIndex].id] = 0;
        events[eventIndex] = events[events.length - 1];
        events.pop();
        totalEventCount--;

        emit SportEventRevoked(
            _eventId,
            block.timestamp
        );
    }

    /**
     * @notice set Admin wallet address
     * @param _admin admin wallet address
     */
    function setAdmin (
        address _admin
    )
        external onlyOwner
    {
        require(_admin != address(0x0), "_admin should be valid address");

        emit AdminModified(_msgSender(), admin, _admin);
        admin = _admin;
    }

    /**
     * @notice Returns the array index of the sport event with the given id
     * @dev if the event id is invalid, then the return value will be incorrect and may cause error; you must call eventExists(_eventId) first!
     * @param _eventId the sport event id to get
     * @return the array index of this event if it exists or else -1
     */
    function _getMatchIndex(
        bytes32 _eventId
    )
        private view
        returns (uint)
    {
        return eventIdToIndex[_eventId] - 1;
    }

    /**
     * @notice Returns the outcome count of the sport event with the given id
     * @dev if the event id is invalid, then the return value will be incorrect and may cause error; you must call eventExists(_eventId) first!
     * @param _eventId the sport event id to get
     */
    function getOutComeCount(
        bytes32 _eventId
    )
        public view 
        returns (uint256 count)
    {
        if (eventExists(_eventId)) {
            SportEvent storage theMatch = events[_getMatchIndex(_eventId)];
            count = theMatch.outcome.length;
        } 
    }

    /**
     * @notice Determines whether a sport event exists with the given id
     * @param _eventId the id of a sport event id
     * @return true if sport event exists and its id is valid
     */
    function eventExists(
        bytes32 _eventId
    )
        public view
        returns (bool)
    {
        if (events.length == 0) {
            return false;
        }
        uint index = eventIdToIndex[_eventId];
        return (index > 0);
    }


    /**
     * @notice gets the unique ids of events, pending and decided, in reverse chronological order
     * @return an array of unique match ids
     */
    function getAllSportEvents()
        public view
        returns (bytes32[] memory)
    {
        bytes32[] memory eventIds = new bytes32[](events.length);

        // Collect all event ids
        if (events.length > 0) {
            uint index = 0;
            for (uint n = events.length; n > 0; n = n - 1) {
                eventIds[index] = events[n - 1].id;
                index = index + 1;
            }
        }

        return eventIds;
    }

    /**
     * @notice gets the unique ids of all events sort by catagory
     * @param _catagory event catagory
     * @return an array of unique events ids
     */
    function getEventsByCatagory(uint16 _catagory)
        public view
        returns (bytes32[] memory)
    {
        uint count = 0;

        // Get the count of pending events
        for (uint i = 0; i < events.length; i = i + 1) {
            if (events[i].catagory == _catagory)
                count = count + 1;
        }

        // Collect up all the pending events
        bytes32[] memory output = new bytes32[](count);

        if (count > 0) {
            uint index = 0;
            for (uint n = events.length;  n > 0;  n = n - 1) {
                if (events[n - 1].catagory == _catagory) {
                    output[index] = events[n - 1].id;
                    index = index + 1;
                }
            }
        }

        return output;
    }

    /**
     * @notice gets the unique ids of all pending events, in reverse chronological order
     * @return an array of unique pending events ids
     */
    function getPendingEvents()
        public view
        returns (bytes32[] memory)
    {
        uint count = 0;

        // Get the count of pending events
        for (uint i = 0; i < events.length; i = i + 1) {
            if (events[i].declaredOutcomeIndex.length == 0)
                count = count + 1;
        }

        // Collect up all the pending events
        bytes32[] memory output = new bytes32[](count);

        if (count > 0) {
            uint index = 0;
            for (uint n = events.length;  n > 0;  n = n - 1) {
                if (events[n - 1].declaredOutcomeIndex.length == 0) {
                    output[index] = events[n - 1].id;
                    index = index + 1;
                }
            }
        }

        return output;
    }

    /**
     * @notice return the data of the Finished sport event
     * @return an array of unique match ids
     */    
    function getFinishedEvent()
        public view
        returns (bytes32[] memory)
    {

        uint count = 0;

        // Get the count of finished events
        for (uint i = 0; i < events.length; i = i + 1) {
            if (events[i].declaredOutcomeIndex.length != 0)
                count = count + 1;
        }

        // Collect up all the Finished events
        bytes32[] memory output = new bytes32[](count);

        if (count > 0) {
            uint index = 0;
            for (uint n = events.length;  n > 0;  n = n - 1) {
                if (events[n - 1].declaredOutcomeIndex.length != 0) {
                    output[index] = events[n - 1].id;
                    index = index + 1;
                }
            }
        }

        return output;
    }


    /**
     * @notice return the data of the Active sport event
     * @return an array of unique match ids
     */    
    function getActiveEvent()
        public view
        returns (bytes32[] memory)
    {
        uint count = 0;

        // Get the count of active events
        for (uint i = 0; i < events.length; i = i + 1) {
            if (events[i].date >= block.timestamp &&
                    events[i].declaredOutcomeIndex.length == 0) 
            {
                count = count + 1;
            }           
        }

        // Collect up all the active events
        bytes32[] memory output = new bytes32[](count);

        if (count > 0) {
            uint index = 0;
            for (uint n = events.length;  n > 0;  n = n - 1) {
                if (events[n - 1].date >= block.timestamp &&
                        events[n - 1].declaredOutcomeIndex.length == 0)
                {
                    output[index] = events[n - 1].id;
                    index = index + 1;
                }
            }
        }

        return output;
    }

    /**
     * @notice gets the specified sport event and return its data
     * @param _eventId the unique id of the desired event
     * @return id   the id of the event
     * @return name the name of the event
     * @return participants array of participants with the name of the event's
     * @return participantCount the number of the event's participants
     * @return catagory index of sports catagory
     * @return minParticipantionAmount min amount of token with which user can participant in bet
     * @return date when the event takes place
     * @return outcome array of possible outcome an String Array that represents the event 
     * @return outcomeMultiplier array of outcomes multiplier 
     * @return declaredOutcomeIndex array of declaredOutcomeIndex an integer that represents the event 
     * @return winner the index of the winner
     */
    function getEvent(
        bytes32 _eventId
    )
        public view
        returns (
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
        )
    {
        // Get the sport event
        if (eventExists(_eventId)) {
            SportEvent storage theMatch = events[_getMatchIndex(_eventId)];

            return (theMatch.id, theMatch.name, theMatch.participants, theMatch.participantCount, 
                        theMatch.catagory, theMatch.minParticipationAmount, theMatch.date, 
                        theMatch.outcome, theMatch.outcomeMultiplier, theMatch.declaredOutcomeIndex, theMatch.winner);
            
        }
        else {
            string[] memory dummy;
            uint16[] memory dummy1;
            uint8[] memory dummy2;
            return (_eventId, "", dummy, 0, 0, 0, 0, dummy, dummy1, dummy2, -1);
        }   
    }


    function getMinParticipantAmount(
        bytes32 _eventId
    )
        external view returns (uint256)
    {
        // Get the sport event
        if (eventExists(_eventId)) {
            SportEvent memory theMatch = events[_getMatchIndex(_eventId)];

            return theMatch.minParticipationAmount;
            
        }
        else {
            revert();
        }   
    }

    function getBetStartTime(
        bytes32 _eventId
    )
        external view returns (uint256)
    {
        // Get the sport event
        if (eventExists(_eventId)) {
            SportEvent memory theMatch = events[_getMatchIndex(_eventId)];

            return theMatch.date;
            
        }
        else {
            revert();
        }   
    }

    /**
     * @notice gets the address of this contract
     * @return the address of the BetOracle smart-contract
     */
    function getAddress()
        public view
        returns (address)
    {
        return address(this);
    }

    /**
     * @notice can be used by a client contract to ensure that they've connected to this contract interface successfully
     * @return true, unconditionally
     */
    function testConnection()
        public pure
        returns (bool)
    {
        return true;
    }
}
