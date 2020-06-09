

// put your own value below!
const apiKey = '30WHqCyknSLZdap1kk19lcykFC5OjzQgR2TFEzfT'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


//format query params

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

//deconstructData
function deconstructData(park){
  return {
    fullName:park.fullName,
    url:park.url,
    description:park.description
  };
}

//generateHtml
function generateHtml(responseJson){
  let Obj={};
  let arr=responseJson.data; 
  let html=''; 
  for(let i=0;i<arr.length;i++){
    Obj=deconstructData(arr[i]);
    html+=`<div><a href='${Obj.url}'>${Obj.fullName}</a></div>
    <div>${Obj.description}</div>`;
  }
   
  return html;
}

//display results
function displayResults(responseJson){

  $('#results-list').html(generateHtml(responseJson));




}


//get park info
function getParkInfo(state, maxResults=1) {
  const params = {
    stateCode: state,
    limit :maxResults
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString +`&api_key=${apiKey}`;
  
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayResults(responseJson);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}


function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const state = $('#js-search-term').val().split(',');
    const maxResults = $('#js-max-results').val();    
    getParkInfo(state, maxResults);
  });
}
  
$(watchForm);