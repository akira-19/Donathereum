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
    App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/fd4cad0c51f94ec8a2def0a9c7e638fa');
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
      const instance = await App.contracts.Donathereum.deployed();
      for (var i = 0; i < tokenInfo.length; i++) {
          const tokenURI = await instance.tokenURI(tokenInfo[i]);
          const tokenId = tokenInfo[i];
          let tokenName;
          let tokenDescription;
          if(tokenId >= 10 ** 6 && tokenId <= 10 ** 6 + 10000){
              tokenName = "コアラ";
              tokenDescription = "1度でも募金をするともらえる";
          }else if(tokenId >= 10 ** 8 && tokenId <= 10 ** 8 + 10000){
              tokenName = "ヒヨコと子アヒル";
              tokenDescription = "10%の確率でもらえる";
          }else if(tokenId >= 2 * (10 ** 8) && tokenId <= 2 * (10 ** 8) + 10000){
              tokenName = "アヒル";
              tokenDescription = "10%の確率でもらえる";
          }else if(tokenId >= 3 * (10 ** 8) && tokenId <= 3 * (10 ** 8) + 10000){
              tokenName = "さかな";
              tokenDescription = "10%の確率でもらえる";
          }
          $("#ownedTokenList").append(
              "<div class='tokenDiv'><div class='imgDiv'><img src='" + tokenURI + "' alt='token' class='tokenImage'></div><h4>"+tokenName+"</h4><h5>"+tokenDescription+"</h5></div>"
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
      $("#ranking li:nth-child(1) span").append(contributers[0] + "　様");
      $("#ranking li:nth-child(2) span").append(contributers[1] + "　様");
      $("#ranking li:nth-child(3) span").append(contributers[2] + "　様");
  },

  getDonaterInformation: async function(){
      const instance = await App.contracts.Donathereum.deployed();
      const name = await instance.getDonaterName();
      const balance = await instance.getBalance();
      const donateAmount = await instance.getDonaterInfo();
      $("#donaterStatus li:nth-child(1)").html("<b>名前：</b>" + name);
      $("#donaterStatus li:nth-child(2)").html("<b>保持トークン数：</b>" + balance);
      $("#donaterStatus li:nth-child(3)").html("<b>総募金額：</b>" + web3.fromWei(donateAmount, 'ether') + "<b> Ether</b>");

  }


}

$(function() {
  $(window).load(function() {
    App.init();
    $("#getLetter").hide();
  });
});
