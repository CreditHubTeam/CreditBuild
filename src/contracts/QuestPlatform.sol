// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

interface ICreditBuildPoints {
    function mint(address to, uint256 amount) external;
}

/**
 * @title QuestPlatform
 * @notice Manages quest completions and rewards distribution for CreditBuild
 * @dev Supports both operator-driven minting and user attestation claims
 */
contract QuestPlatform is AccessControl, Pausable, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Roles
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // State variables
    ICreditBuildPoints public pointsToken;
    
    // Quest completion tracking
    mapping(address => mapping(uint256 => bool)) public questCompleted;
    
    // Attestation nonce tracking (prevents replay attacks)
    mapping(address => uint256) public userNonces;
    
    // Quest definitions
    struct Quest {
        uint256 id;
        string name;
        uint256 pointsReward;
        uint256 creditImpact;
        bool isActive;
        uint256 maxCompletions; // 0 = unlimited
        uint256 currentCompletions;
    }
    
    mapping(uint256 => Quest) public quests;
    uint256 public questCount;
    
    // Events
    event QuestCompleted(
        address indexed user, 
        uint256 indexed questId, 
        uint256 pointsAwarded,
        uint256 creditImpact,
        address indexed operator
    );
    
    event QuestCompletedWithAttestation(
        address indexed user,
        uint256 indexed questId,
        uint256 pointsAwarded,
        uint256 nonce
    );
    
    event QuestCreated(
        uint256 indexed questId,
        string name,
        uint256 pointsReward,
        uint256 creditImpact
    );
    
    event QuestUpdated(uint256 indexed questId, bool isActive);
    event PointsTokenUpdated(address indexed oldToken, address indexed newToken);

    // Errors
    error QuestAlreadyCompleted();
    error QuestNotActive();
    error QuestDoesNotExist();
    error InvalidSignature();
    error AttestationExpired();
    error InvalidNonce();
    error MaxCompletionsReached();
    error ZeroAddress();
    error InvalidPoints();

    constructor(
        address _pointsToken,
        address _admin,
        address _operator
    ) {
        if (_pointsToken == address(0) || _admin == address(0) || _operator == address(0)) {
            revert ZeroAddress();
        }

        pointsToken = ICreditBuildPoints(_pointsToken);
        
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _operator);
        _grantRole(PAUSER_ROLE, _admin);
    }

    /**
     * @notice Create a new quest
     * @param name Quest name
     * @param pointsReward Points awarded upon completion
     * @param creditImpact Credit score impact
     * @param maxCompletions Maximum completions allowed (0 = unlimited)
     */
    function createQuest(
        string calldata name,
        uint256 pointsReward,
        uint256 creditImpact,
        uint256 maxCompletions
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256) {
        if (pointsReward == 0) revert InvalidPoints();

        uint256 questId = questCount++;
        
        quests[questId] = Quest({
            id: questId,
            name: name,
            pointsReward: pointsReward,
            creditImpact: creditImpact,
            isActive: true,
            maxCompletions: maxCompletions,
            currentCompletions: 0
        });
        
        emit QuestCreated(questId, name, pointsReward, creditImpact);
        return questId;
    }

    /**
     * @notice Toggle quest active status
     * @param questId Quest ID to update
     * @param isActive New active status
     */
    function setQuestActive(uint256 questId, bool isActive) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        if (questId >= questCount) revert QuestDoesNotExist();
        quests[questId].isActive = isActive;
        emit QuestUpdated(questId, isActive);
    }

    /**
     * @notice Operator completes quest for user (trusted backend flow)
     * @param user User address
     * @param questId Quest ID
     */
    function completeQuestForUser(address user, uint256 questId)
        external
        onlyRole(OPERATOR_ROLE)
        whenNotPaused
        nonReentrant
    {
        if (user == address(0)) revert ZeroAddress();
        if (questId >= questCount) revert QuestDoesNotExist();
        
        Quest storage quest = quests[questId];
        
        if (!quest.isActive) revert QuestNotActive();
        if (questCompleted[user][questId]) revert QuestAlreadyCompleted();
        
        // Check max completions
        if (quest.maxCompletions > 0 && quest.currentCompletions >= quest.maxCompletions) {
            revert MaxCompletionsReached();
        }
        
        // Mark as completed
        questCompleted[user][questId] = true;
        quest.currentCompletions++;
        
        // Mint points
        pointsToken.mint(user, quest.pointsReward);
        
        emit QuestCompleted(user, questId, quest.pointsReward, quest.creditImpact, msg.sender);
    }

    /**
     * @notice Batch complete quests for multiple users
     * @param users Array of user addresses
     * @param questIds Array of quest IDs
     */
    function batchCompleteQuests(address[] calldata users, uint256[] calldata questIds)
        external
        onlyRole(OPERATOR_ROLE)
        whenNotPaused
        nonReentrant
    {
        if (users.length != questIds.length) revert("Arrays length mismatch");
        if (users.length > 100) revert("Too many operations");
        
        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            uint256 questId = questIds[i];
            
            if (user == address(0)) continue;
            if (questId >= questCount) continue;
            
            Quest storage quest = quests[questId];
            
            if (!quest.isActive) continue;
            if (questCompleted[user][questId]) continue;
            if (quest.maxCompletions > 0 && quest.currentCompletions >= quest.maxCompletions) continue;
            
            questCompleted[user][questId] = true;
            quest.currentCompletions++;
            
            pointsToken.mint(user, quest.pointsReward);
            
            emit QuestCompleted(user, questId, quest.pointsReward, quest.creditImpact, msg.sender);
        }
    }

    /**
     * @notice User claims quest with operator attestation (user pays gas)
     * @param questId Quest ID
     * @param nonce User's current nonce
     * @param deadline Signature expiration timestamp
     * @param signature Operator's signature
     */
    function claimWithAttestation(
        uint256 questId,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external whenNotPaused nonReentrant {
        if (block.timestamp > deadline) revert AttestationExpired();
        if (questId >= questCount) revert QuestDoesNotExist();
        if (nonce != userNonces[msg.sender]) revert InvalidNonce();
        
        Quest storage quest = quests[questId];
        
        if (!quest.isActive) revert QuestNotActive();
        if (questCompleted[msg.sender][questId]) revert QuestAlreadyCompleted();
        
        // Check max completions
        if (quest.maxCompletions > 0 && quest.currentCompletions >= quest.maxCompletions) {
            revert MaxCompletionsReached();
        }
        
        // Verify signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(msg.sender, questId, nonce, deadline, address(this))
        );
        bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedHash.recover(signature);
        
        if (!hasRole(OPERATOR_ROLE, signer)) revert InvalidSignature();
        
        // Mark as completed and increment nonce
        questCompleted[msg.sender][questId] = true;
        userNonces[msg.sender]++;
        quest.currentCompletions++;
        
        // Mint points
        pointsToken.mint(msg.sender, quest.pointsReward);
        
        emit QuestCompletedWithAttestation(msg.sender, questId, quest.pointsReward, nonce);
    }

    /**
     * @notice Get quest details
     * @param questId Quest ID
     */
    function getQuest(uint256 questId) 
        external 
        view 
        returns (
            string memory name,
            uint256 pointsReward,
            uint256 creditImpact,
            bool isActive,
            uint256 maxCompletions,
            uint256 currentCompletions
        ) 
    {
        if (questId >= questCount) revert QuestDoesNotExist();
        Quest memory quest = quests[questId];
        return (
            quest.name,
            quest.pointsReward,
            quest.creditImpact,
            quest.isActive,
            quest.maxCompletions,
            quest.currentCompletions
        );
    }

    /**
     * @notice Check if user completed a quest
     * @param user User address
     * @param questId Quest ID
     */
    function hasCompletedQuest(address user, uint256 questId) 
        external 
        view 
        returns (bool) 
    {
        return questCompleted[user][questId];
    }

    /**
     * @notice Get user's current nonce
     * @param user User address
     */
    function getUserNonce(address user) external view returns (uint256) {
        return userNonces[user];
    }

    /**
     * @notice Update points token address
     * @param newToken New token address
     */
    function setPointsToken(address newToken) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        if (newToken == address(0)) revert ZeroAddress();
        address oldToken = address(pointsToken);
        pointsToken = ICreditBuildPoints(newToken);
        emit PointsTokenUpdated(oldToken, newToken);
    }

    /**
     * @notice Pause the contract
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @notice Generate message hash for off-chain signing
     * @param user User address
     * @param questId Quest ID
     * @param nonce User's nonce
     * @param deadline Expiration timestamp
     */
    function getMessageHash(
        address user,
        uint256 questId,
        uint256 nonce,
        uint256 deadline
    ) public view returns (bytes32) {
        return keccak256(
            abi.encodePacked(user, questId, nonce, deadline, address(this))
        );
    }
}