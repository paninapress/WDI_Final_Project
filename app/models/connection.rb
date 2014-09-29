class Connection < ActiveRecord::Base
  belongs_to :user
  has_many :logs


  def self.collect_data (auth, user)
    # auth == oauth response object, user == current_user
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

    # 1) Update 'user'
    user_data = {
                  linkedin_id: auth.uid,
                  access_token: auth.credentials.token,
                  expires_at: auth.credentials.expires_at
                }

    user.update_attributes(user_data)

    # 2) Create/update connections for 'user':
    li_conns.each do |c|
      c_data = {
                first_name: c.firstName,
                last_name: c.lastName,
                fullname: "#{c.firstName} #{c.lastName}",
                linkedin_pic: c.pictureUrl || "http://media1.giphy.com/media/TOW0EepfvMCLS/giphy.gif",
                linkedin_id: c.id
              }
      connection = Connection.find_by(user_id: user.id, linkedin_id: c.id)
      if connection
        connection.update_attributes(c_data)
      else
        user.connections << Connection.create(c_data)
      end
    end
  end

  def self.calculate_health(connection)
    if connection.category
      if connection.recent_log && connection.category > 11
        health = (Date.today - connection.recent_log) / connection.category
        c_health = health >= 0.0 ? health : 0.0
        connection.update_attributes(health: c_health)
      else
        connection.update_attributes(health: nil)
      end
      Group.calculate_group_averages(connection.user_id)
    end
  end

  def self.decide_to_update(id)
    updated_at = Connection.where(user_id: id).where.not(health: nil).order('updated_at ASC').first.updated_at.to_date
    current_date = DateTime.now.utc.to_date
    # if updated today then update health of each contact
    if updated_at != current_date
      Connection.where(user_id: id).where.not(health: nil).each do |contact|
          calculate_health(contact)
      end
    end
  end
  
  # def self.update_connection (connection, data)
  #   # 1) Assemble data attributes to update 'connection' with.
  #   data['category'] = data['category'].to_i
  #   if connection.category && connection.recent_log
  #     calculate_health(connection)
  #   end
  #   # 2) Update attributes for 'connection'.
  #   connection.update_attributes(data)
  #   return connection
  # end

  # def self.recalculate_health (connection)
  #   # 1a) If 'connection' has both a category and logs, calculate health.  Else set health to nil
  #   if (connection.category != 0 && connection.category != nil) && connection.logs.count > 0
  #     health = ((Date.today - connection.last_date.timestamp) / connection.category).to_f
  #     c_health = health >= 0.0 ? health : 0.0
  #     connection.update_attributes(health: c_health)
  #   else
  #     connection.update_attributes(health: 0.0)
  #   end
  # end

  # # Return log with most recent timestamp (to DRY up code):
  # def last_date
  #   return self.logs.order("timestamp DESC").first
  # end

end
