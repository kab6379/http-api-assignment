const fs = require('fs');
// pull in the file system module
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// function to send response
const respond = (request, response, content, type) => {
  // set status code (200 success) and content type
  response.writeHead(200, { 'Content-Type': type });
  // write the content string or buffer to response
  response.write(content);
  // send the response to the client
  response.end();
};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondXML = (request, response, status, object) => {
  const responseXML = `<response><message>${object.message}</message></response>`;
  response.writeHead(status, { 'Content-Type': 'text/xml' });
  response.write(responseXML);
  response.end();
};

const getIndex = (request, response) => {
  respond(request, response, index, 'text/html');
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const success = (request, response, params, acceptedType) => {
  const responseJSON = {
    message: 'This is a successful response',
  };

  if (acceptedType === 'text/xml') {
    return respondXML(request, response, 200, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const badRequest = (request, response, params, acceptedType) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // if the request does not contain a valid=true query parameter
  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    if (acceptedType === 'text/xml') {
      return respondXML(request, response, 400, responseJSON);
    }
    return respondJSON(request, response, 400, responseJSON);
  }

  if (acceptedType === 'text/xml') {
    return respondXML(request, response, 200, responseJSON);
  }
  // if the parameter is here, send json with a success status code
  return respondJSON(request, response, 200, responseJSON);
};

const unauthorized = (request, response, params, acceptedType) => {
  const responseJSON = {
    message: 'You have successfully viewed the content',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    responseJSON.id = 'unauthorized';
    if (acceptedType === 'text/xml') {
      return respondXML(request, response, 401, responseJSON);
    }
    return respondJSON(request, response, 401, responseJSON);
  }

  if (acceptedType === 'text/xml') {
    return respondXML(request, response, 200, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const forbidden = (request, response, params, acceptedType) => {
  const responseJSON = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };

  if (acceptedType === 'text/xml') {
    return respondXML(request, response, 403, responseJSON);
  }
  return respondJSON(request, response, 403, responseJSON);
};

const internal = (request, response, params, acceptedType) => {
  const responseJSON = {
    message: 'Internal server error. Something went wrong.',
    id: 'internalError',
  };

  if (acceptedType === 'text/xml') {
    return respondXML(request, response, 500, responseJSON);
  }
  return respondJSON(request, response, 500, responseJSON);
};

const notImplemented = (request, response, params, acceptedType) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  if (acceptedType === 'text/xml') {
    return respondXML(request, response, 501, responseJSON);
  }
  return respondJSON(request, response, 501, responseJSON);
};

const notFound = (request, response, params, acceptedType) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  if (acceptedType === 'text/xml') {
    return respondXML(request, response, 404, responseJSON);
  }
  return respondJSON(request, response, 404, responseJSON);
};

// exports to set functions to public.
module.exports = {
  getIndex,
  getCSS,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
