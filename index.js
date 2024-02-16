
    let callPayapi = () => {
      buildXverify();
      var amount = document.getElementById("myText").value;
      var saltkey = document.getElementById("salt").value;
      var index = document.getElementById("index").value;
      var merId = document.getElementById("mid").value;
      var mTid = document.getElementById("mTid").value;
      var mUid = document.getElementById("mUid").value;
      var redirectUrl = document.getElementById("redirect").value;
      var redirectMode = document.getElementById("mode").value;
      var callbackUrl = document.getElementById("callback").value;
      var mobileNumber = document.getElementById("mobile").value;
      var payload = requestPayload(amount, merId, mTid, mUid, redirectUrl, redirectMode, callbackUrl, mobileNumber);
      var finalHeaders = requestHeaders(payload, saltkey, index);
      const prodUrl = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
      const uatUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
      var environmentSelected = uatUrl;

      /* - To enable toggle between PROD and UAT
      
      if (document.getElementById('prod').checked) {
        environmentSelected = prodUrl;
      }
      
      if (document.getElementById('uat').checked) {
        environmentSelected = uatUrl;
      }*/
       
      const options = {
        method:  'post',
        url: environmentSelected,
        headers: finalHeaders,
           data: {request : payload}
          };
              
        axios
          .request(options)
            .then(function (response) {
                  console.log(response.data);
                  url = response.data.data.instrumentResponse.redirectInfo.url;
                  window.location = url;
              })
              .catch(function (error) {
                  console.error(error);
              });
}

let requestPayload = (amount, merId, mTid, mUid, redirectUrl, redirectMode, callbackUrl, mobileNumber) => {

var jsonPayload = {
  merchantId: merId,
  merchantTransactionId: mTid,
  merchantUserId: mUid,
  amount: Number(amount*100),
  redirectUrl: redirectUrl,
  redirectMode: redirectMode,
  callbackUrl: callbackUrl,
  mobileNumber: mobileNumber,
  paymentInstrument: {
    type: "PAY_PAGE"
  }
};

let objJsonStr = JSON.stringify(jsonPayload);
console.log('js object', jsonPayload);
console.log('json object', objJsonStr);
let objJsonB64 = btoa(objJsonStr);
return objJsonB64;

}

let requestHeaders = (payload, saltkey, index) => {

var finalxVerify = buildXverify(index, saltkey, payload);
console.log ('request headers pehle', finalxVerify);
var header = {
    accept: 'application/json',
 'Content-Type' : 'application/json',
 'X-VERIFY' : finalxVerify
    };
    console.log('correct x verify baad m', finalxVerify);
    return(header);

}


let buildXverify = (index, saltkey, objJsonB64) => {

var endpoint = '/pg/v1/pay';
var string2 = '###';
var input = objJsonB64 + endpoint + saltkey; //concatenating the values
var xVerify = sha256(input); //conversion to sha 256
var finalxVerify = xVerify + string2 + index; //final checksum
console.log('build', finalxVerify);
return finalxVerify;
}
 

let printXverify = () => {
 var amount = document.getElementById("myText").value;
 var saltkey = document.getElementById("salt").value;
 var index = document.getElementById("index").value;
 var merId = document.getElementById("mid").value;
 var mTid = document.getElementById("mTid").value;
 var mUid = document.getElementById("mUid").value;
 var redirectUrl = document.getElementById("redirect").value;
 var redirectMode = document.getElementById("mode").value;
 var callbackUrl = document.getElementById("callback").value;
 var mobileNumber = document.getElementById("mobile").value;
 var payload = requestPayload(amount, merId, mTid, mUid, redirectUrl, redirectMode, callbackUrl, mobileNumber);
 var finalprintxVerify = buildXverify(index, saltkey, payload);
  console.log('print', finalprintxVerify);
  document.getElementById('xverify').innerHTML = finalprintxVerify;
}




