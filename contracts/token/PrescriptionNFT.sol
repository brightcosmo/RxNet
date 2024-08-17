pragma solidity ^0.5.9;
pragma experimental ABIEncoderV2;

import "./ERC721.sol";
import "./SafeMath.sol";

contract PrescriptionNFT is ERC721 {
    using SafeMath for uint256;

    address public owner;

    struct PrescriptionMetadata {
        address doctor;
        address prescribedPatient;
        string pzn;
        string medicationName;
        uint8 dosage;
        string dosageUnit;
        uint8 numPills;
        uint256 dateFilled;
        uint256 expirationTime;
    }

    struct Prescription {
        PrescriptionMetadata metadata;
        address owner;
        bool filled;
    }

    struct Doctor {
        string name;
        bool isValid;
    }

    uint256 private totalTokens;

    mapping (uint256 => Prescription) public prescriptions;
    mapping (address => Doctor) public approvedDoctors;
    mapping (address => uint256[]) private issuedTokens;
    mapping (address => uint256[]) private ownedTokens;
    mapping(uint256 => uint256) private ownedTokensIndex;
    mapping(uint256 => uint256) private issuedTokensIndex;

    event PrescriptionMinted(uint256 tokenId, address doctor, address patient);
    event PrescriptionCancelled(uint256 tokenId, address doctor);
    event PrescriptionFilled(uint256 tokenId, address pharmacy);

    constructor() public {
        owner = msg.sender;
    }

    function approveDoctor(address _doctorToApprove, string memory _name) public onlyOwner {
        approvedDoctors[_doctorToApprove] = Doctor(_name, true);
    }

    function removeDoctor(address _doctorToRemove) public onlyOwner {
        approvedDoctors[_doctorToRemove].isValid = false;
    }

    function prescribe(
        address _patientAddress,
        string memory _pzn,
        string memory _medicationName,
        uint8 _dosage,
        string memory _dosageUnit,
        uint8 _numPills,
        uint256 _expirationTime
    ) public doctorIsApproved(msg.sender) {
        require(_dosage > 0, "Dosage must be greater than 0");
        require(_numPills > 0, "Number of pills must be greater than 0");
        require(_expirationTime > now, "Expiration time must be in the future");

        uint256 newTokenId = totalTokens;

        prescriptions[newTokenId] = Prescription({
            metadata: PrescriptionMetadata({
                doctor: msg.sender,
                prescribedPatient: _patientAddress,
                pzn: _pzn,
                medicationName: _medicationName,
                dosage: _dosage,
                dosageUnit: _dosageUnit,
                numPills: _numPills,
                dateFilled: now,
                expirationTime: _expirationTime
            }),
            owner: _patientAddress,
            filled: false
        });

        issuedTokensIndex[newTokenId] = issuedTokens[msg.sender].length;
        issuedTokens[msg.sender].push(newTokenId);

        _mint(_patientAddress, newTokenId);

        emit PrescriptionMinted(newTokenId, msg.sender, _patientAddress);
    }

    function cancelPrescription(uint256 _tokenId) public doctorIsApproved(msg.sender) {
        require(_tokenId < totalTokens, "Invalid token ID");
        Prescription storage p = prescriptions[_tokenId];
        require(p.metadata.doctor == msg.sender, "Only the prescribing doctor can cancel");
        require(!p.filled, "Cannot cancel filled prescription");

        removeToken(p.metadata.prescribedPatient, _tokenId);
        destroyToken(p.metadata.doctor, _tokenId);

        emit PrescriptionCancelled(_tokenId, msg.sender);
    }

    function fillPrescription(address _pharmacyAddress, uint256 _tokenId) public {
        require(now <= prescriptions[_tokenId].metadata.expirationTime, "Prescription has expired");
        transfer(_pharmacyAddress, _tokenId);
        prescriptions[_tokenId].filled = true;
        emit PrescriptionFilled(_tokenId, _pharmacyAddress);
    }

    function totalSupply() public view returns (uint256) {
        return totalTokens;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return ownedTokens[_owner].length;
    }

    function tokensIssued(address _doctor) public view returns (uint256[] memory) {
        return issuedTokens[_doctor];
    }

    function tokensOf(address _owner) public view returns (uint256[] memory) {
        return ownedTokens[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        address tokenOwner = prescriptions[_tokenId].owner;
        require(tokenOwner != address(0), "Invalid token ID");
        return tokenOwner;
    }

    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) onlyPrescribedUser(_tokenId) {
        removeTokenAndTransfer(msg.sender, _to, _tokenId);
    }

    function _mint(address _to, uint256 _tokenId) internal {
        require(_to != address(0), "Cannot mint to zero address");
        addToken(_to, _tokenId);
        emit Transfer(address(0), _to, _tokenId);
    }

    function removeTokenAndTransfer(address _from, address _to, uint256 _tokenId) internal {
        require(_to != address(0), "Cannot transfer to zero address");
        require(_to != ownerOf(_tokenId), "Cannot transfer to current owner");
        require(ownerOf(_tokenId) == _from, "Sender is not the owner");

        removeToken(_from, _tokenId);
        addToken(_to, _tokenId);
        emit Transfer(_from, _to, _tokenId);
    }

    function addToken(address _to, uint256 _tokenId) private {
        require(prescriptions[_tokenId].owner == address(0), "Token already owned");
        prescriptions[_tokenId].owner = _to;
        uint256 length = balanceOf(_to);

        ownedTokens[_to].push(_tokenId);
        ownedTokensIndex[_tokenId] = length;
        totalTokens = totalTokens.add(1);
    }

    function removeToken(address _from, uint256 _tokenId) private {
        require(ownerOf(_tokenId) == _from, "Not the owner");

        uint256 tokenIndex = ownedTokensIndex[_tokenId];
        uint256 lastTokenIndex = balanceOf(_from).sub(1);
        uint256 lastToken = ownedTokens[_from][lastTokenIndex];

        ownedTokens[_from][tokenIndex] = lastToken;
        ownedTokens[_from][lastTokenIndex] = 0;
        ownedTokens[_from].length--;
        ownedTokensIndex[_tokenId] = 0;
        ownedTokensIndex[lastToken] = tokenIndex;

        prescriptions[_tokenId].owner = address(0);
    }

    function destroyToken(address _doctor, uint256 _tokenId) private {
        uint256 tokenIndex = issuedTokensIndex[_tokenId];
        uint256 lastTokenIndex = issuedTokens[_doctor].length.sub(1);
        uint256 lastToken = issuedTokens[_doctor][lastTokenIndex];

        issuedTokens[_doctor][tokenIndex] = lastToken;
        issuedTokens[_doctor][lastTokenIndex] = 0;
        issuedTokens[_doctor].length--;
        issuedTokensIndex[_tokenId] = 0;
        issuedTokensIndex[lastToken] = tokenIndex;

        delete prescriptions[_tokenId];
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier doctorIsApproved(address _doctor) {
        require(approvedDoctors[_doctor].isValid, "Doctor is not approved");
        _;
    }

    modifier onlyPrescribedUser(uint256 _tokenId) {
        require(prescriptions[_tokenId].metadata.prescribedPatient == msg.sender, "Not the prescribed user");
        _;
    }

    modifier onlyOwnerOf(uint256 _tokenId) {
        require(ownerOf(_tokenId) == msg.sender, "Not the owner of the token");
        _;
    }

    function approve(address _to, uint256 _tokenId) public {
        // No-op
    }

    function takeOwnership(uint256 _tokenId) public {
        // No-op
    }
}