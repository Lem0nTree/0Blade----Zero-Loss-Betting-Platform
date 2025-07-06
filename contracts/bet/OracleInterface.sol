// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title The interface for the events Oracle (`BetOracle`)
 * @notice Declares the functions that the `BetOracle` contract exposes externally
 */
interface OracleInterface {
    function eventExists(bytes32 _eventId)
        external view returns (bool);
    
    function getPendingEvents() 
        external view returns (bytes32[] memory);

    function getAllSportEvents() 
        external view returns (bytes32[] memory);

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

    function getLatestEvent(bool _pending) 
        external view returns (
            bytes32         id,
            string memory   name,
            string[] memory participants,
            uint8           participantCount,
            uint32          catagory,
            uint256         minParticipationAmount,
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

    function getOutComeCount(bytes32 _eventId) 	
        external view returns (uint256);
        
    function testConnection() 
        external pure returns (bool);
}