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
      calculate_group_average(connection)
    end
  end

  def self.calculate_group_average(connection)
    user = User.find(connection.user_id)
    cat = connection.category
    sum = 0.0
    count = 0
    user.connections.each do |contact|
      if contact.health != nil && contact.category == cat
        if contact.health >= 0
          sum += contact.health
          count += 1
        end
      end
    end
    if count == 0
      if cat == 21
        user.update_attributes(groupOneAverage: nil)
      elsif cat == 42
        user.update_attributes(groupTwoAverage: nil)
      elsif cat == 90
        user.update_attributes(groupThreeAverage: nil)
      elsif cat == 180
        user.update_attributes(groupFourAverage: nil)
      end
    else
      average = sum/count
      group_percent = reverse_percent(average)
      if cat == 21
        user.update_attributes(groupOneAverage: group_percent)
      elsif cat == 42
        user.update_attributes(groupTwoAverage: group_percent)
      elsif cat == 90
        user.update_attributes(groupThreeAverage: group_percent)
      elsif cat == 180
        user.update_attributes(groupFourAverage: group_percent)
      end
    end
  end

  
  # this is to calculate a percentage for the user
  # on how well they're doing. Trying to get all Groups to 100%
  def self.reverse_percent(average)
    if average >= 0
      return (100 - (average * 100))
    else
      return 0
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
