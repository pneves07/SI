require_relative 'common'

OAUTH_CLIENT_ID     = 'pt263831205_c7469-4d753ba12ab59a59'         # OAuth client id for all OAuth requests
OAUTH_CLIENT_SECRET = '9d42c471a7d1d85f348116b23c0bcca6'
OAUTH_URL           = 'https://app12.toconline.pt/oauth'             # Root Url for all OAuth requests
API_URL             = 'https://api12.toconline.pt'                # Root Url for all API requests
OAUTH_REDIRECT_URL  = 'https://oauth.pstmn.io/v1/callback'               # A substituir posteriormente por um Url implementado pelo cliente

# Step 1. Authenticate the API session
#
# If there is an access_token still valid stored from a previous OAuth call, then this step should be skipped and the stored token used.
# If using the stored token results in a 401 UNAUTHORIZED, then a new token has to be fetched!

oauth_session_access_token, oauth_session_refresh_token = get_new_oauth_tokens()

# Get a licence from the database
lsresponse_code, response_body = do_api_get_collection(
  'customers',
  '',
  oauth_session_access_token
)

puts response_body
