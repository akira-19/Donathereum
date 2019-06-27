pragma solidity >=0.4.21 <0.6.0;
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Donathereum is ERC721Full, Ownable{
    uint amount;
    uint32 programNum = 10 ** 6;
    uint32 token1 = 10 ** 8;
    uint32 token2 = 2 * (10 ** 8);
    uint32 token3 = 3 * (10 ** 8);
    mapping(uint32 => uint32) public incrementNum;
    mapping (address => string) donaterName;

    struct Donater{
        address donaterAddress;
        uint donateAmount;
        uint[] ownedToken;
    }
    Donater[] donaters;
    mapping(address => Donater) public donaterInfo;
    address payable institutionAddress;

    constructor(string memory _name, string memory _symbol) public ERC721Full(_name, _symbol){
        incrementNum[programNum] = 1;
        institutionAddress = 0x484c1344ac1D381d0FfE928C6FA1a3864D21Ed62;
    }

    function donateEther() public payable {
        amount = amount + msg.value;
        if (donaterInfo[msg.sender].donaterAddress == address(0x0)){
            uint[] memory newTokenArray;
            uint newLength = donaters.push(Donater(msg.sender, msg.value, newTokenArray));
            donaterInfo[msg.sender] = donaters[newLength - 1];
            getDonationToken();
            getNFT(msg.value, msg.sender);
            donateAmountToInstitution();
        }else{
            donaterInfo[msg.sender].donateAmount += msg.value;
            getNFT(msg.value, msg.sender);
            donateAmountToInstitution();
        }
    }

    function getDonationToken() public {
        incrementNum[programNum] += 1;
        uint32 donationTokenId;
        donationTokenId = programNum + incrementNum[programNum];
        _mint(msg.sender, donationTokenId);
        donaterInfo[msg.sender].ownedToken.push(donationTokenId);
    }

    function donateAmountToInstitution() payable public {
        institutionAddress.transfer(amount);
        amount = 0;
    }

    function setInstitutionAddress(address payable _address) public{
        institutionAddress = _address;
    }

    function getContributer() public view returns(string memory, string memory, string memory){
        address first;
        address second;
        address third;

        for (uint i = 0; i < donaters.length; i++){
            if (donaters[i].donateAmount > donaterInfo[first].donateAmount){
                address tempFirst = first;
                address tempSecond = second;
                first = donaters[i].donaterAddress;
                second = tempFirst;
                third = tempSecond;
            }else if(donaters[i].donateAmount == donaterInfo[first].donateAmount){
                address tempSecond = second;
                second = donaters[i].donaterAddress;
                third = tempSecond;
            }else if(donaters[i].donateAmount < donaterInfo[first].donateAmount && donaters[i].donateAmount > donaterInfo[second].donateAmount){
                address tempSecond = second;
                second = donaters[i].donaterAddress;
                third = tempSecond;
            }else if(donaters[i].donateAmount <= donaterInfo[second].donateAmount && donaters[i].donateAmount > donaterInfo[third].donateAmount ){
                third = donaters[i].donaterAddress;
            }
        }

        return(donaterName[first], donaterName[second], donaterName[third]);

    }

    function getNFT(uint _donationAmount, address _donater) internal {
        uint numberOfDrawal = _donationAmount / 0.1 ether;
        for (uint i = 0; i < numberOfDrawal; i++){
            uint randomNum = random(i);
            if (randomNum == 1){
                incrementNum[token1] += 1;
                uint donationTokenId = uint(token1 + incrementNum[token1]);
                _mint(_donater, donationTokenId);
                string memory uri = "https://example.com";
                _setTokenURI(donationTokenId, uri);
                donaterInfo[_donater].ownedToken.push(donationTokenId);
            }else if (randomNum == 2){
                incrementNum[token2] += 1;
                uint donationTokenId = uint(token2 + incrementNum[token2]);
                _mint(_donater, donationTokenId);
                string memory uri = "https://example.com";
                _setTokenURI(donationTokenId, uri);
                donaterInfo[_donater].ownedToken.push(donationTokenId);
            }else if (randomNum == 3){
                incrementNum[token3] += 1;
                uint donationTokenId = uint(token3 + incrementNum[token3]);
                _mint(_donater, donationTokenId);
                string memory uri = "https://example.com";
                _setTokenURI(donationTokenId, uri);
                donaterInfo[_donater].ownedToken.push(donationTokenId);
            }
        }
    }

    function random(uint _num) private view returns (uint) {
        return (uint(keccak256(abi.encode(block.timestamp, _num))) % 10);
    }

    function getTokenArray()public view returns (uint[] memory) {
        return donaterInfo[msg.sender].ownedToken;
    }

    function registerName(string memory _name) public{
        donaterName[msg.sender] = _name;
    }

    function getDonaterName() public view returns (string memory) {
        return donaterName[msg.sender];
    }

    function getDonaterInfo() public view returns (uint) {
        return donaterInfo[msg.sender].donateAmount;
    }

    function getBalance()public view returns (uint) {
        return balanceOf(msg.sender);
    }

}
