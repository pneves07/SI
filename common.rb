require 'json'
require 'base64'
require 'curb'
require 'byebug'

################################################################################################################################
# 1. OAuth authentication
# Must be done before any other requests to get a valid access token for the session.
# Unless a still valid access token exists (got from a previous authentication).
################################################################################################################################

def get_authorization_code()

  oauth_authorization_url = File.join(OAUTH_URL, 'auth')

  # Get an authorization code from the OAuth serveer, passing the client_id, redirect_uri, response_type and scope in the (encoded) query string
  url = oauth_authorization_url + '?' + URI.encode_www_form(client_id: OAUTH_CLIENT_ID, redirect_uri: OAUTH_REDIRECT_URL, response_type: 'code', scope: 'commercial')
  http_response = Curl::Easy.http_get(url) do |curl|
    curl.headers['Content-Type'] = 'application/json'
  end

  # Assert that the response is a 302 REDIRECT (as should be)
  raise 'Error while retrieving an authorization code from the OAuth server: unexpected HTTP response status code ' + http_response.response_code.to_s if http_response.response_code != 302

  # Parse the HTTP response to get its headers
  _dummy_, *http_response_headers = http_response.header_str.split(/[\r\n]+/).map(&:strip)
  http_response_headers = Hash[http_response_headers.flat_map{ |s| s.scan(/^(\S+): (.+)/) }]

  # Assert that there is a 'Location' header and that it points to the correct redirect Url
  raise 'No ''Location'' header in the get authorization code request response' if not http_response_headers.has_key?('Location')
  raise 'The ''Location'' header in the get authorization code request response is incorrect' if not http_response_headers['Location'].start_with?(OAUTH_REDIRECT_URL)

  # Parse the 'Location' header to retrieve the authorization code (or the error, if any)
  # These will be set in the query portion of the redirect Url (<OAUTH_REDIRECT_URL>?code=<authorization code> or <OAUTH_REDIRECT_URL>?error=<error code>&error_description=<error message>)
  query_params = Hash[ URI::decode_www_form(URI(http_response_headers['Location']).query).to_h ]

  # Assert that no error was returned
  raise 'Error while retrieving an authorization code from the OAuth server: (' + query_params['error'] + ') ' + query_params['error_description'].to_s if not query_params['code']

  return query_params['code']

end

def exchange_authorization_code_for_tokens(authorization_code)

  oauth_tokens_url = File.join(OAUTH_URL, 'token')

  # Authorize the client and get the access and refresh tokens
  url = oauth_tokens_url #+ '?' + URI.encode_www_form(grant_type: 'authorization_code', code: authorization_code, scope: 'commercial')
  http_response = Curl::Easy.http_post(url, URI.encode_www_form(grant_type: 'authorization_code', code: authorization_code, scope: 'commercial')) do |curl|
    curl.headers['Accept'] = 'application/json'
    curl.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    # Use basic authorization in the headers (encoding the client/secret pair in base 64)
    curl.headers['Authorization'] = 'Basic ' + Base64::strict_encode64(OAUTH_CLIENT_ID + ':' + OAUTH_CLIENT_SECRET).strip
  end

  # Assert that no error was returned
  raise 'Error while retrieving the access and refresh tokens from the OAuth server: (' + http_response.response_code.to_s + ') ' + http_response.body if http_response.response_code != 200

  # Parse the (JSON) response to get to the tokens
  response_data = Hash[ JSON.parse(http_response.body).to_h ]

  # Assert that both tokens were returned
  raise 'No access token was returned from the OAuth server' if not response_data['access_token']
  raise 'No refresh token was returned from the OAuth server' if not response_data['refresh_token']

  return response_data['access_token'], response_data['refresh_token']

end

# This method is used for requesting a new set of OAuth access and refresh tokens.
# It should be used:
#   - When there are no stored tokens yet (first-time use...)
#   - When the access token has expired (session is old) AND the refresh token has also expired (session is VERY old)
#       (if the access token has expired but the refresh token has NOT expired, the next method should be used)
def get_new_oauth_tokens()

  authorization_code = get_authorization_code()
  # Success? If no exception is thrown, then all is good
  # Request new access and refresh tokens using the authorization code
  access_token, refresh_token = exchange_authorization_code_for_tokens(authorization_code)

  return access_token, refresh_token

end

def refresh_oauth_access_token_token(oauth_session_refresh_token)
  # TODO: to be exemplified in a future version :(
end

################################################################################################################################
# 2. API access methods
################################################################################################################################

def parse_http_response(http_response)

  response_code = http_response.response_code
  response_body = http_response.body

  # (See documentation)
  # When response_code = 200 (OK), the response_body will be a JSON containing the created/updated resource
  # When response_code != 200, the response_body will be a JSON include the error(s) that occurred
  # When response_code = 401 (UNAUTHORIZED):
  #   - If the response headers does NOT include a "WWW-Authenticate" header, then both tokens MUST be requested (see example method get_new_oauth_tokens() above)
  #   - If the response headers include a "WWW-Authenticate" header, then the refresh token may still be used to request a new access token
  #     This particular sequence flow is not exemplified here :(

  if response_code != 200
    # The request was unsuccessful!
    # The response body will include the error(s) that occurred (see documentation)
    raise response_body
  end

  return response_code, JSON.parse(response_body)

end

def do_api_get_collection(resource, filters, oauth_session_access_token)

  url = File.join(API_URL, resource)
  if filters != nil && filters != ''
    # Append filters to the Url query
    url = url + "?" + filters
  end

  puts url

  http_response = Curl::Easy.http_get(url) do |curl|
    curl.headers['Content-Type'] = 'application/vnd.api+json'
    curl.headers['Authorization'] = 'Bearer ' + oauth_session_access_token
  end

  return parse_http_response(http_response)

end

def do_api_get_item(resource, id, filters, oauth_session_access_token)

  url = File.join(API_URL, resource, id.to_s)
  if filters != nil && filters != ''
    # Append filters to the Url query
    url = url + "?" + filters
  end

  http_response = Curl::Easy.http_get(url) do |curl|
    curl.headers['Content-Type'] = 'application/vnd.api+json'
    curl.headers['Authorization'] = 'Bearer ' + oauth_session_access_token
  end

  return parse_http_response(http_response)

end

def do_api_post(body, oauth_session_access_token)

  resource = body[:data][:type]       # Get the resource Url to use from the "type" attribute in the body

  http_response = Curl::Easy.http_post(File.join(API_URL, resource), body.to_json) do |curl|
    curl.headers['Content-Type'] = 'application/vnd.api+json'
    curl.headers['Authorization'] = 'Bearer ' + oauth_session_access_token
  end

  return parse_http_response(http_response)

end

def do_api_patch(body, oauth_session_access_token)

  resource = body[:data][:type]       # Get the resource Url to use from the "type" attribute in the body
  id = body[:data][:id]               # Get the resource id to patch from the "id" attribute in the body

  http_response = Curl.http(:PATCH, File.join(API_URL, resource, id.to_s), body.to_json) do |curl|
    curl.headers['Content-Type'] = 'application/vnd.api+json';
    curl.headers['Authorization'] = 'Bearer ' + oauth_session_access_token
  end

  return parse_http_response(http_response)

end