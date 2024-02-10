
    let callPayapi = () => {

      validateForm();
    
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

      /*if (document.getElementById('prod').checked) {
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

let requestHeaders = (objJsonB64, salt, index) => {

var finalxVerify = buildXverify(index, salt, objJsonB64);

console.log (finalxVerify);

var header = {
    accept: 'application/json',
 'Content-Type' : 'application/json' ,
 'X-VERIFY' : finalxVerify
    };

return header;

}


let buildXverify = (index, salt, objJsonB64) => {
var endpoint = '/pg/v1/pay';
var string2 = '###';
var input = objJsonB64 + endpoint + salt; //concatenating the values
var xVerify = sha256(input); //conversion to sha 256
var finalxVerify = xVerify + string2 + index; //final checksum
return finalxVerify;

}
 

let printXverify = () => {

  var amount = document.getElementById("myText").value;

  var salt = document.getElementById("salt").value;

  var index = document.getElementById("index").value;

  var merID = document.getElementById("mid").value;

  var mTid = document.getElementById("mTid").value;

  var payload = requestPayload(amount, merID, mTid);

  var finalxVerify = buildXverify(index, salt, payload);


  console.log(finalxVerify);
  document.getElementById('xverify').innerHTML = finalxVerify;
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
      document.getElementById("redirect").value = "https://webhook.site/redirect-url"
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

  document.getElementById("salt").value = "";
  document.getElementById("index").value = "";
}

let validateForm = () =>{

  console.log('validation logic executed');
  var forms = document.getElementById('my-form');
  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}