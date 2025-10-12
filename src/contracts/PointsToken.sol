// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title CreditBuildPoints
 * @notice Points token for CreditBuild platform with enhanced security features
 * @dev Implements ERC20 with minting, burning, permit, and emergency pause
 */
contract CreditBuildPoints is ERC20, ERC20Burnable, ERC20Permit, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Events for better tracking
    event PointsMinted(address indexed to, uint256 amount, address indexed minter);
    event PointsBurned(address indexed from, uint256 amount);
    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);

    // Optional: Cap on total supply to prevent inflation
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens

    constructor(address defaultAdmin, address minter)
        ERC20("CreditBuildPoints", "CBP")
        ERC20Permit("CreditBuildPoints")
    {
        require(defaultAdmin != address(0), "Invalid admin address");
        require(minter != address(0), "Invalid minter address");
        
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(PAUSER_ROLE, defaultAdmin);
    }

    /**
     * @notice Mint new points tokens
     * @param to Recipient address
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        _mint(to, amount);
        emit PointsMinted(to, amount, msg.sender);
    }

    /**
     * @notice Batch mint to multiple addresses (gas efficient for airdrops)
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to mint
     */
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) 
        external 
        onlyRole(MINTER_ROLE) 
        whenNotPaused 
    {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length <= 200, "Too many recipients"); // Gas limit protection
        
        uint256 totalAmount;
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Invalid amount");
            totalAmount += amounts[i];
            _mint(recipients[i], amounts[i]);
            emit PointsMinted(recipients[i], amounts[i], msg.sender);
        }
        
        require(totalSupply() <= MAX_SUPPLY, "Exceeds max supply");
    }

    /**
     * @notice Burn tokens with event emission
     * @param amount Amount to burn
     */
    function burn(uint256 amount) public override whenNotPaused {
        super.burn(amount);
        emit PointsBurned(msg.sender, amount);
    }

    /**
     * @notice Burn tokens from another account (requires allowance)
     * @param account Account to burn from
     * @param amount Amount to burn
     */
    function burnFrom(address account, uint256 amount) public override whenNotPaused {
        super.burnFrom(account, amount);
        emit PointsBurned(account, amount);
    }

    /**
     * @notice Pause all token transfers (emergency only)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause token transfers
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @notice Add a new minter
     * @param account Address to grant minter role
     */
    function addMinter(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(account != address(0), "Invalid address");
        grantRole(MINTER_ROLE, account);
        emit MinterAdded(account);
    }

    /**
     * @notice Remove a minter
     * @param account Address to revoke minter role
     */
    function removeMinter(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, account);
        emit MinterRemoved(account);
    }

    /**
     * @notice Check if address has minter role
     * @param account Address to check
     */
    function isMinter(address account) external view returns (bool) {
        return hasRole(MINTER_ROLE, account);
    }

    /**
     * @dev Override required by Solidity for multiple inheritance
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20)
        whenNotPaused
    {
        super._update(from, to, value);
    }
}