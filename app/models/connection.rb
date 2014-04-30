class Connection < ActiveRecord::Base
  belongs_to :user
  has_many :logs


  def self.collect_data (auth, user)
    binding.pry
    # auth == oauth response object, user = current_user
    li_conns = auth.extra.raw_info.connections.values[-1]

    # FROM LINKEDIN:
      # user.linkedin_id = auth.uid
      # user.access_token = auth.credentials.token
      # user.expires_at = auth.credentials.expires_at

      # connection.first_name = li_conns[i].firstName
      # connection.last_name = li_conns[i].lastName
      # connection.linkedin_pic = li_conns[i].pictureUrl
      # connection.linkedin_id = li_conns[i].id

      # connection.linkedin_link = li_conns[i].siteStandarsProfileRequest.url

    # update user
    user_data = {
      linkedin_id: auth.uid,
      access_token: auth.credentials.token,
      expires_at: auth.credentials.expires_at
    }

    user.update_attributes(user_data)

    # create/update user's connections:
    li_conns.each do |c|
      c_data = {
        first_name: c.firstName,
        last_name: c.lastName,
        linkedin_pic: c.pictureUrl,
        linkedin_id: c.id
      }
      connection = Connection.find_by(user_id: user.id, linkedin_id: c.id)
      connection ? connection.update_attributes(c_data) : user.connections << Connection.create(c_data)
    end

  end

  def self.get_all_connections(user)
    # assemble a 'connections' array with all of the user's connections
    # need first_name, last_name, linkedin_id, category
    return Connection.where(user_id: user.id)
    # return the 'connections' array
  end

  def self.get_connection(user, connection)
    return Connection.find(connection.id)
  end

end
