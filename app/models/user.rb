class User < ActiveRecord::Base
  belongs_to :first_name
  belongs_to :last_name
  has_one :linkedin

  def self.create_with_omniauth auth
    # auth == request.env['omniauth.auth']

    # provider = auth.provider
    # linkedin_connections_array = auth.extra.raw_info.connections.values[1]

      # LinkedIn connections values:
      # => id
      # => firstName
      # => lastName
      # => industry
      # => location.name
      # => pictureUrl

    # access_token = auth.credentials.token
    # token_expiration = auth.credentials.expires_at
    # token_expires = auth.credentials.expires

    # uid = auth.uid
    # first_name = auth.info.first_name
    # last_name = auth.info.last_name
    # picture = auth.info.image

  end

end
