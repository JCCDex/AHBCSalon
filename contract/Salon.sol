pragma solidity ^0.4.25;

import "./IUpgradeable.sol";
import "./Administrative.sol";
import "./SalonToken.sol";

contract Salon is Administrative {
    struct Campaign {
        uint ID;
        bool end;
        string topic;
        address speaker;
        address sponsor;
        address[] participants;
        address[] questioner;
        mapping(address => address) QRMap;
    }

    mapping(uint => Campaign) campaigns;

    SalonToken public salonToken;
    uint unit;

    constructor(address salonTokenAddr) public {
        salonToken = SalonToken(salonTokenAddr);
        uint decimals = salonToken.decimals();
        unit = 10 ** decimals;
    }

    modifier validCampaign(uint _campaignID) {
        Campaign storage c = campaigns[_campaignID];
        require(!c.end);
        _;
    }

    event LogNewCampaign(uint indexed campaignID, uint startTime, uint stopTime, string topic, address indexed speaker, address indexed sponsor);
    event LogCheckedIn(address indexed who);
    event LogQuestion(address indexed questioner, address indexed replier);
    event LogClose(uint indexed campaignID, uint numOfParticipants, uint questions);

    function newCampaign(uint _campaignID, uint _startTime, uint _stopTime, string _topic, address _speaker, address _sponsor)
    external onlyPrivileged {
        campaigns[_campaignID] = Campaign({
            ID : _campaignID, end : false, topic : _topic,
            speaker : _speaker, sponsor : _sponsor, participants : new address[](0), questioner : new address[](0)
            });
        salonToken.mint(address(this), 100 * unit);
        emit LogNewCampaign(_campaignID, _startTime, _stopTime, _topic, _speaker, _sponsor);
    }

    function checkInByAdmin(uint _campaignID, address _who) external onlyPrivileged validCampaign(_campaignID){
        Campaign storage c = campaigns[_campaignID];
        c.participants.push(_who);
        emit LogCheckedIn(_who);
    }

    function addQuestion(uint _campaignID, address _questioner, address _replier) external onlyPrivileged validCampaign(_campaignID) {
        Campaign storage c = campaigns[_campaignID];
        c.questioner.push(_questioner);
        c.QRMap[_questioner] = _replier;
        emit LogQuestion(_questioner, _replier);
    }

    function closeCampaign(uint _campaignID) external onlyPrivileged validCampaign(_campaignID) {
        Campaign storage c = campaigns[_campaignID];
        salonToken.transfer(c.speaker, 30 * unit);
        salonToken.transfer(c.sponsor, 10 * unit);

        uint i;
        if(c.participants.length > 0) {
            uint tokenForAttendance = 40 * unit / c.participants.length;
            for(i=0;i<c.participants.length;i++) {
                salonToken.transfer(c.participants[i], tokenForAttendance);
            }
        }

        if(c.questioner.length > 0) {
            uint tokenForQuestion = 20 * unit / c.questioner.length / 2;
            for(i=0;i<c.questioner.length;i++) {
                salonToken.transfer(c.questioner[i], tokenForQuestion);
                salonToken.transfer(c.QRMap[c.questioner[i]], tokenForQuestion);
            }
        }

        c.end = true;
        emit LogClose(_campaignID, c.participants.length, c.questioner.length);
    }

    function checkIn(uint _campaignID) external validCampaign(_campaignID) {
        Campaign storage c = campaigns[_campaignID];
        c.participants.push(msg.sender);
        emit LogCheckedIn(msg.sender);
    }
}
