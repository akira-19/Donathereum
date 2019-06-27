App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
      // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/9eb56a6f6c2d49bf9fa83b8561b99067');
  }

  web3 = new Web3(App.web3Provider);
  return App.initContract();
  },

  initContract: function() {
      $.getJSON('Donathereum.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var DonathereumArtifact = data;
    App.contracts.Donathereum = TruffleContract(DonathereumArtifact);

    // Set the provider for our contract
    App.contracts.Donathereum.setProvider(App.web3Provider);
    App.getOwnedTokens();
    App.getContributer();
    App.getDonaterInformation();
    App.showOwnedTokens();
  });
  App.registerName();
  return App.donate();
  },

  donate: function(){
      $(document).on('click', '#donateButton', async function(event){
          event.preventDefault();
          let ether = $("#ether").val();
          ether = web3.toWei(ether, 'ether');
          const instance = await App.contracts.Donathereum.deployed();
          instance.donateEther({value: ether});

      });
  },

  getOwnedTokens: async function(){
      const instance = await App.contracts.Donathereum.deployed();
      const tokenArray = await instance.getTokenArray();
      return tokenArray;
  },

  showOwnedTokens: async function(){
      const tokenInfo = await App.getOwnedTokens();
      const tokenAmount = tokenInfo.length;
      const rowNumber = tokenAmount % 3;
      const ownedTokenList = $("#ownedTokenList");

      for (var i = 0; i < rowNumber; i++) {
          ownedTokenList.append(
              "<div class='row borders'>"
              +"<div class='col-md-4 borders'>"
              +"<img src='/' alt='token'>"
              +"</div>"
              +"<div class='col-md-4 borders'>"
              +"<img src='/' alt='token'>"
              +" </div>"
              +"<div class='col-md-4 borders'>"
              +"<img src='/' alt='token'>"
              +"</div>"
              +"</div>"
          );
      }

  },

  registerName: async function(){
      $(document).on('click', '#registerName', async function(event){
          event.preventDefault();
          const name = $("#newName").val();
          const instance = await App.contracts.Donathereum.deployed();
          await instance.registerName(name);
      });
  },

  getContributer: async function(){
      const instance = await App.contracts.Donathereum.deployed();
      const contributers = await instance.getContributer();
      $("#ranking li:nth-child(1) span").append(contributers[0]);
      $("#ranking li:nth-child(2) span").append(contributers[1]);
      $("#ranking li:nth-child(3) span").append(contributers[2]);
  },

  getDonaterInformation: async function(){
      const instance = await App.contracts.Donathereum.deployed();
      const name = await instance.getDonaterName();
      const balance = await instance.getBalance();
      const donateAmount = await instance.getDonaterInfo();
      $("#donaterStatus li:nth-child(1)").text("名前：" + name);
      $("#donaterStatus li:nth-child(2)").text("保持NFT数：" + balance);
      $("#donaterStatus li:nth-child(3)").text("総募金：" + web3.fromWei(donateAmount, 'ether'));

  }


}

$(function() {
  $(window).load(function() {
    App.init();
    $("#getLetter").hide();
  });
});