let printBase64 = () => {

  var amount = document.getElementById("myText").value;
  var merId = document.getElementById("mid").value;
  var mTid = document.getElementById("mTid").value;
  var mUid = document.getElementById("mUid").value;
  var redirectUrl = document.getElementById("redirect").value;
  var redirectMode = document.getElementById("mode").value;
  var callbackUrl = document.getElementById("callback").value;
  var mobileNumber = document.getElementById("mobile").value;
  var payload = requestPayload(amount, merId, mTid, mUid, redirectUrl, redirectMode, callbackUrl, mobileNumber);
  console.log(payload);
  document.getElementById('base64').innerHTML = payload;
}


let fillSampleDetails = () => {
  
      // Fill form fields with default values
      document.getElementById("mid").value = "PGTESTPAYUAT";
      document.getElementById("mTid").value = "MT7850590068188104";
      document.getElementById("myText").value = "100";
      document.getElementById("mUid").value = "MUID123";
      document.getElementById("redirect").value = "https://jaibatra16.github.io/PGIntegration/"
      document.getElementById("mode").value = "REDIRECT";
      document.getElementById("callback").value ="https://webhook.site/callback-url";
      document.getElementById("mobile").value = "9999999999";

      document.getElementById("salt").value = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
      document.getElementById("index").value = "1";
}
 

let clearSampleDetails = () => {
  
  // clear form
  document.getElementById("mid").value = "";
      document.getElementById("mTid").value = "";
      document.getElementById("myText").value = "";
      document.getElementById("mUid").value = "";
      document.getElementById("redirect").value = ""
      document.getElementById("mode").value = "";
      document.getElementById("callback").value ="";
      document.getElementById("mobile").value = "";
      document.getElementById("base64").value = "";
      document.getElementById("xverify").value = "";

  document.getElementById("salt").value = "";
  document.getElementById("index").value = "";
}

let fillStatusDetails = () =>{
  document.getElementById("merchantId").value = "PGTESTPAYUAT";
  document.getElementById("merchantTransactionId").value = "MT7850590068188104";
  document.getElementById("salt1").value = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  document.getElementById("index1").value = "1";
  document.getElementById("xmerchantid").value = "PGTESTPAYUAT";
}

let clearStatusDetails = () =>{
  document.getElementById("merchantId").value = "";
  document.getElementById("merchantTransactionId").value = "";
  document.getElementById("salt1").value = "";
  document.getElementById("index1").value = "";
  document.getElementById("checksumoutput").value = ""
  document.getElementById("xmerchantid").value = "";
  
}

let calculateStatusChecksum = () => {
var endpoint = '/pg/v1/status/'
var merchantId = document.getElementById("merchantId").value;
var merchantTransactionId = document.getElementById("merchantTransactionId").value;
var saltKey = document.getElementById("salt1").value;
var keyIndex = document.getElementById("index1").value;
var statusInput = endpoint + merchantId + "/" +merchantTransactionId + saltKey;
var checksum = sha256(statusInput);
var finalStatusChecksum = checksum + "###" + keyIndex;
return finalStatusChecksum;
}


let printStatusChecksum = () =>  {
var finalStatusChecksum = calculateStatusChecksum();
console.log(finalStatusChecksum);
document.getElementById('checksumoutput').innerHTML = finalStatusChecksum;
}

let callCheckStatusAPI = () => {

var merchantId = document.getElementById("merchantId").value;
var merchantTransactionId = document.getElementById("merchantTransactionId").value;
var xMerchantId = document.getElementById("merchantId").value;
var finalCheckXverify = calculateStatusChecksum();
  const options = {
    method: 'get',
    url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/'+ merchantId + "/" + merchantTransactionId,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': finalCheckXverify,
      'X-MERCHANT-ID': xMerchantId,
      },
      
  };
  axios
    .request(options)
        .then(function (response) {
        console.log(response.data);
        document.getElementById("checkStatusOutput").innerHTML = JSON.stringify(response.data, undefined, 2);
    })
    .catch(function (error) {
      console.error(error);
    });

}

