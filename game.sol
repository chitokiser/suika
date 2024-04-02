// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 interface Ivet {      
  function balanceOf(address account) external view returns (uint256);
  function allowance(address owner, address spender) external view returns (uint256);
  function transfer(address recipient, uint256 happy) external returns (bool);
  function approve(address spender, uint256 happy) external returns (bool);
  function transferFrom(address sender, address recipient, uint256 happy) external returns (bool);
  function g1()external view returns(uint256);
  

  }

    interface Ivetbank{      //벳뱅크
    function depoup(address _user,uint _depo)external;
    function depodown(address _user,uint _depo)external;
    function getprice( ) external view returns (uint256);
    function getlevel(address user) external view returns(uint);
    function getmentolevel(address user) external view returns(uint);
    function  g9(address user) external view returns(uint);  //depo현황
  }
  
contract game {

 
      Ivetbank vetbank;
      Ivet vet;
      uint256 public tax;  // 세금
      uint256 public share;  // 잭에서 나눌 숫자
      int256 public winner;  // 승자수
      address public admin; 
      uint256 public tid; // 게임 개수
      uint256 public gamekey; // 게임 승리 가능횟수
      address public bank;  //계약이 가지고 있는 VET을 보내기 위해 필요
      uint256 public jack;  //쌓이는 잭팟
      mapping(address => mapping(uint => bool)) public gamepay;  //id별 게임비 지불여부
      mapping (address => uint)public staff;
      mapping (address => uint)public fa;
      mapping (uint => tresure)public ts;
      mapping(address => mapping(uint => uint)) public myts;  //게임승리 횟수 id별로 조회
  
      event reward(uint amount);
     

     constructor(address _vet,address _vetbank) public { 

      vet = Ivet(_vet);
      vetbank = Ivetbank(_vetbank);
      admin =msg.sender;
      staff[msg.sender] = 10;
      jack = 10*g6();  //기본값 
      gamekey = 5;  //기본값
      share = 4;  //게임 승리시 jack에서 나눌 금액
      bank = _vetbank;
      
   
      }
    
  

    struct tresure{   //게임아이디
    uint id;
    uint price;
    }

  


  function staffup(address _staff,uint8 num)public {  
        require( admin == msg.sender,"no admin"); 
        staff[_staff] = num;
        }   


    function ownerup(address _owner) public {  
    require(staff[msg.sender] >= 5,"no staff");
    admin = _owner;
    }


      function gamekeyup(uint _gamekey) public {  
    require(staff[msg.sender] >= 5,"no staff");
     gamekey = _gamekey;
    }
    
     
    function shareup(uint _share) public {  
    require(staff[msg.sender] >= 5,"no staff");
     share = _share;
     taxup();
    }

    function regibox(uint _price) public  {   //게임 등록
       require(staff[msg.sender] >= 5,"no staff");
        ts[tid].id = tid;
       ts[tid].price = _price;
       tid +=1;
    }

    function taxup() public  {   // vet 보내기
       if(g3() >=1000){
        tax += g3();
        vet.transfer(bank,g3());
       }

    }


    function openbox(uint _id) public  { 
    require(gamepay[msg.sender][_id] == true,"Didn't pay for the game");
   require(myts[msg.sender][_id] <= gamekey, "You're rewarded for this game");
        uint amount =  jack/share;
        vetbank.depoup(msg.sender,amount);
        emit reward(amount);
        jack  -= amount;
        gamepay[msg.sender][_id] = false;
        myts[msg.sender][_id] += 1;
        winner += 1;

    }
          
  function gamestart(uint _id) public  { 
     uint fee = ts[_id].price;
    require(ts[_id].price >=1,"does not exist");
    require(1 <= getlevel(msg.sender),"no member");
    require(g8(msg.sender) >= fee,"no VET"); 
    require(myts[msg.sender][_id] <= gamekey, "You're rewarded for this game");
        
        vet.approve(msg.sender, fee); 
        uint256 allowance = vet.allowance(msg.sender, address(this));
        require(allowance >= fee, "Check the token allowance");
        vet.transferFrom(msg.sender, address(this), fee);        
        jack += fee *g6();
        gamepay[msg.sender][_id] = true;
        
    }
          

function  g1(address user,uint _id) public view returns(bool) { //게임비 지불여부
  return gamepay[user][_id];
  }  


function  g2(uint _id) public view returns(uint) { //승자보상
  return jack/share;
  }  
 function  g3() public view returns(uint) { //vet 잔고 확인
  return vet.balanceOf(address(this));
  }  

 
 function  g6() public view returns(uint) { //vet 가격 가져오기
  return vetbank.getprice();
  }  


    function g8(address user) public view returns(uint) {  //유저 vet 잔고 확인
  return vet.balanceOf(user);
  }  

  
    function  g9(address user) public view returns(uint) {   // 유저 depo
   return vetbank.g9(user);
  }  

 function isTreasureFound(address user, uint _id) internal view returns (uint) {  //몇 번 승리 했는지 여부
    return myts[user][_id];
}

function  getlevel(address user) public view returns(uint) {  //유저 레벨확인
  return vetbank.getlevel(msg.sender);
  }  

    

  function deposit()external payable{
  }

}
 
